import { useState, useRef, useEffect } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, PermissionsAndroid, Platform, Modal } from "react-native";
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import Icon from "react-native-vector-icons/MaterialIcons";
import { GOOGLE_MAPS_API_KEY } from "../../../config";
import apiService from "../../../Redux/apiService";
import { getUserData } from "../../../Redux/Storage";

const AddFarm = ({ navigation }) => {
  const [region, setRegion] = useState({
    latitude: 18.5204,
    longitude: 73.8567,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [farmName, setFarmName] = useState("");
  const [farmArea, setFarmArea] = useState(0);
  const [unit, setUnit] = useState("acre");
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    const initLocation = async () => {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getCurrentLocation();
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        getCurrentLocation();
      }
    };
    initLocation();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        setRegion(prev => ({ ...prev, latitude, longitude }));
        mapRef.current?.animateToRegion({ latitude, longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 }, 1000);
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  const handleMapPress = (e) => {
    setMarkers([...markers, e.nativeEvent.coordinate]);
  };

  const removeLastMarker = () => {
    if (markers.length > 0) {
      setMarkers(markers.slice(0, -1));
    }
  };

  const calculateArea = (coordinates) => {
    if (coordinates.length < 3) return 0;
    const earthRadius = 6371000;
    let area = 0;
    for (let i = 0; i < coordinates.length; i++) {
      const j = (i + 1) % coordinates.length;
      const lat1 = coordinates[i].latitude * Math.PI / 180;
      const lat2 = coordinates[j].latitude * Math.PI / 180;
      const lng1 = coordinates[i].longitude * Math.PI / 180;
      const lng2 = coordinates[j].longitude * Math.PI / 180;
      area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }
    area = Math.abs(area * earthRadius * earthRadius / 2);
    return area / 4046.86;
  };

  const handleNext = () => {
    if (markers.length < 3) {
      Alert.alert("Insufficient Markers", "Please place at least 3 markers to define your farm area");
      return;
    }
    const calculatedArea = calculateArea(markers);
    setFarmArea(calculatedArea);
    setShowModal(true);
  };

  const handleUnitChange = (newUnit) => {
    if (newUnit !== unit) {
      const converted = unit === "acre" ? farmArea * 0.404686 : farmArea / 0.404686;
      setFarmArea(converted);
      setUnit(newUnit);
    }
  };

  const handleSaveFarm = async () => {
    if (!farmName.trim()) {
      Alert.alert("Error", "Please enter farm name");
      return;
    }
    setLoading(true);
    try {
      const user = await getUserData();
      const payload = {
        userId: user?.id,
        farmName: farmName,
        farmArea: parseFloat(farmArea.toFixed(2)),
        unit: unit,
        geojson: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [markers.map(m => [m.longitude, m.latitude])]
          }
        }
      };
      
      console.log('📍 Sending farm data:', payload);
      const response = await apiService.addFarm(payload);
      console.log('✅ Farm added response:', response);
      Alert.alert("Success", "Farm added successfully");
      navigation.goBack();
    } catch (error) {
      console.error('❌ Farm add error:', error.response?.data);
      Alert.alert("Error", error.response?.data?.message || "Failed to add farm");
    } finally {
      setLoading(false);
    }
  };

  const searchLocation = async () => {
    if (!searchText.trim()) return;
    
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchText)}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        const newRegion = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Farm</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search nearby address"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={searchLocation}
        />
        <TouchableOpacity onPress={searchLocation} style={styles.searchButton}>
          <Icon name="search" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={getCurrentLocation} style={styles.locationButton}>
          <Icon name="my-location" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onPress={handleMapPress}
        mapType="satellite"
        showsUserLocation
        showsMyLocationButton={false}
      >
        {currentLocation && (
          <Marker coordinate={currentLocation} title="Your Location">
            <View style={styles.currentLocationMarker}>
              <View style={styles.currentLocationDot} />
            </View>
          </Marker>
        )}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
            pinColor={index === 0 ? "red" : "blue"}
          />
        ))}
        {markers.length >= 3 && (
          <Polygon
            coordinates={markers}
            strokeColor="#FF0000"
            fillColor="rgba(255,0,0,0.3)"
            strokeWidth={2}
          />
        )}
      </MapView>

      {markers.length > 0 && (
        <TouchableOpacity onPress={removeLastMarker} style={styles.undoButton}>
          <Icon name="undo" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backFooterButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.markerInfo}>
        <Text style={styles.markerInfoText}>{markers.length} markers placed</Text>
      </View>

      <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Farm</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Enter Farm name" value={farmName} onChangeText={setFarmName} />
            <TextInput style={styles.input} placeholder="Farm area" value={farmArea.toFixed(2)} onChangeText={(text) => setFarmArea(parseFloat(text) || 0)} keyboardType="decimal-pad" />
            <View style={styles.unitContainer}>
              <TouchableOpacity style={[styles.unitButton, unit === "acre" && styles.unitButtonActive]} onPress={() => handleUnitChange("acre")}>
                <Text style={[styles.unitText, unit === "acre" && styles.unitTextActive]}>Acre</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.unitButton, unit === "hectare" && styles.unitButtonActive]} onPress={() => handleUnitChange("hectare")}>
                <Text style={[styles.unitText, unit === "hectare" && styles.unitTextActive]}>Hectare</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.nextModalButton} onPress={handleSaveFarm} disabled={loading}>
                <Text style={styles.nextModalButtonText}>{loading ? "Saving..." : "Next"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddFarm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 4,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  searchContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  searchButton: {
    width: 48,
    height: 48,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  locationButton: {
    width: 48,
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  map: {
    flex: 1,
  },
  undoButton: {
    position: "absolute",
    right: 16,
    top: 200,
    width: 48,
    height: 48,
    backgroundColor: "#ff6b6b",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
  },
  backFooterButton: {
    width: 56,
    height: 56,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButton: {
    flex: 1,
    height: 56,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  markerInfo: {
    position: "absolute",
    top: 140,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  markerInfoText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  input: {
    height: 56,
    borderWidth: 2,
    borderColor: "#6b4ce6",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  unitContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  unitButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: "#fff",
  },
  unitButtonActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  unitText: {
    fontSize: 16,
    color: "#666",
  },
  unitTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
  },
  nextModalButton: {
    flex: 1,
    height: 56,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  nextModalButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    flex: 1,
    height: 56,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 18,
    fontWeight: "bold",
  },
  currentLocationMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(66, 133, 244, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  currentLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4285F4",
    borderWidth: 2,
    borderColor: "#fff",
  },
});
