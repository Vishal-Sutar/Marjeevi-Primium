import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import DatePicker from 'react-native-date-picker';
import apiService from "../../../Redux/apiService";

const EditCrop = ({ route, navigation }) => {
  const { crop } = route.params;
  const [cropName, setCropName] = useState(crop.cropName);
  const [area, setArea] = useState(crop.area?.toString() || "");
  const [unit, setUnit] = useState(crop.unit || "acre");
  const [sowingDate, setSowingDate] = useState(crop.sowingDate ? new Date(crop.sowingDate) : new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!cropName.trim() || !area) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        cropName: cropName.trim(),
        area: area,
        unit: unit,
        sowingDate: sowingDate.toISOString().split('T')[0],
      };

      await apiService.updateCropById(crop._id, payload);
      Alert.alert("Success", "Crop updated successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Update crop error:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to update crop");
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
        <Text style={styles.headerTitle}>Edit Crop</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Crop Name</Text>
        <TextInput
          style={styles.input}
          value={cropName}
          onChangeText={setCropName}
          placeholder="Enter crop name"
        />

        <Text style={styles.label}>Area</Text>
        <TextInput
          style={styles.input}
          value={area}
          onChangeText={setArea}
          placeholder="Enter area"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Unit</Text>
        <TextInput
          style={styles.input}
          value={unit}
          onChangeText={setUnit}
          placeholder="acre"
        />

        <Text style={styles.label}>Sowing Date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setOpenDatePicker(true)}
        >
          <Text style={styles.dateText}>{sowingDate.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>

        <DatePicker
          modal
          open={openDatePicker}
          date={sowingDate}
          mode="date"
          onConfirm={(date) => {
            setOpenDatePicker(false);
            setSowingDate(date);
          }}
          onCancel={() => setOpenDatePicker(false)}
        />

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
      </ScrollView>
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
  dateText: {
    fontSize: 16,
    color: "#000",
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

export default EditCrop;
