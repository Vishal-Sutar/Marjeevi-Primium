import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import DatePicker from 'react-native-date-picker';
import apiService from "../../../Redux/apiService";
import { getUserData } from "../../../Redux/Storage";

const AddCrop = ({ navigation }) => {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [cropName, setCropName] = useState("");
  const [area, setArea] = useState("");
  const [unit, setUnit] = useState("acre");
  const [sowingDate, setSowingDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFarmPicker, setShowFarmPicker] = useState(false);

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const user = await getUserData();
      const response = await apiService.getFarmsByUserId(user?.id);
      setFarms(response?.data || []);
    } catch (error) {
      console.error("Fetch farms error:", error);
    }
  };

  const handleSave = async () => {
    if (!cropName.trim() || !selectedFarm || !area) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const user = await getUserData();
      const payload = {
        userId: user?.id,
        farmId: selectedFarm._id,
        cropName: cropName.trim(),
        area: area,
        unit: unit,
        sowingDate: sowingDate.toISOString().split('T')[0],
      };

      await apiService.addCrop(payload);
      Alert.alert("Success", "Crop added successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Add crop error:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to add crop");
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
        <Text style={styles.headerTitle}>Add Crop</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Select Farm</Text>
        <TouchableOpacity
          style={styles.picker}
          onPress={() => setShowFarmPicker(!showFarmPicker)}
        >
          <Text style={selectedFarm ? styles.pickerText : styles.pickerPlaceholder}>
            {selectedFarm ? selectedFarm.farmName : "Choose farm"}
          </Text>
          <Icon name="arrow-drop-down" size={24} color="#666" />
        </TouchableOpacity>

        {showFarmPicker && (
          <View style={styles.pickerOptions}>
            {farms.map((farm) => (
              <TouchableOpacity
                key={farm._id}
                style={styles.pickerOption}
                onPress={() => {
                  setSelectedFarm(farm);
                  setShowFarmPicker(false);
                }}
              >
                <Text style={styles.pickerOptionText}>{farm.farmName}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

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
            <Text style={styles.saveButtonText}>Add Crop</Text>
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
  picker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  pickerText: {
    fontSize: 16,
    color: "#000",
  },
  pickerPlaceholder: {
    fontSize: 16,
    color: "#999",
  },
  pickerOptions: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 8,
    elevation: 2,
  },
  pickerOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  pickerOptionText: {
    fontSize: 16,
    color: "#000",
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

export default AddCrop;
