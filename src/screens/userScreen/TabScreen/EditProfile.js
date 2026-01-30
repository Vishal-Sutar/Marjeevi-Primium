import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import apiService from "../../../Redux/apiService";
import { launchImageLibrary } from "react-native-image-picker";
import { API_BASE_URL } from "../../../config";
import { getAccessToken } from "../../../Redux/Storage";

const EditProfile = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageNew, setProfileImageNew] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await apiService.getProfileDetails();
      if (res) {
        setFormData({
          firstName: res.firstName || "",
          lastName: res.lastName || "",
          emailId: res.emailId || "",
        });
        
        let imageUri = null;
        if (res?.profileImage) {
          if (typeof res.profileImage === "object" && res.profileImage.url) {
            imageUri = res.profileImage.url;
          } else if (
            typeof res.profileImage === "string" &&
            res.profileImage !== "null" &&
            res.profileImage !== "undefined"
          ) {
            imageUri = res.profileImage;
          }
        }
        setProfileImage(imageUri);
      }
    } catch (e) {
      console.log("Profile fetch error:", e);
    }
  };

  const pickImage = async () => {
    launchImageLibrary(
      { mediaType: "photo", quality: 0.7, maxWidth: 400, maxHeight: 400, includeBase64: true },
      async (response) => {
        if (response.didCancel || response.errorCode) return;

        const asset = response.assets[0];
        setProfileImageNew(asset);
        setUploading(true);

        try {
          const token = await getAccessToken();

          const apiResponse = await fetch(
            `${API_BASE_URL}/api/user/update-profile`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                profileImage: `data:${asset.type};base64,${asset.base64}`,
              }),
            },
          );

          if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            throw new Error(
              errorData.message || `HTTP error! status: ${apiResponse.status}`,
            );
          }

          const data = await apiResponse.json();
          console.log("Upload successful:", data);

          setProfileImage(asset.uri);
          setProfileImageNew(null);
          await fetchProfile();
          Alert.alert("Success", "Profile image updated successfully");
        } catch (error) {
          console.error("Upload error:", error.message);
          Alert.alert("Error", error.message || "Failed to update profile");
        } finally {
          setUploading(false);
        }
      },
    );
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const token = await getAccessToken();
      
      const apiResponse = await fetch(
        `${API_BASE_URL}/api/user/update-profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${apiResponse.status}`,
        );
      }

      Alert.alert("Success", "Profile updated successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#F97316" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          <View>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <Text style={styles.headerSub}>Update your information</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* PROFILE ICON */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatar} onPress={pickImage}>
            {uploading ? (
              <ActivityIndicator color="#F97316" />
            ) : profileImageNew?.uri || profileImage ? (
              <Image
                source={{ uri: profileImageNew?.uri || profileImage }}
                style={styles.avatarImage}
              />
            ) : (
              <Icon name="person-outline" size={40} color="#F97316" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
            <Icon name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(text) =>
                setFormData({ ...formData, firstName: text })
              }
              placeholder="Enter first name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(text) =>
                setFormData({ ...formData, lastName: text })
              }
              placeholder="Enter last name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.emailId}
              onChangeText={(text) =>
                setFormData({ ...formData, emailId: text })
              }
              placeholder="Enter email"
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity
            style={[styles.updateBtn, loading && styles.updateBtnDisabled]}
            onPress={handleUpdate}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.updateText}>Update Profile</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  header: {
    backgroundColor: "#F97316",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  headerSub: {
    color: "#FFE4C7",
    fontSize: 12,
    marginTop: 2,
  },

  container: {
    flex: 1,
    padding: 16,
  },

  avatarSection: {
    alignItems: "center",
    marginVertical: 20,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FFF7ED",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: "38%",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F97316",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#F7F9FC",
  },

  form: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    marginBottom: 20,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111827",
  },

  updateBtn: {
    backgroundColor: "#F97316",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },

  updateBtnDisabled: {
    opacity: 0.6,
  },

  updateText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
