import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  ToastAndroid,
  Dimensions,
  PermissionsAndroid,
} from "react-native";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleGenerativeAI } from '@google/generative-ai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from "../../../config";
import { GEMINI_API_KEY } from "../../../config";

const { width } = Dimensions.get('window');
// Responsive font size calculation
const RFValue = (fontSize) => {
  const standardScreenWidth = 375;
  const scale = width / standardScreenWidth;
  return Math.round(fontSize * scale);
};

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is missing. Check your config file.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// ✅ Maximum report limit
const MAX_REPORTS = 5;

export default function CropDoctor({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState(null); // ✅ Store base64 directly
  const [diagnosis, setDiagnosis] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // ✅ Fix userId retrieval based on the stored user structure
  useEffect(() => {
    (async () => {
      try {
        // First try to get from userData key (as shown in logs)
        const userDataString = await AsyncStorage.getItem("userData");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          console.log("STORED USER DATA:", userData);
          const id = userData.id || userData._id;
          setUserId(id);
          console.log("User ID from userData:", id);
          return;
        }
        
        // Fallback to user key
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const userObj = JSON.parse(userString);
          console.log("STORED USER (fallback):", userObj);
          const id = userObj.id || userObj._id;
          setUserId(id);
          console.log("User ID from user:", id);
          return;
        }
        
        // Final fallback to direct userId
        const directId = await AsyncStorage.getItem("userId");
        setUserId(directId);
        console.log("User ID (direct):", directId);
        
      } catch (error) {
        console.error("Error retrieving user ID:", error);
      }
    })();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ];
        
        // For Android 13+ (API 33+), use READ_MEDIA_IMAGES instead of READ_EXTERNAL_STORAGE
        if (Platform.Version >= 33) {
          permissions.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
        } else {
          permissions.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        }
        
        const granted = await PermissionsAndroid.requestMultiple(permissions);
        
        const cameraGranted = granted[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED;
        const storageGranted = Platform.Version >= 33 
          ? granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === PermissionsAndroid.RESULTS.GRANTED
          : granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED;
        
        return cameraGranted && storageGranted;
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    }
    return true;
  };

  const openCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Camera and storage permissions are required to take photos.',
        [{ text: 'OK' }]
      );
      return;
    }

    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 1200,
      maxWidth: 1200,
      quality: 0.6,
      saveToPhotos: false,
    };

    launchCamera(options, (response) => {
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to open camera');
        return;
      }
      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        setImageUri(asset.uri);
        setImageBase64(asset.base64);
        setDiagnosis("");
        setIsSaved(false);
      }
    });
  };

  const openGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Storage permission is required to access photos.',
        [{ text: 'OK' }]
      );
      return;
    }

    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 1200,
      maxWidth: 1200,
      quality: 0.6,
    };

    launchImageLibrary(options, (response) => {
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to open gallery');
        return;
      }
      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        setImageUri(asset.uri);
        setImageBase64(asset.base64);
        setDiagnosis("");
        setIsSaved(false);
      }
    });
  };

  const handleDiagnose = async () => {
    if (!imageUri || !imageBase64) {
      Alert.alert("No Image", "Please select an image first");
      return;
    }

    if (!GEMINI_API_KEY) {
      Alert.alert(
        "Configuration Error",
        "Gemini API key is missing. Please check your config file."
      );
      return;
    }

    setLoading(true);
    setDiagnosis("");
    setIsSaved(false);

    try {
      const prompt =
        "Analyze this crop leaf image and identify any disease. Provide response in this exact plain text format without markdown:\n\n" +
        "DISEASE NAME:\n" +
        "[Disease name here]\n\n" +
        "SYMPTOMS:\n" +
        "- [Symptom 1]\n" +
        "- [Symptom 2]\n" +
        "- [Symptom 3]\n\n" +
        "CAUSES:\n" +
        "[Explain what causes this disease]\n\n" +
        "TREATMENT:\n" +
        "- [Treatment step 1]\n" +
        "- [Treatment step 2]\n" +
        "- [Treatment step 3]\n\n" +
        "RECOMMENDED CHEMICALS:\n" +
        "- [Chemical/Fungicide/Pesticide name 1] - [Dosage and how to apply]\n" +
        "- [Chemical/Fungicide/Pesticide name 2] - [Dosage and how to apply]\n" +
        "- [Chemical/Fungicide/Pesticide name 3] - [Dosage and how to apply]\n\n" +
        "RECOMMENDED FERTILIZERS:\n" +
        "- [Fertilizer name 1] - [NPK ratio and application method]\n" +
        "- [Fertilizer name 2] - [NPK ratio and application method]\n\n" +
        "ORGANIC ALTERNATIVES:\n" +
        "- [Organic solution 1]\n" +
        "- [Organic solution 2]\n\n" +
        "PREVENTION:\n" +
        "- [Prevention tip 1]\n" +
        "- [Prevention tip 2]\n" +
        "- [Prevention tip 3]\n\n" +
        "Keep it simple and actionable. Use plain text only, no #, **, or markdown symbols. Provide specific chemical names, brands commonly available in India, exact dosages, and application methods.";

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBase64,
            mimeType: "image/jpeg",
          },
        },
      ]);
      
      const response = await result.response;
      const resultText = response.text();
      
      setDiagnosis(resultText || "No diagnosis generated.");
    } catch (error) {
      console.error("Gemini API Error:", error);
      if (error.message?.includes("429") || error.message?.includes("quota")) {
        Alert.alert(
          "Daily Limit Reached",
          "You've reached your daily analysis limit. Please try again tomorrow."
        );
      } else if (
        error.message?.includes("API key not valid") ||
        error.message?.includes("API_KEY_INVALID")
      ) {
        Alert.alert(
          "API Key Error",
          "Gemini API key is invalid. Please create a new key and update your config."
        );
      } else {
        Alert.alert("Error", "Failed to analyze. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Check report count before saving
  const checkReportCount = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE_URL}/crop-doctor/getUserReports/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        const reportCount = response.data.data?.length || 0;
        console.log("Current report count:", reportCount);
        return reportCount;
      }
      return 0;
    } catch (error) {
      console.error("Error checking report count:", error);
      return 0;
    }
  };

  const saveDiagnosis = async () => {
    if (!userId) {
      Alert.alert("Login Required", "Please login to save diagnosis");
      return;
    }

    if (!diagnosis || !imageUri) {
      Alert.alert("Error", "No diagnosis to save");
      return;
    }

    // ✅ Check if already saved
    if (isSaved) {
      const message = "This report is already saved!";
      if (Platform.OS === "android") {
        ToastAndroid.show(message, ToastAndroid.SHORT);
      } else {
        Alert.alert("Already Saved", message);
      }
      return;
    }

    setSaving(true);

    try {
      // ✅ Check report count
      const reportCount = await checkReportCount();

      if (reportCount >= MAX_REPORTS) {
        const message = `Maximum ${MAX_REPORTS} reports can be stored. Please delete old reports to save new ones.`;

        if (Platform.OS === "android") {
          ToastAndroid.show(message, ToastAndroid.LONG);
        }

        Alert.alert("Storage Limit Reached", message, [
          // {
          //   text: "View Reports",
          //   onPress: () => navigation.navigate("DiagnosisHistory"),
          // },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]);
        setSaving(false);
        return;
      }

      // Get token
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Session Expired", "Please login again to save diagnosis", [
          {
            text: "Login",
            onPress: () => navigation.navigate("Login"),
          },
        ]);
        setSaving(false);
        return;
      }

      // Create FormData
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("diagnosis", diagnosis);

      const imageFile = {
        uri: imageUri,
        type: "image/jpeg",
        name: `crop_diagnosis_${Date.now()}.jpg`,
      };
      formData.append("diagnosisImage", imageFile);

      console.log("Saving diagnosis...");

      // Send request
      const response = await axios.post(
        `${API_BASE_URL}/crop-doctor/saveReport`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000,
        }
      );

      console.log("✅ Save response:", response.data);

      if (response.data.status === "success") {
        setIsSaved(true);

        // Show success toast
        if (Platform.OS === "android") {
          ToastAndroid.show("Diagnosis saved successfully! 🌾", ToastAndroid.SHORT);
        }

        Alert.alert("Success", "Diagnosis saved successfully!", [
          {
            text: "View Reports",
            onPress: () => navigation.navigate("DiagnosisHistory"),
          },
          {
            text: "New Analysis",
            onPress: () => {
              setImageUri(null);
              setImageBase64(null);
              setDiagnosis("");
              setIsSaved(false);
            },
          },
        ]);
      } else {
        throw new Error(response.data.message || "Failed to save");
      }
    } catch (error) {
      console.error("Save error:", error);

      if (error.response?.status === 401) {
        Alert.alert("Session Expired", "Please login again", [
          {
            text: "Login",
            onPress: () => navigation.navigate("Login"),
          },
        ]);
      } else {
        Alert.alert(
          "Error",
          error.response?.data?.message ||
            "Failed to save diagnosis. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <MaterialCommunityIcons name="leaf" size={32} color="#4CAF50" />
            <Text style={styles.headerTitle}>Crop Doctor</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Main Content */}
        {!imageUri ? (
          <View style={styles.emptyCard}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="image-plus"
                size={60}
                color="#4CAF50"
              />
            </View>
            <Text style={styles.emptyTitle}>No Image Selected</Text>
            <Text style={styles.emptySubtitle}>
              Upload a leaf photo to get started
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={openCamera}
              >
                <Ionicons name="camera" size={24} color="#fff" />
                <Text style={styles.buttonText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={openGallery}
              >
                <Ionicons name="images" size={24} color="#4CAF50" />
                <Text style={styles.secondaryButtonText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.imageCard}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => {
                  setImageUri(null);
                  setImageBase64(null);
                  setDiagnosis("");
                  setIsSaved(false);
                }}
              >
                <Ionicons name="close-circle" size={32} color="#fff" />
              </TouchableOpacity>
            </View>

            {!diagnosis && !loading && (
              <TouchableOpacity
                style={styles.analyzeButton}
                onPress={handleDiagnose}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="microscope"
                  size={24}
                  color="#fff"
                />
                <Text style={styles.analyzeText}>Analyze Leaf</Text>
              </TouchableOpacity>
            )}

            {loading && (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Analyzing...</Text>
              </View>
            )}

            {diagnosis && (
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Ionicons name="document-text" size={24} color="#4CAF50" />
                  <Text style={styles.resultTitle}>Diagnosis Report</Text>
                  {isSaved && (
                    <View style={styles.savedBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#4caf50"
                      />
                      <Text style={styles.savedBadgeText}>Saved</Text>
                    </View>
                  )}
                </View>

                <View style={styles.resultContent}>
                  <Text style={styles.resultText}>{diagnosis}</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      (saving || isSaved) && styles.saveButtonDisabled,
                    ]}
                    onPress={saveDiagnosis}
                    disabled={saving || isSaved}
                  >
                    {saving ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : isSaved ? (
                      <>
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color="#fff"
                        />
                        <Text style={styles.saveButtonText}>Saved</Text>
                      </>
                    ) : (
                      <>
                        <Ionicons
                          name="save-outline"
                          size={20}
                          color="#fff"
                        />
                        <Text style={styles.saveButtonText}>Save</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.newButton}
                    onPress={() => {
                      setImageUri(null);
                      setImageBase64(null);
                      setDiagnosis("");
                      setIsSaved(false);
                    }}
                  >
                    <Ionicons name="refresh" size={20} color="#4CAF50" />
                    <Text style={styles.newButtonText}>New Analysis</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Fixed Bottom Button - View Reports */}
      <View style={styles.bottomBar}>
        {/* <TouchableOpacity
          style={styles.viewReportsButton}
          onPress={() => navigation.navigate("DiagonsisHistory")}
          activeOpacity={0.8}
        >
          <Ionicons name="folder-open-outline" size={24} color="#fff" />
          <Text style={styles.viewReportsText}>View Reports</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f8fa",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f0f8f9",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    fontSize: RFValue(22),
    fontWeight: "700",
    color: "#4CAF50",
    marginLeft: 12,
  },
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e8f4f5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: RFValue(20),
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: RFValue(14),
    color: "#888",
    marginBottom: 32,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    width: "100%",
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f8f9",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#4CAF50",
    gap: 6,
  },
  quickActionText: {
    color: "#4CAF50",
    fontSize: RFValue(14),
    fontWeight: "600",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: RFValue(16),
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#e8f4f5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    color: "#4CAF50",
    fontSize: RFValue(16),
    fontWeight: "600",
  },
  imageCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 20,
    marginBottom: 20,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
  },
  removeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 4,
  },
  analyzeButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  analyzeText: {
    color: "#fff",
    fontSize: RFValue(18),
    fontWeight: "700",
  },
  loadingBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: RFValue(16),
    color: "#4CAF50",
    marginTop: 16,
    fontWeight: "600",
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#e8f4f5",
  },
  resultTitle: {
    fontSize: RFValue(18),
    fontWeight: "700",
    color: "#4CAF50",
    marginLeft: 10,
    flex: 1,
  },
  savedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  savedBadgeText: {
    fontSize: RFValue(12),
    fontWeight: "600",
    color: "#4caf50",
  },
  resultContent: {
    marginBottom: 24,
  },
  resultText: {
    fontSize: RFValue(15),
    color: "#444",
    lineHeight: 26,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: "#a0c4c7",
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: RFValue(16),
    fontWeight: "600",
  },
  newButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e8f4f5",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  newButtonText: {
    color: "#4CAF50",
    fontSize: RFValue(16),
    fontWeight: "600",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: Platform.OS === "ios" ? 20 : 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 10,
  },
  viewReportsButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    marginBottom: 36,
  },
  viewReportsText: {
    color: "#fff",
    fontSize: RFValue(16),
    fontWeight: "700",
  },
});