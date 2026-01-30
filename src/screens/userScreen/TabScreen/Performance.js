import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import apiService from "../../../Redux/apiService";

/* ---------------- DUMMY DATA (API READY) ---------------- */

const FILTERS = ["all", "completed", "pending", "quality"];

/* ---------------- SCREEN ---------------- */

const Performance = () => {
  const navigation = useNavigation()
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [purchases, setPurchases] = useState([]);


 const PurchesData = async () => {
  console.log("abcd");
  
  try {
    const response = await apiService.GetStaffPurches();
    console.log("BACKEND PRODUCTS 👉", response);
     const mapped = response.map(mapPurchaseFromBackend);
    setPurchases(mapped);
  } catch (error) {
    console.log("API ERROR 👉", error);
  }
};

useFocusEffect(
  useCallback(() => {
    PurchesData();
  }, [])
);

const mapPurchaseFromBackend = (item) => {
  return {
    id: item._id,
    farmer: `${item.farmer?.firstName || ""} ${item.farmer?.lastName || ""}`.trim(),
    code: item._id.slice(-6).toUpperCase(), // PR code
    crop: item.crop,
    quantity: `${item.quantity} kg`,
    amount: `₹${ item.rate}`,
    date: new Date(item.procurementDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    status: "completed", // backend not sending status yet
  };
};


  /* ---------------- FILTER LOGIC (API READY) ---------------- */

  const filteredData =
    selectedFilter === "all"
      ? purchases
      : purchases.filter(
          (item) => item.status === selectedFilter
        );

  /* ---------------- RENDER ITEM ---------------- */

  const renderItem = ({ item }) => {
    const statusStyle =
  item.status === "completed"
    ? styles.completed
    : item.status === "pending"
    ? styles.pending
    : styles.quality;

const statusTextStyle =
  item.status === "completed"
    ? styles.completedText
    : item.status === "pending"
    ? styles.pendingText
    : styles.qualityText;

    return (
      <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.cardHeader}>
          <Text style={styles.name}>
            {item.farmer}{" "}
            <Text style={styles.code}>— {item.code}</Text>
          </Text>

          <View style={[styles.statusBadge, statusStyle]}>
            <Text style={[styles.statusText, statusTextStyle]}>
               {t(`status.${item.status}`)}
            </Text>
          </View>
        </View>

        {/* CROP */}
        <Text style={styles.crop}>
          {item.crop} • {item.quantity}
        </Text>

        {/* FOOTER */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.label}>{t("common.amount")}</Text>
            <Text style={styles.amount}>{item.amount}</Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.label}>{t("common.date")}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#F97316" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>  {t("purchase.title")}</Text>

          {/* FILTER TABS */}
          <View style={styles.filterRow}>
            {FILTERS.map((item) => (
              <TouchableOpacity
                key={item}
                activeOpacity={0.8}
                style={[
                  styles.filterBtn,
                  selectedFilter === item && styles.activeFilter,
                ]}
                onPress={() => setSelectedFilter(item)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === item && styles.activeFilterText,
                  ]}
                >
             {t(`filters.${item}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.container}>
          {/* ADD PURCHASE */}
          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.85}
           onPress={() => navigation.navigate("AddPurchaseEntry")}
          >
            <Text style={styles.addText}>＋ {t("purchase.add")}</Text>
          </TouchableOpacity>

          {/* LIST */}
          <FlatList
            data={filteredData}
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

  header: {
    backgroundColor: "#F97316",
    padding: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  filterRow: {
    flexDirection: "row",
    gap: 10,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  activeFilter: {
    backgroundColor: "#fff",
  },
  filterText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#F97316",
    fontWeight: "600",
  },

  container: {
    backgroundColor: "#F7F9FC",
    padding: 16,
  },

  addBtn: {
    backgroundColor: "#F97316",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 18,
  },
  addText: {
    color: "#fff",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  name: {
    fontWeight: "600",
    fontSize: 13,
  },
  code: {
    fontSize: 11,
    color: "#6B7280",
  },

  crop: {
    fontSize: 12,
    marginBottom: 10,
    color: "#374151",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 11,
    color: "#6B7280",
  },
  amount: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    marginTop: 2,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },

  completed: {
    backgroundColor: "#DCFCE7",
  },
  completedText: {
    color: "#16A34A",
  },

  pending: {
    backgroundColor: "#DBEAFE",
  },
  pendingText: {
    color: "#2563EB",
  },

  quality: {
    backgroundColor: "#FEF3C7",
  },
  qualityText: {
    color: "#D97706",
  },
});
