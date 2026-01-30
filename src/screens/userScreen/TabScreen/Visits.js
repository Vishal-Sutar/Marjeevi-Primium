import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import apiService from "../../../Redux/apiService";

/* ---------------- DUMMY DATA (API READY) ---------------- */


/* ---------------- SCREEN ---------------- */

const Visits = () => {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");
    const { t } = useTranslation();

 

const fetchFarmers = async () => {
  try {
    const response = await apiService.getAllFarmers();
    console.log("BACKEND FARMERS 👉", response);

    const mappedFarmers = response.map((item) => ({
      id: item._id,
      name: `${item.firstName || ""} ${item.lastName || ""}`.trim(),
      phone: item.phone,
      fields: item.fields || 0,
      verified: true,
    }));

    setFarmers(mappedFarmers);
  } catch (error) {
    console.log("Farmer API error 👉", error);
  }
};

useFocusEffect(
  useCallback(() => {
    fetchFarmers();
  }, [])
);



  /* ---------------- FILTER (API READY) ---------------- */

  const filteredFarmers = farmers.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- RENDER ITEM ---------------- */

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{item.name}</Text>

        {item.verified && (
          <View style={styles.verifiedBadge}>
            <Icon name="checkmark-circle-outline" size={12} color="#16A34A" />
            <Text style={styles.verifiedText}> {t("farmers.verified")}</Text>
          </View>
        )}
      </View>

      <View style={styles.infoRow}>
        <Icon name="call-outline" size={14} color="#374151" />
        <Text style={styles.subText}> {item.phone}</Text>
      </View>
      <Text style={styles.fields}> {item.fields} {t("farmers.fields")}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#F97316" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>  {t("farmers.title")}</Text>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Icon name="search-outline" size={18} color="#fff" />
          <TextInput
            placeholder={t("farmers.search")}
            placeholderTextColor="#FED7AA"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* LIST */}
      <View style={styles.container}>
        <FlatList
          data={filteredFarmers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Visits;

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
    marginBottom: 10,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },

  searchInput: {
    flex: 1,
    color: "#fff",
    marginLeft: 8,
  },

  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    padding: 16,
  },

  card: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
  },

  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  verifiedText: {
    fontSize: 10,
    color: "#16A34A",
    fontWeight: "600",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },

  subText: {
    fontSize: 12,
    color: "#374151",
    marginTop: 2,
  },

  fields: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },
});
