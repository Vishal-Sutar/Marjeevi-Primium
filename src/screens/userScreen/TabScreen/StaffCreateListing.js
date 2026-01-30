import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import apiService from "../../../Redux/apiService";
import Geolocation from "@react-native-community/geolocation";
import { launchImageLibrary } from "react-native-image-picker";
import { getAccessToken } from "../../../Redux/Storage";
import { API_BASE_URL } from "../../../config";

const StaffCreateListing = () => {
  /* ================= HOOKS (DO NOT MOVE) ================= */
  const navigation = useNavigation();

  /* ================= FARMER ================= */
  const [farmers, setFarmers] = useState([]);
  const [showFarmerPicker, setShowFarmerPicker] = useState(false);
  const [selectedFarmerId, setSelectedFarmerId] = useState("");
  const [selectedFarmerName, setSelectedFarmerName] = useState("");

  /* ================= FORM ================= */
  const [cropName, setCropName] = useState("");
  const [variety, setVariety] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]); // ⚠️ NEVER null
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const primaryColor = "#F97316";

  /* ================= FETCH FARMERS ================= */
  const fetchFarmers = async () => {
    try {
      const res = await apiService.getAllFarmers();
      setFarmers(Array.isArray(res) ? res : []);
    } catch {
      Alert.alert("Error", "Failed to load farmers");
    }
  };

  const handleFarmerSelect = (farmer) => {
    setSelectedFarmerId(farmer._id);
    setSelectedFarmerName(`${farmer.firstName} ${farmer.lastName}`);
    setShowFarmerPicker(false);
  };

  /* ================= LOCATION ================= */
  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setLocationLoading(false);
          return;
        }
      }

      Geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentLocation({ latitude, longitude });
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setLocationLoading(false);
        },
        () => setLocationLoading(false)
      );
    } catch {
      setLocationLoading(false);
    }
  };

  /* ================= IMAGE PICKER ================= */
  const pickImage = async () => {
    if (selectedImages.length >= 5) {
      Alert.alert("Limit", "Maximum 5 images allowed");
      return;
    }

    const res = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.7,
      includeBase64: true,
    });

    if (!res.didCancel && res.assets?.length) {
      setSelectedImages((prev) => [...prev, res.assets[0]]);
    }
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!selectedFarmerId) {
      Alert.alert("Error", "Please select a farmer");
      return;
    }

    if (!cropName || !variety || !quantity || !price) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (selectedImages.length === 0) {
      Alert.alert("Error", "Please upload at least one image");
      return;
    }

    setLoading(true);

    try {
      const token = await getAccessToken();
      const coords = currentLocation
        ? [currentLocation.longitude, currentLocation.latitude]
        : [73.9259, 18.5089];

      const payload = {
        userId: selectedFarmerId,
        cropName: cropName.trim(),
        variety: variety.trim(),
        quantity: Number(quantity),
        price: Number(price),
        harvestDate: new Date().toISOString().split("T")[0],
        location: coords,
        cropImages: selectedImages.map(
          (img) => `data:${img.type};base64,${img.base64}`
        ),
      };

      await fetch(`${API_BASE_URL}/api/crop-listing/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      Alert.alert("Success", "Crop listing created", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert("Error", "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: primaryColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Listing for Farmer</Text>
      </View>

      {/* FARMER */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Select Farmer</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => {
            fetchFarmers();
            setShowFarmerPicker(!showFarmerPicker);
          }}
        >
          <Text
            style={
              selectedFarmerId ? styles.inputText : styles.placeholderText
            }
          >
            {selectedFarmerName || "Tap to select farmer"}
          </Text>
          <Text>▼</Text>
        </TouchableOpacity>

        {showFarmerPicker && (
          <View style={styles.dropdown}>
            {farmers.map((f) => (
              <TouchableOpacity
                key={f._id}
                style={styles.farmerItem}
                onPress={() => handleFarmerSelect(f)}
              >
                <Text style={styles.farmerName}>
                  {f.firstName} {f.lastName}
                </Text>
                <Text style={styles.phone}>{f.phone}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* CROP INFO */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Crop Information</Text>

        <TextInput
          placeholder="Crop Name"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={cropName}
          onChangeText={setCropName}
        />

        <TextInput
          placeholder="Variety"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={variety}
          onChangeText={setVariety}
        />

        <View style={styles.row}>
          <TextInput
            placeholder="Quantity (kg)"
            placeholderTextColor="#9CA3AF"
            style={[styles.input, styles.half]}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />
          <TextInput
            placeholder="Price (₹/kg)"
            placeholderTextColor="#9CA3AF"
            style={[styles.input, styles.half]}
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
        </View>
      </View>

      {/* LOCATION */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Location</Text>
        <TextInput
          placeholder="Enter farmer location"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={location}
          onChangeText={setLocation}
        />
        <TouchableOpacity style={styles.locationBtn} onPress={getCurrentLocation}>
          {locationLoading ? (
            <ActivityIndicator color={primaryColor} />
          ) : (
            <Text style={{ color: primaryColor }}>📍 Use current location</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* IMAGES */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Upload Images ({selectedImages.length}/5)
        </Text>

        <View style={styles.imageRow}>
          {selectedImages.map((img, i) => (
            <View key={i} style={styles.imageWrap}>
              <Image source={{ uri: img.uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.remove}
                onPress={() => removeImage(i)}
              >
                <Text style={{ color: "#fff" }}>×</Text>
              </TouchableOpacity>
            </View>
          ))}

          {selectedImages.length < 5 && (
            <TouchableOpacity style={styles.addImage} onPress={pickImage}>
              <Text>📸</Text>
              <Text>Add Photo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* SUBMIT */}
      <TouchableOpacity
        style={[styles.submitBtn, loading && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Create Listing</Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default StaffCreateListing;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { backgroundColor: "#F9FAFB" },

  header: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: { fontSize: 28, color: "#fff", marginRight: 10 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 14,
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: { fontWeight: "600", marginBottom: 10 },

  selector: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  placeholderText: { color: "#9CA3AF" },
  inputText: { color: "#111827" },

  dropdown: { marginTop: 10 },
  farmerItem: { paddingVertical: 10 },
  farmerName: { fontWeight: "600", color: "#111827" },
  phone: { color: "#6B7280" },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    color: "#111827",          // ✅ FIXED TEXT COLOR
    backgroundColor: "#fff",   // ✅ FIXED ANDROID ISSUE
  },

  row: { flexDirection: "row", gap: 10 },
  half: { flex: 1 },

  locationBtn: { marginTop: 10 },

  imageRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  imageWrap: { position: "relative", margin: 5 },
  image: { width: 80, height: 80, borderRadius: 8 },
  remove: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  addImage: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#F97316",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  submitBtn: {
    backgroundColor: "#F97316",
    margin: 16,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "600" },
});
