import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Alert,
  FlatList,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import apiService from "../../../Redux/apiService";
import Icon from 'react-native-vector-icons/Ionicons';

const AddPurchaseEntry = () => {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    farmer: "",
    farmerName: "", 
    crop: "",
    rate: "",
    quantity: "",
    procurementDate: "",
    procurementCenter: "",
    godown: "",
    vehicle: "",
    remarks: "",
  });

 const [openProcurement, setOpenProcurement] = useState(false);
const [farmers, setFarmers] = useState([]);
const [showFarmerModal, setShowFarmerModal] = useState(false);
  const navigation = useNavigation();

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

 const handleSave  = async() => {
   if (
    !form.farmer ||
    !form.crop ||
    !form.rate ||
    !form.quantity ||
    !form.procurementDate ||
    !form.procurementCenter ||
    !form.godown || "",
    !form.vehicle || "",
    !form.remarks || ""

   ) {
     Alert.alert(t("error"), t("fill_required_fields"));
        return;
   }
try {
    await apiService.Stafproduct(form)
    console.log("ADD PRODUCT DATA Succeffuly 👉", form)
    navigation.navigate("Performance")
} catch (error) {
    console.log(error)
}
    
  };

  const fetchFarmers = async () => {
  try {
    const res = await apiService.getAllFarmers();
    console.log("res....",res);
    
    setFarmers(res || []);
  } catch (error) {
    console.log("Farmer fetch error", error);
  }
};

useEffect(() => {
  fetchFarmers();
}, []);


  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
         onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{t("purchase.add_title")}</Text>
        <Text style={styles.subtitle}>{t("purchase.add_subtitle")}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {/* FARMER */}
<Text style={styles.label}>{t("purchase.farmer")}</Text>

<TouchableOpacity
  style={styles.input}
  activeOpacity={0.8}
  onPress={() => setShowFarmerModal(true)}
>
  <Text style={{ color: form.farmer ? "#111827" : "#9CA3AF" }}>
    {form.farmerName || t("purchase.choose_farmer")}
  </Text>
</TouchableOpacity>

<Modal visible={showFarmerModal} transparent animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Select Farmer</Text>

      <FlatList
        data={farmers}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.farmerItem}
           onPress={() => {
  setForm((prev) => ({
    ...prev,
    farmer: item._id, // ✅ ID saved correctly
    farmerName: `${item.firstName} ${item.lastName}`, // UI only
  }));
  setShowFarmerModal(false);
}}

          >
            <Text style={styles.farmerName}>
              {item.firstName} {item.lastName}
            </Text>
            <Text style={styles.farmerPhone}>{item.phone}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => setShowFarmerModal(false)}
      >
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


        {/* Crop */}
        <Text style={styles.label}>{t("purchase.crop")}</Text>
        <TextInput
          placeholder={t("purchase.choose_crop")}
          style={styles.input}
          value={form.crop}
          onChangeText={(v) => handleChange("crop", v)}
        />

        {/* Rate */}
        <Text style={styles.label}>{t("purchase.rate")}</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={form.rate}
          onChangeText={(v) => handleChange("rate", v)}
        />

        {/* Quantity */}
        <Text style={styles.label}>{t("purchase.quantity")}</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={form.quantity}
          onChangeText={(v) => handleChange("quantity", v)}
        />

       {/* PROCUREMENT DATE */}
<Text style={styles.label}>{t("purchase.date")}</Text>

<TouchableOpacity
  style={styles.input}
  activeOpacity={0.8}
  onPress={() => setOpenProcurement(true)}
>
  <Text
    style={{
      color: form.procurementDate ? "#111827" : "#9CA3AF",
    }}
  >
    {form.procurementDate || "YYYY-MM-DD"}
  </Text>
</TouchableOpacity>

    <DatePicker
  modal
  open={openProcurement}
  date={
    form.procurementDate
      ? new Date(form.procurementDate)
      : new Date()
  }
  mode="date"
  onConfirm={(date) => {
    setOpenProcurement(false);
    const formatted = date.toISOString().split("T")[0];
    handleChange("procurementDate", formatted);
  }}
  onCancel={() => setOpenProcurement(false)}
/>


        {/* Procurement Center */}
        <Text style={styles.label}>{t("purchase.center")}</Text>
        <TextInput
          style={styles.input}
          value={form.procurementCenter}
          onChangeText={(v) => handleChange("procurementCenter", v)}
        />

        {/* Godown */}
        <Text style={styles.label}>{t("purchase.godown")}</Text>
        <TextInput
          style={styles.input}
          value={form.godown}
          onChangeText={(v) => handleChange("godown", v)}
        />

        {/* Vehicle */}
        <Text style={styles.label}>{t("purchase.vehicle")}</Text>
        <TextInput
          style={styles.input}
          value={form.vehicle}
          onChangeText={(v) => handleChange("vehicle", v)}
        />

        {/* Remarks */}
        <Text style={styles.label}>{t("purchase.remarks")}</Text>
        <TextInput
          style={[styles.input, styles.remarks]}
          multiline
          value={form.remarks}
          onChangeText={(v) => handleChange("remarks", v)}
        />

        {/* SUBMIT */}
        <TouchableOpacity style={styles.submitBtn}
        onPress={()=>handleSave() }
        >
          <Text style={styles.submitText}>{t("common.save")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddPurchaseEntry;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#ff6a00",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  back: {
    color: "#fff",
    fontSize: 20,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  subtitle: {
    color: "#fff",
    fontSize: 13,
    opacity: 0.9,
  },
  body: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  dateText: {
    color: "#000",
  },
  remarks: {
    height: 80,
    textAlignVertical: "top",
  },
  submitBtn: {
    backgroundColor: "#ff6a00",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
},
modalContent: {
  backgroundColor: "#fff",
  marginHorizontal: 20,
  borderRadius: 12,
  padding: 16,
  maxHeight: "70%",
},
modalTitle: {
  fontSize: 16,
  fontWeight: "600",
  marginBottom: 12,
},
farmerItem: {
  paddingVertical: 12,
},
farmerName: {
  fontSize: 14,
  fontWeight: "500",
},
farmerPhone: {
  fontSize: 12,
  color: "#6B7280",
},
separator: {
  height: 1,
  backgroundColor: "#E5E7EB",
},
closeBtn: {
  marginTop: 12,
  alignSelf: "center",
},
closeText: {
  color: "#ff6a00",
  fontWeight: "600",
},

});