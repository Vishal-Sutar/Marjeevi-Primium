import React, { useEffect, useState } from "react";
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
import Icon from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import apiService from "../../../Redux/apiService";

/* ---------------- DUMMY DATA (API READY) ---------------- */

const STATS = [
  { id: "1", key: "today_procurements", value: "24", icon: "document-text-outline" },
  { id: "2", key: "pending_quality", value: "8", icon: "time-outline" },
  { id: "3", key: "pending_payments", value: "12", icon: "cash-outline" },
];

const Home = () => {
  const navigation = useNavigation()
    const { t } = useTranslation(); // 🌍
  const [stats, setStats] = useState([]);
  const [procurements, setProcurements] = useState([]);

  useEffect(() => {
    // Later replace with backend API
    setStats(STATS);
  }, []);


const mapPurchaseForUI = (item) => ({
  id: item._id,
  farmer: `${item.farmer?.firstName || ""} ${item.farmer?.lastName || ""}`.trim(),
  code: item._id.slice(-6).toUpperCase(),
  crop: item.crop,
  quantity: `${item.quantity} kg`,
  amount: `₹${ item.rate}`,
  date: new Date(item.procurementDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
  status: "completed", // backend not sending yet
});


useEffect(() => {
  const fetchHomeData = async () => {
    try {
      const response = await apiService.GetStaffPurches();
      console.log("HOME PURCHASE DATA 👉", response);

      const mapped = response.map(mapPurchaseForUI);

      // same card UI, just backend data
      setProcurements(mapped.slice(0, 3));

      // same stats UI
      setStats([
        {
          id: "1",
          key: "today_procurements",
          value: response.length.toString(),
          icon: "document-text-outline",
        },
        {
          id: "2",
          key: "pending_quality",
          value: "0",
          icon: "time-outline",
        },
        {
          id: "3",
          key: "pending_payments",
          value: "0",
          icon: "cash-outline",
        },
      ]);
    } catch (error) {
      console.log("HOME API ERROR 👉", error);
    }
  };

  fetchHomeData();
}, []);


  /* ---------------- RENDERERS ---------------- */


  const renderProcurement = ({ item }) => (
    <View style={styles.procCard}>
      <View style={styles.procHeader}>
        <Text style={styles.procName}>
          {item.farmer} <Text style={styles.procCode}>— {item.code}</Text>
        </Text>

        <View style={styles.completedBadge}>
          <Text style={styles.completedText}> {t(`status.${item.status.toLowerCase()}`)}</Text>
        </View>
      </View>

      <Text style={styles.procCrop}>
        {item.crop} • {item.quantity}
      </Text>

      <View style={styles.procFooter}>
        <View>
          <Text style={styles.procLabel}>{t("common.amount")}</Text>
          <Text style={styles.procAmount}>{item.amount}</Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.procLabel}>{t("common.date")}</Text>
          <Text style={styles.procDate}>{item.date}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#F97316" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t("home.title")}</Text>
          <Text style={styles.headerSub}>{t("home.subtitle")}</Text>
        </View>

        <View style={styles.container}>
          {/* STATS */}
         <View style={styles.statsRow}>
  {stats.map((item) => (
    <View key={item.id} style={styles.statCard}>
      <View style={styles.statIcon}>
        <Icon name={item.icon} size={18} color="#F97316" />
      </View>

      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statLabel}>
        {t(`stats.${item.key}`)}
      </Text>
    </View>
  ))}
</View>

          {/* ADD LISTING */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionBtn, { flex: 1, marginRight: 8 }]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Listing')}
            >
              <Text style={styles.actionText}>View Listing</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionBtn, { flex: 1, marginLeft: 8 }]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('StaffCreateListing')}
            >
              <Text style={styles.actionText}>Create Listing</Text>
            </TouchableOpacity>
          </View>

          {/* FARMERS & COMMUNITY */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionBtn, { flex: 1, marginRight: 8 }]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Farmers')}
            >
              <Text style={styles.actionText}>Farmers</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionBtn, { flex: 1, marginLeft: 8 }]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('StaffCommunity')}
            >
              <Text style={styles.actionText}>Community</Text>
            </TouchableOpacity>
          </View>

          {/* RECENT */}
          <Text style={styles.sectionTitle}>{t("home.recent_procurements")}</Text>

          <FlatList
            data={procurements}
            keyExtractor={(item) => item.id}
            renderItem={renderProcurement}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

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
  },
  headerSub: {
    color: "#FFF7ED",
    fontSize: 12,
    marginTop: 4,
  },

  container: {
    backgroundColor: "#F7F9FC",
    padding: 16,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  statCard: {
    width: "31%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    elevation: 2,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#FFEDD5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
    color: "#6B7280",
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

  buttonRow: {
    flexDirection: "row",
    marginBottom: 18,
  },
  actionBtn: {
    backgroundColor: "#F97316",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },

  procCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
  },
  procHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  procName: {
    fontWeight: "600",
    fontSize: 13,
  },
  procCode: {
    fontSize: 11,
    color: "#6B7280",
  },

  completedBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  completedText: {
    fontSize: 10,
    color: "#16A34A",
    fontWeight: "600",
  },

  procCrop: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 10,
  },

  procFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  procLabel: {
    fontSize: 11,
    color: "#6B7280",
  },
  procAmount: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  procDate: {
    fontSize: 12,
    marginTop: 2,
  },
});
