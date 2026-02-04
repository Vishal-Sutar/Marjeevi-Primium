import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import RecentActivities from "../../../components/RecentActivities";

/* 🔹 MOCK DATA (Replace with API later) */
const QUICK_ACTIONS = [
 { id: "1", key: "create_listing.title", icon: "add-circle-outline" },
  { id: "2", key: "farmer_tabs.marketplace", icon: "storefront-outline" },
  { id: "3", key: "my_profile", icon: "person-outline" },
  { id: "4", key: "documents", icon: "document-text-outline" },
  { id: "5", key: "my_farm", icon: "home-outline" },
  { id: "6", key: "my_crop", icon: "leaf-outline" },
  { id: "7", key: "crop_doctor", icon: "medical-outline" },
  { id: "8", key: "chatbot", icon: "chatbubble-ellipses-outline" },
  { id: "9", key: "community", icon: "people-outline" },
];


const FarmerHome = () => {
 const navigation = useNavigation()
   const { t } = useTranslation(); // 🌍

const renderAction = ({ item }) => {
    const onPressAction = () => {
      if (item.key === "documents") navigation.navigate("ScreenSeventh");
      if (item.key === "create_listing.title") navigation.navigate("CreateListing");
      if (item.key === "my_farm") navigation.navigate("MyFarms");
      if (item.key === "my_crop") navigation.navigate("MyCrops");
      if (item.key === "my_profile") navigation.navigate("FarmerProfileTab");
      if (item.key === "farmer_tabs.marketplace") navigation.navigate("FarmerMarketTab");
      if (item.key === "crop_doctor") navigation.navigate("CropDoctor");
      if (item.key === "chatbot") navigation.navigate("ChatBot");
      if (item.key === "community") navigation.navigate("Community");
    };

    const getActionText = (key) => {
      return t(key);
    };

    return (
      <TouchableOpacity style={styles.actionCard} onPress={onPressAction}>
        <View style={styles.actionIcon}>
          <Icon name={item.icon} size={24} color="#fff" />
        </View>
        <Text style={styles.actionText}> {getActionText(item.key)}</Text>
      </TouchableOpacity>
    );
  };



  const renderActivity = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.activityCard,
        item.type === "info" && styles.activityAlt,
      ]}
    >
      <Text style={styles.activityText}>{item.title}</Text>
      <Text style={styles.activityTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t("hello_farmer")} 👋</Text>
          <Text style={styles.headerSub}> {t("welcome_back")}</Text>
        </View>

        {/* <TouchableOpacity style={styles.bellWrapper}>
          <Icon name="notifications-outline" size={22} color="#fff" />
          <View style={styles.bellDot} />
        </TouchableOpacity> */}
      </View>


      <Text style={styles.sectionTitle}>{t("quick_actions")}</Text>

      <FlatList
        key="3-columns"
        data={QUICK_ACTIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderAction}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "start", gap:"20" }}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        scrollEnabled={false}
      />

 
      <View style={styles.activityHeader}>
        <Text style={styles.sectionTitle}>{t("recent_activities")}</Text>
      </View>

      <RecentActivities />


    </ScrollView>
  );
};

export default FarmerHome;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F9F7",
  },

  header: {
    backgroundColor: "#3A9D4F",
    padding: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  headerSub: {
    fontSize: 13,
    color: "#E0F2E9",
    marginTop: 4,
  },

  bellWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  bellIcon: {
    fontSize: 18,
    color: "#fff",
  },
  bellDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
  },

  /* SECTION */
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },

  /* QUICK ACTIONS */
  actionCard: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#3A9D4F",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionIconText: {
    fontSize: 20,
    color: "#fff",
  },
  actionText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },

  /* ACTIVITIES */
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 10,
  },
  seeAll: {
    fontSize: 12,
    color: "#3A9D4F",
    fontWeight: "600",
  },
  activityCard: {
    backgroundColor: "#F0FBF4",
    marginHorizontal: 16,
    marginTop: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CDEED9",
  },
  activityAlt: {
    backgroundColor: "#F3F8FF",
    borderColor: "#D6E4FF",
  },
  activityText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
  },
  activityTime: {
    fontSize: 11,
    color: "#777",
    marginTop: 4,
  },
});
