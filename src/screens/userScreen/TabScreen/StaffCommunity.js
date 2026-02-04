import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AllPosts from "./StaffAllPosts";
import MyPosts from "./StaffPosts";

const TabButton = ({ tab, activeTab, setActiveTab, title }) => (
  <TouchableOpacity
    style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
    onPress={() => setActiveTab(tab)}
  >
    <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default function StaffCommunity() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        <TabButton
          tab="all"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          title="All Posts"
        />
        <TabButton
          tab="my"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          title="My Posts"
        />
      </View>
      
      {activeTab === "all" ? <AllPosts /> : <MyPosts />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  tabButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },
  tabText: {
    fontSize: 15,
    color: "#555",
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#F97316",
  },
  activeTabText: { 
    color: "#F97316", 
    fontWeight: "bold" 
  },
});
