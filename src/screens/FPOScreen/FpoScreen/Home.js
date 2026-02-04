import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/Ionicons";

/* ---------------- DATA (API READY) ---------------- */

const STATS = [
  { id: "1", key: "total_farmers", value: "245" },
  { id: "2", key: "active_fields", value: "892" },
  { id: "3", key: "pending_payments", value: "₹4.2L" },
];

const ACTIONS = [
  { id: "1", key: "add_farmer", icon: "person-add", bg: "#2563EB" },
  { id: "2", key: "order_details", icon: "receipt", bg: "#16A34A" },
  { id: "3", key: "farmer_listing", icon: "list", bg: "#9333EA" },
  { id: "4", key: "Community", icon: "people-outline", bg: "#F97316" },
];


const CROPS = [
  { id: "1", key: "wheat", qty: "450 Qt", progress: 90, color: "#FACC15" },
  { id: "2", key: "rice", qty: "320 Qt", progress: 70, color: "#22C55E" },
  { id: "3", key: "cotton", qty: "180 Qt", progress: 40, color: "#3B82F6" },
  { id: "4", key: "others", qty: "100 Qt", progress: 30, color: "#9CA3AF" },
];


/* ---------------- SCREEN ---------------- */

const Home = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [stats] = useState(STATS);
  const [actions] = useState(ACTIONS);
  const [crops] = useState(CROPS);

  /* ---------------- NAVIGATION HANDLER ---------------- */

  const handleActionPress = useCallback((key) => {
    switch (key) {
      case "add_farmer":
        navigation.navigate("Screen1", { themeColor: "#2563EB" });
        break;
      case "order_details":
        navigation.navigate("OrderDetails");
        break;
      case "farmer_listing":
        navigation.navigate("FarmerListing");
        break;
      case "Community":
        navigation.navigate("FpoCommunity");
        break;
    }
  }, [navigation]);

  /* ---------------- RENDER ITEMS ---------------- */

  const renderStat = useCallback(({ item }) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statLabel}>{t(item.key)}</Text>
    </View>
  ), [t]);

  const renderAction = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={() => handleActionPress(item.key)}
    >
      <View style={[styles.actionIconBox, { backgroundColor: item.bg }]}>
        <Icon name={item.icon} size={22} color="#fff" />
      </View>
      <Text style={styles.actionText}>{t(item.key)}</Text>
    </TouchableOpacity>
  ), [t, handleActionPress]);

  const renderCrop = useCallback(({ item }) => (
    <View style={styles.cropRow}>
      <View style={styles.cropHeader}>
        <Text style={styles.cropName}>{t(item.key)}</Text>
        <Text style={styles.cropQty}>{item.qty}</Text>
      </View>
      <View style={styles.progressBg}>
        <View
          style={[
            styles.progressFill,
            { width: `${item.progress}%`, backgroundColor: item.color },
          ]}
        />
      </View>
    </View>
  ), [t]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t("fpo_dashboard")}</Text>
            <Text style={styles.headerSub}>
             {t("manage_farmers")}
            </Text>
          </View>

          {/* STATS */}
<View style={styles.statsRow}>
  {stats.map((item) => (
    <View key={item.id} style={styles.statCard}>
      <Text style={styles.statValue}>{item.value}</Text>

      {/* ✅ TRANSLATION BINDING */}
      <Text style={styles.statLabel}>
        {t(item.key)}
      </Text>
    </View>
  ))}
</View>


          {/* QUICK ACTION */}
          <Text style={styles.sectionTitle}>{t("quick_actions")}</Text>
          <FlatList
            data={actions}
            keyExtractor={(item) => item.id}
            renderItem={renderAction}
            numColumns={2}
            columnWrapperStyle={styles.actionRow}
            scrollEnabled={false}
          />

          {/* CROP STATISTICS */}
          <Text style={styles.sectionTitle}>{t("crop_statistics")}</Text>
          <FlatList
            data={crops}
            keyExtractor={(item) => item.id}
            renderItem={renderCrop}
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

  scrollContent: {
    paddingBottom: 24,
    backgroundColor: "#F7F9FC",
  },

  container: {
    backgroundColor: "#F7F9FC",
    padding: 16,
  },

  header: {
    backgroundColor: "#2563EB",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  headerSub: {
    color: "#E0E7FF",
    marginTop: 4,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  statCard: {
    width: "31%",
    backgroundColor: "#2563EB",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    color: "#E0E7FF",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
  },

  actionRow: {
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 14,
    elevation: 2,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "500",
  },

  cropRow: {
    marginBottom: 14,
  },
  cropHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cropName: {
    fontSize: 13,
    fontWeight: "500",
  },
  cropQty: {
    fontSize: 12,
    color: "#6B7280",
  },
  progressBg: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
  progressFill: {
    height: 6,
    borderRadius: 4,
  },
});
