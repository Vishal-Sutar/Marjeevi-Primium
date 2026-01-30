import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import apiService from "../../../Redux/apiService";

const EditFarm = ({ route, navigation }) => {
  const { farm } = route.params;
  const [farmName, setFarmName] = useState(farm.farmName);
  const [farmArea, setFarmArea] = useState(farm.farmArea.toString());
  const [unit, setUnit] = useState(farm.unit);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!farmName.trim()) {
      Alert.alert("Error", "Please enter farm name");
      return;
    }
    if (!farmArea || parseFloat(farmArea) <= 0) {
      Alert.alert("Error", "Please enter valid area");
      return;
    }

    setLoading(true);
    try {
      await apiService.updateFarmById(farm._id, {
        farmName: farmName.trim(),
        farmArea: parseFloat(farmArea),
        unit,
      });
      Alert.alert("Success", "Farm updated successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Update farm error:", error);
      Alert.alert("Error", "Failed to update farm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Farm</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Farm Name</Text>
        <TextInput
          style={styles.input}
          value={farmName}
          onChangeText={setFarmName}
          placeholder="Enter farm name"
        />

        <Text style={styles.label}>Farm Area</Text>
        <TextInput
          style={styles.input}
          value={farmArea}
          onChangeText={setFarmArea}
          placeholder="Enter area"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Unit</Text>
        <View style={styles.unitContainer}>
          <TouchableOpacity
            style={[styles.unitButton, unit === "acre" && styles.unitButtonActive]}
            onPress={() => setUnit("acre")}
          >
            <Text style={[styles.unitText, unit === "acre" && styles.unitTextActive]}>Acre</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.unitButton, unit === "hectare" && styles.unitButtonActive]}
            onPress={() => setUnit("hectare")}
          >
            <Text style={[styles.unitText, unit === "hectare" && styles.unitTextActive]}>Hectare</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  unitContainer: {
    flexDirection: "row",
    gap: 12,
  },
  unitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  unitButtonActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  unitText: {
    fontSize: 14,
    color: "#666",
  },
  unitTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 32,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EditFarm;
