
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import Geolocation from '@react-native-community/geolocation';
// FIXED: Single import + NEW API (v5+)
import { launchImageLibrary } from 'react-native-image-picker';
import { getAccessToken } from '../../../Redux/Storage';
import { API_BASE_URL } from '../../../config';

const CreateListing = () => {
  const [cropName, setCropName] = useState("");
  const [variety, setVariety] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // CHANGED: Store multiple images
  const [selectedImages, setSelectedImages] = useState([]);

  const navigation = useNavigation();
  const { t } = useTranslation();
  const primaryColor = '#2E7D32';

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission denied', 'Location permission is required');
          setLocationLoading(false);
          return;
        }
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setLocationLoading(false);
        },
        (error) => {
          console.error('Location error:', error);
          const defaultLat = 18.5089;
          const defaultLng = 73.9259;
          setCurrentLocation({ latitude: defaultLat, longitude: defaultLng });
          setLocation(`${defaultLat}, ${defaultLng} (Default)`);
          setLocationLoading(false);
        },
        { 
          enableHighAccuracy: false, 
          timeout: 10000, 
          maximumAge: 60000 
        }
      );
    } catch (error) {
      console.error('Permission error:', error);
      setLocationLoading(false);
    }
  };

  // Multiple image picker
  const pickImage = async () => {
    if (selectedImages.length >= 5) {
      Alert.alert('Limit Reached', 'You can only select up to 5 images');
      return;
    }

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.7,
        maxWidth: 400,
        maxHeight: 400,
        includeBase64: true,
      });

      if (!result.didCancel && !result.errorCode && result.assets && result.assets[0]) {
        setSelectedImages(prev => [...prev, result.assets[0]]);
        console.log('✅ Image selected:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to open image picker');
    }
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!cropName || !variety || !quantity || !price) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }
    
    if (selectedImages.length === 0) {
      Alert.alert("Error", "Please select at least one image");
      return;
    }

    setLoading(true);
    
    try {
      const coords = currentLocation ? 
        [currentLocation.longitude, currentLocation.latitude] : 
        [73.9259, 18.5089];

      const token = await getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/api/crop-listing/add`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cropName: cropName.trim(),
          variety: variety.trim(),
          quantity: parseInt(quantity),
          price: parseFloat(price),
          harvestDate: new Date().toISOString().split('T')[0],
          location: coords,
          cropImages: selectedImages.map(img => 
            `data:${img.type};base64,${img.base64}`
          )
        })
      });
      
      const result = await response.json();
      console.log("Upload successful:", result);
      
      Alert.alert("Success", "Crop listing created successfully!", [
        { text: "OK", onPress: () => {
          setCropName(""); setVariety(""); setQuantity(""); setPrice("");
          setLocation(""); setCurrentLocation(null); setSelectedImages([]);
          navigation.goBack();
        }}
      ]);
    } catch (error) {
      console.error("Upload error:", error.message);
      Alert.alert("Error", "Failed to create listing. Please try again.");
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: primaryColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("create_listing.title")}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("create_listing.crop_info")}</Text>
        <TextInput placeholder={t("create_listing.crop_name")} value={cropName} onChangeText={setCropName} style={styles.input} placeholderTextColor="#9E9E9E" />
        <TextInput placeholder={t("create_listing.variety")} value={variety} onChangeText={setVariety} style={styles.input} placeholderTextColor="#9E9E9E" />
        <View style={styles.row}>
          <TextInput placeholder={t("create_listing.quantity")} value={quantity} onChangeText={setQuantity} keyboardType="numeric" style={[styles.input, styles.halfInput]} placeholderTextColor="#9E9E9E" />
          <TextInput placeholder={t("create_listing.price")} value={price} onChangeText={setPrice} keyboardType="numeric" style={[styles.input, styles.halfInput]} placeholderTextColor="#9E9E9E" />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("create_listing.location")}</Text>
        <TextInput placeholder={t("create_listing.enter_location")} value={location} onChangeText={setLocation} style={styles.input} placeholderTextColor="#9E9E9E" />
        <TouchableOpacity style={[styles.locationBtn, locationLoading && styles.locationBtnDisabled]} onPress={getCurrentLocation} disabled={locationLoading}>
          {locationLoading ? <ActivityIndicator size="small" color={primaryColor} /> : <Text style={styles.locationIcon}>📍</Text>}
          <Text style={[styles.locationText, { color: primaryColor }]}>{locationLoading ? ' Getting location...' : ' Use current location'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("create_listing.upload_images")} ({selectedImages.length}/5)</Text>
        <View style={styles.imageContainer}>
          {selectedImages.map((image, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: image.uri }} style={styles.selectedImage} />
              <TouchableOpacity 
                style={styles.removeImageBtn} 
                onPress={() => removeImage(index)}
              >
                <Text style={styles.removeImageText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
          {selectedImages.length < 5 && (
            <TouchableOpacity onPress={pickImage} style={[styles.addImageBtn, { borderColor: primaryColor }]}>
              <Text style={styles.imageIcon}>📸</Text>
              <Text style={styles.uploadText}>Add Photo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity style={[styles.submitBtn, { backgroundColor: primaryColor }, loading && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>{t("create_listing.submit")}</Text>}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default CreateListing;

// Styles remain the same as previous message
const styles = StyleSheet.create({
  // ... (copy all styles from previous response - no changes needed)
  container: { flex: 1, backgroundColor: "#F4F6F5" },
  header: { paddingVertical: 18, paddingHorizontal: 16, flexDirection: "row", alignItems: "center" },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center", marginRight: 12 },
  backIcon: { fontSize: 22, color: "#fff", marginBottom: 2 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  card: { backgroundColor: "#fff", marginHorizontal: 16, marginTop: 16, borderRadius: 16, padding: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardTitle: { fontSize: 14, fontWeight: "600", color: "#222", marginBottom: 12 },
  input: { height: 48, borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 12, paddingHorizontal: 14, fontSize: 14, color: "#222", marginBottom: 12, backgroundColor: "#FAFAFA" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  halfInput: { width: "48%" },
  locationBtn: { height: 44, borderRadius: 12, backgroundColor: "#E8F5E9", flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 6 },
  locationIcon: { fontSize: 16, marginRight: 6 },
  locationText: { fontSize: 14, fontWeight: "600" },
  imageContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  imageWrapper: { position: "relative" },
  addImageBtn: { width: 90, height: 90, borderRadius: 14, backgroundColor: "#E8F5E9", justifyContent: "center", alignItems: "center", borderWidth: 2, borderStyle: "dashed" },
  imageIcon: { fontSize: 26, marginBottom: 4 },
  uploadText: { fontSize: 12, color: "#666", textAlign: "center" },
  selectedImage: { width: 90, height: 90, borderRadius: 14 },
  removeImageBtn: { position: 'absolute', top: -8, right: -8, backgroundColor: '#ff4444', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  removeImageText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  submitBtn: { marginHorizontal: 16, marginTop: 24, borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  submitBtnDisabled: { backgroundColor: "#A5D6A7" },
  locationBtnDisabled: { backgroundColor: "#F0F0F0" },
});
