import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import apiService from "../../../Redux/apiService";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";

const ScreenFourth = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  
  const [cropName, setCropName] = useState("");
  const [season, setSeason] = useState("kharif");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await apiService.getProfileDetails();
      const userData = response.data || response;
      
      if (userData && userData.cropsGrown && userData.cropsGrown.length > 0) {
        const firstCrop = userData.cropsGrown[0];
        setCropName(firstCrop.cropName || "");
        setSeason(firstCrop.season || "kharif");
        setQuantity(firstCrop.quantityProduced || "");
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleUpdate = async () => {
    if (!cropName) {
      Alert.alert("Error", "Please enter crop name");
      return;
    }

    setLoading(true);
    try {
      const profileData = {
        cropsGrown: [{
          cropName,
          season,
          quantityProduced: quantity
        }]
      };
      
      await apiService.UpdateProfileData(profileData);
      Alert.alert("Success", "Crops grown updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert("Error", "Failed to update crops grown");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back-outline" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.stepText}>Crops Grown</Text>
        </View>
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <View style={styles.iconWrapper}>
          <Icon name="leaf-outline" size={20} color="#2E7D32" />
        </View>

        <Text style={styles.cardTitle}>Edit Crops Grown</Text>
        <Text style={styles.cardSubtitle}>Update your crop information</Text>

        {loading ? (
          <ActivityIndicator color="#2E7D32" style={{ marginTop: 20 }} />
        ) : (
          <>
            <Text style={styles.label}>Crop Name</Text>
            <TextInput
              placeholder="Enter crop name"
              style={styles.input}
              value={cropName}
              onChangeText={setCropName}
            />

            <Text style={styles.label}>Season</Text>
            <View style={styles.seasonContainer}>
              {["kharif", "rabi", "zaid"].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.seasonBtn, season === s && styles.seasonBtnActive]}
                  onPress={() => setSeason(s)}
                >
                  <Text style={[styles.seasonText, season === s && styles.seasonTextActive]}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Quantity Produced (optional)</Text>
            <TextInput
              placeholder="Enter quantity"
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
            />
          </>
        )}
      </View>

      {/* UPDATE BUTTON */}
      <TouchableOpacity 
        style={[styles.updateBtn, loading && styles.updateBtnDisabled]} 
        onPress={handleUpdate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.updateText}>Save Changes</Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

export default ScreenFourth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F5",
  },

  /* HEADER */
  header: {
    padding: 16,
    backgroundColor: "#F4F6F5",
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EDEDED",
    justifyContent: "center",
    alignItems: "center",
  },

  stepText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },

  /* CARD */
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 16,
    marginTop: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
    color: "#333",
  },

  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#FAFAFA",
    fontSize: 14,
  },

  seasonContainer: {
    flexDirection: "row",
    gap: 8,
  },

  seasonBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
  },

  seasonBtnActive: {
    backgroundColor: "#E8F5E9",
    borderColor: "#2E7D32",
  },

  seasonText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },

  seasonTextActive: {
    color: "#2E7D32",
    fontWeight: "600",
  },

  /* UPDATE BUTTON */
  updateBtn: {
    backgroundColor: "#2E7D32",
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },

  updateBtnDisabled: {
    opacity: 0.5,
  },

  updateText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});