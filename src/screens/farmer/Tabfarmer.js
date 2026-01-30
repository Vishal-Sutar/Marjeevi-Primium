import React from "react";
import { Image, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/Ionicons";

import {
  FarmerStackHome,
  FarmerStackMarket,
  FarmerStackListing,
  FarmerStackProfile,
} from "./FarmerStacks";

const Tab = createBottomTabNavigator();

const ACTIVE_COLOR = "#2E7D32";
const INACTIVE_COLOR = "#999";

const Tabfarmer = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
      }}
    >
      {/* HOME */}
      <Tab.Screen
        name="FarmerHomeTab"
        component={FarmerStackHome}
        options={{
          tabBarLabel: t("farmer_tabs.home"),
          tabBarIcon: ({ focused }) => (
            <Icon
              name="home-outline"
              size={24}
              color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
          ),
        }}
      />

      {/* MARKETPLACE */}
      <Tab.Screen
        name="FarmerMarketTab"
        component={FarmerStackMarket}
        options={{
          tabBarLabel: t("farmer_tabs.marketplace"),
          tabBarIcon: ({ focused }) => (
            <Icon
              name="storefront-outline"
              size={24}
              color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
          ),
        }}
      />

      {/* LISTINGS */}
      <Tab.Screen
        name="FarmerListingTab"
        component={FarmerStackListing}
        options={{
          tabBarLabel: t("farmer_tabs.listings"),
          tabBarIcon: ({ focused }) => (
            <Icon
              name="list-outline"
              size={24}
              color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
          ),
        }}
      />

      {/* PROFILE */}
      <Tab.Screen
        name="FarmerProfileTab"
        component={FarmerStackProfile}
        options={{
          tabBarLabel: t("farmer_tabs.profile"),
          tabBarIcon: ({ focused }) => (
            <Icon
              name="person-outline"
              size={24}
              color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabfarmer;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  icon: {
    width: 28,
    height: 28,
  },
  iconLarge: {
    width: 36,
    height: 36,
  },
});
