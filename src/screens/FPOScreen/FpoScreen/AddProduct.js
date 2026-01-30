import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import DatePicker from "react-native-date-picker";
import Icon from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import apiService from "../../../Redux/apiService";

const UNITS = [
  { id: "1", label: "Bag", value: "bag" },
  { id: "2", label: "Packet", value: "packet" },
  { id: "3", label: "Box", value: "box" },
  { id: "4", label: "Bottle", value: "bottle" },
  { id: "5", label: "Can", value: "can" },
];


const AddProduct = () => {
  const { t } = useTranslation();
const navigation = useNavigation();
const [showUnit, setShowUnit] = useState(false);
const [openPurchase, setOpenPurchase] = useState(false);
const [openExpiry, setOpenExpiry] = useState(false);
  const [form, setForm] = useState({
    productName: "",
    brand: "",
    mrp: "",
    quantity: "",
    unit: "",
    purchaseDate: "",
    expiryDate: "",
    description:"",
  });

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave  = async() => {
   if (
    !form.productName ||
    !form.brand ||
    !form.mrp ||
    !form.quantity ||
    !form.unit ||
    !form.purchaseDate ||
    !form.expiryDate ||
    !form.description 
   ) {
     Alert.alert(t("error"), t("fill_required_fields"));
     
        return;
        
   }
try {
    await apiService.FPOproduct(form)
    console.log("ADD PRODUCT DATA Succeffuly 👉", form)
      navigation.navigate("Performance"); 
} catch (error) {
    console.log(error)
}
    
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {t("add_product.title")}
        </Text>

        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* PRODUCT NAME */}
        <Text style={styles.label}>
          {t("add_product.product_name")} *
        </Text>
        <TextInput
          style={styles.input}
          placeholder={t("add_product.product_name_placeholder")}
          value={form.productName}
          onChangeText={v => handleChange("productName", v)}
        />

        {/* DESCRIPTION */}
<Text style={styles.label}>
  {t("add_product.description")}
</Text>
<TextInput
  style={styles.textArea}
  placeholder={t("add_product.description_placeholder")}
  multiline
  numberOfLines={4}
  value={form.description}
  onChangeText={v => handleChange("description", v)}
/>



    {/* BRAND */}
<Text style={styles.label}>
  {t("add_product.brand")} *
</Text>
<TextInput
  style={styles.input}
  placeholder={t("add_product.select_source")}
  value={form.brand}
  onChangeText={v => handleChange("brand", v)}
/>


        {/* MRP */}
        <Text style={styles.label}>
          {t("add_product.mrp")} *
        </Text>
        <TextInput
          style={styles.input}
          placeholder={t("add_product.mrp_placeholder")}
          keyboardType="decimal-pad"
          value={form.mrp}
          onChangeText={v => handleChange("mrp", v)}
        />

        {/* QUANTITY & UNIT */}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>
              {t("add_product.quantity")} *
            </Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="number-pad"
              value={form.quantity}
              onChangeText={v => handleChange("quantity", v)}
            />
          </View>

 {/* UNIT */}
<View style={{ flex: 1, marginLeft: 12 }}>
  <Text style={styles.label}>
    {t("add_product.unit")} *
  </Text>

  {/* SELECT BOX */}
  <TouchableOpacity
    style={styles.select}
    activeOpacity={0.8}
    onPress={() => setShowUnit(!showUnit)}
  >
    <Text style={styles.selectText}>
      {form.unit
        ? UNITS.find(u => u.value === form.unit)?.label
        : t("add_product.select")}
    </Text>
    <Text style={styles.arrow}>⌄</Text>
  </TouchableOpacity>

  {/* DROPDOWN LIST */}
  {showUnit && (
    <View style={styles.dropdown}>
      {UNITS.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.option}
          onPress={() => {
            handleChange("unit", item.value); // ✅ SAVE VALUE
            setShowUnit(false);               // ✅ CLOSE DROPDOWN
          }}
        >
          <Text style={styles.optionText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )}
</View>

        </View>

     <Text style={styles.label}>
  {t("add_product.purchase_date")} *
</Text>

<TouchableOpacity
  style={styles.dateInput}
  activeOpacity={0.8}
  onPress={() => setOpenPurchase(true)}
>
  <Icon name="calendar-outline" size={18} color="#6B7280" />
  <Text style={[styles.dateText, form.purchaseDate && styles.dateTextFilled]}>
    {form.purchaseDate || "YYYY-MM-DD"}
  </Text>
</TouchableOpacity>

<DatePicker
  modal
  open={openPurchase}
  date={form.purchaseDate ? new Date(form.purchaseDate) : new Date()}
  mode="date"
  onConfirm={(date) => {
    setOpenPurchase(false);
    const formatted = date.toISOString().split("T")[0]; // YYYY-MM-DD
    handleChange("purchaseDate", formatted);
  }}
  onCancel={() => setOpenPurchase(false)}
/>


       <Text style={styles.label}>
  {t("add_product.expiry_date")}
</Text>

<TouchableOpacity
  style={styles.dateInput}
  activeOpacity={0.8}
  onPress={() => setOpenExpiry(true)}
>
  <Icon name="calendar-outline" size={18} color="#6B7280" />
  <Text style={[styles.dateText, form.expiryDate && styles.dateTextFilled]}>
    {form.expiryDate || "YYYY-MM-DD"}
  </Text>
</TouchableOpacity>

<DatePicker
  modal
  open={openExpiry}
  date={form.expiryDate ? new Date(form.expiryDate) : new Date()}
  mode="date"
  onConfirm={(date) => {
    setOpenExpiry(false);
    const formatted = date.toISOString().split("T")[0];
    handleChange("expiryDate", formatted);
  }}
  onCancel={() => setOpenExpiry(false)}
/>


        {/* SAVE BUTTON */}
        {/* <TouchableOpacity
          style={styles.saveBtn}
          activeOpacity={0.85}
          // onPress={handleSave}
            onPress={() =>
  navigation.navigate("Performance", {
    handleSave: form, // ✅ MUST exist
  })}
        >
          <Text style={styles.saveText}>
            {t("add_product.save")}
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
  style={styles.saveBtn}
  activeOpacity={0.85}
  onPress={handleSave}
>
  <Text style={styles.saveText}>
    {t("add_product.save")}
  </Text>
</TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProduct;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  /* HEADER */
  header: {
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
    justifyContent: "space-between",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },

  scroll: {
    padding: 16,
    paddingBottom: 30,
  },

  /* LABEL */
  label: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 6,
    fontWeight: "500",
  },

  /* INPUT */
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    marginBottom: 16,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#ffffff",
  },

  /* DATE INPUT */
  dateInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    marginBottom: 16,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  dateText: {
    fontSize: 14,
    color: "#9CA3AF",
  },

  dateTextFilled: {
    color: "#111827",
  },

  /* SELECT */
  select: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: "#ffffff",
  },

  selectText: {
    fontSize: 14,
    color: "#6B7280",
  },

  arrow: {
    fontSize: 16,
    color: "#9CA3AF",
  },

  /* ROW (Quantity + Unit) */
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  /* SAVE BUTTON */
  saveBtn: {
    backgroundColor: "#2563EB",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  saveText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  textArea: {
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 12,
  fontSize: 14,
  color: "#111827",
  backgroundColor: "#ffffff",
  marginBottom: 16,
  textAlignVertical: "top",
},
dropdown: {
  backgroundColor: "#ffffff",
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 10,
  marginTop: 4,
},

option: {
  paddingVertical: 12,
  paddingHorizontal: 14,
  borderBottomWidth: 0.5,
  borderColor: "#E5E7EB",
},

optionText: {
  fontSize: 13,
  color: "#111827",
},


});


