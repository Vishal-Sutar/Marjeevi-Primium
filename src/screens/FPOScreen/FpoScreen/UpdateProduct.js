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
  Image,
  Platform,
  PermissionsAndroid,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { launchImageLibrary } from "react-native-image-picker";
import Icon from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import apiService from "../../../Redux/apiService";

const UNITS = [
  { id: "1", label: "Bag", value: "bag" },
  { id: "2", label: "Packet", value: "packet" },
  { id: "3", label: "Box", value: "box" },
  { id: "4", label: "Bottle", value: "bottle" },
  { id: "5", label: "Can", value: "can" },
  { id: "6", label: "ML", value: "ml" },
];

const UpdateProduct = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params;

  const [showUnit, setShowUnit] = useState(false);
  const [openPurchase, setOpenPurchase] = useState(false);
  const [openExpiry, setOpenExpiry] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    productName: product?.productName || "",
    brand: product?.brand || "",
    mrp: product?.mrp?.toString() || "",
    quantity: product?.quantity?.toString() || "",
    unit: product?.unit || "",
    purchaseDate: product?.purchaseDate?.split('T')[0] || "",
    expiryDate: product?.expiryDate?.split('T')[0] || "",
    description: product?.description || "",
    productImage: product?.productImage?.url || product?.productImage || null,
  });

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === "android") {
      try {
        if (Platform.Version >= 33) return true;
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    if (selectedImages.length >= 1) {
      Alert.alert('Limit Reached', 'You can only select 1 image');
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
        setSelectedImages([result.assets[0]]);
        handleChange("productImage", result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to open image picker');
    }
  };

  const removeImage = () => {
    setSelectedImages([]);
    handleChange("productImage", product?.productImage?.url || product?.productImage || null);
  };

  const handleUpdate = async () => {
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

    setLoading(true);
    
    try {
      const updatePayload = {
        productName: form.productName.trim(),
        brand: form.brand.trim(),
        mrp: parseFloat(form.mrp),
        quantity: parseInt(form.quantity),
        unit: form.unit,
        purchaseDate: form.purchaseDate,
        expiryDate: form.expiryDate,
        description: form.description.trim()
      };
      
      if (selectedImages.length > 0) {
        updatePayload.productImage = `data:${selectedImages[0].type};base64,${selectedImages[0].base64}`;
      }
      
      await apiService.updateProduct(product._id, updatePayload);
      
      Alert.alert("Success", "Product updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error("Update error:", error.message);
      Alert.alert("Error", "Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Product</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Text style={styles.label}>Product Image</Text>
        <View style={styles.imageContainer}>
          {selectedImages.length > 0 ? (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: selectedImages[0].uri }} style={styles.productImage} />
              <TouchableOpacity style={styles.removeImageBtn} onPress={removeImage}>
                <Text style={styles.removeImageText}>×</Text>
              </TouchableOpacity>
            </View>
          ) : form.productImage ? (
            <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
              <Image source={{ uri: form.productImage }} style={styles.productImage} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={pickImage} style={styles.addImageBtn} activeOpacity={0.7}>
              <Icon name="camera-outline" size={32} color="#9CA3AF" />
              <Text style={styles.imagePlaceholderText}>Tap to add image</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product name"
          value={form.productName}
          onChangeText={v => handleChange("productName", v)}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Enter description"
          multiline
          numberOfLines={4}
          value={form.description}
          onChangeText={v => handleChange("description", v)}
        />

        <Text style={styles.label}>Brand *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter brand"
          value={form.brand}
          onChangeText={v => handleChange("brand", v)}
        />

        <Text style={styles.label}>MRP *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter MRP"
          keyboardType="decimal-pad"
          value={form.mrp}
          onChangeText={v => handleChange("mrp", v)}
        />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Quantity *</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="number-pad"
              value={form.quantity}
              onChangeText={v => handleChange("quantity", v)}
            />
          </View>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.label}>Unit *</Text>
            <TouchableOpacity
              style={styles.select}
              activeOpacity={0.8}
              onPress={() => setShowUnit(!showUnit)}
            >
              <Text style={styles.selectText}>
                {form.unit
                  ? UNITS.find(u => u.value === form.unit)?.label
                  : "Select"}
              </Text>
              <Text style={styles.arrow}>⌄</Text>
            </TouchableOpacity>

            {showUnit && (
              <View style={styles.dropdown}>
                {UNITS.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.option}
                    onPress={() => {
                      handleChange("unit", item.value);
                      setShowUnit(false);
                    }}
                  >
                    <Text style={styles.optionText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <Text style={styles.label}>Purchase Date *</Text>
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
            const formatted = date.toISOString().split("T")[0];
            handleChange("purchaseDate", formatted);
          }}
          onCancel={() => setOpenPurchase(false)}
        />

        <Text style={styles.label}>Expiry Date</Text>
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

        <TouchableOpacity
          style={styles.saveBtn}
          activeOpacity={0.85}
          onPress={handleUpdate}
        >
          <Text style={styles.saveText}>Update Product</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateProduct;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
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
  label: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 6,
    fontWeight: "500",
  },
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
  imageContainer: {
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  addImageBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 8,
  },
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
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
});