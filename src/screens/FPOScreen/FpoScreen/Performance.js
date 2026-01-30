import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import apiService from "../../../Redux/apiService";
/* ---------------- DUMMY DATA (API READY) ---------------- */


/* ---------------- SCREEN ---------------- */

const Performance = () => {
  const navigation = useNavigation();
   const { t } = useTranslation();
const [products, setProducts] = useState([]);


  
  /* ---------------- RENDER ITEM ---------------- */

 const ProductData = async () => {
  console.log("abcd");
  
  try {
    const response = await apiService.GetFPOProduct();
    console.log("BACKEND PRODUCTS 👉", response);

    // response should be an array
    setProducts(response || []);
  } catch (error) {
    console.log("API ERROR 👉", error);
  }
};

useFocusEffect(
  useCallback(() => {
    ProductData();
  }, [])
);




const renderItem = useCallback(({ item }) => (
  <View style={styles.card}>
    <View style={styles.iconBox}>
      <Text style={styles.icon}>📦</Text>
    </View>

    <View style={styles.details}>
      <Text style={styles.name}>{item?.productName}</Text>

      <Text style={styles.brand}>
        {t("inventory.brand")}: {item?.brand}
      </Text>

      <Text style={styles.mrp}>
        {t("inventory.mrp")} {item?.mrp}
      </Text>
      <Text style={styles.mrp}>
        {t("Description: ")} {item?.description}
      </Text>

      <View style={styles.stockRow}>
        <View
          style={[
            styles.stockBadge,
            item.status === "in"
              ? styles.inStock
              : styles.lowStock,
          ]}
        >
          <Text
            style={[
              styles.stockText,
              item.status === "in"
                ? styles.inStockText
                : styles.lowStockText,
            ]}
          >
            {t(`inventory.status.${item?.quantity}`)}
          </Text>
        </View>

        <Text style={styles.stockQty}>{item?.quantity}</Text>
      </View>
    </View>

    {/* <TouchableOpacity
      style={styles.updateBtn}
      onPress={() =>
        navigation.navigate("UpdateProduct", { id: item.id })
      }
    >
      <Text style={styles.updateText}>
        {t("inventory.update")}
      </Text>
    </TouchableOpacity> */}
  </View>
), [navigation, t]);


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}> {t("inventory.title")}</Text>
        </View>

        {/* ADD PRODUCT */}
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("AddProduct")}
          >
            <Text style={styles.addText}>＋ {t("inventory.add_product")}</Text>
          </TouchableOpacity>

          {/* INVENTORY LIST */}
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Performance;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  scrollContent: {
    paddingBottom: 24,
    backgroundColor: "#F7F9FC",
  },

  header: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  container: {
    backgroundColor: "#F7F9FC",
    padding: 16,
  },

  addBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 18,
  },
  addText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  icon: {
    fontSize: 18,
  },

  details: {
    flex: 1,
  },
  name: {
    fontWeight: "600",
    fontSize: 13,
  },
  brand: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  mrp: {
    fontSize: 11,
    color: "#16A34A",
    marginTop: 2,
  },

  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 8,
  },
  inStock: {
    backgroundColor: "#DCFCE7",
  },
  lowStock: {
    backgroundColor: "#FFE4E6",
  },
  stockText: {
    fontSize: 10,
  },
  inStockText: {
    color: "#16A34A",
  },
  lowStockText: {
    color: "#DC2626",
  },
  stockQty: {
    fontSize: 11,
    color: "#374151",
  },

  updateBtn: {
    backgroundColor: "#0D9488",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  updateText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
});
