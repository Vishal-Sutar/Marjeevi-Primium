import React from "react";
import { StyleSheet, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";

import {
  UserStackHome,
  UserStackVisit,
  UserStackPerformance,
  // UserStackStock,
  UserStackProfile,
} from "./FPOStack";

const Tab = createBottomTabNavigator();

const TabStackuser = () => {
  const { t } = useTranslation(); // 🌍

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 70 },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={UserStackHome}
        options={{
          tabBarLabel: t("tabs.home"),
          tabBarIcon: ({ color }) => (
            <Icon name="home-outline" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="FarmerTab"
        component={UserStackVisit}
        options={{
          tabBarLabel: t("tabs.farmers"),
          tabBarIcon: ({ color }) => (
            <Icon name="people-outline" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="InventoryTab"
        component={UserStackPerformance}
        options={{
          tabBarLabel: "Inventory",
          tabBarIcon: ({ color }) => (
            <Icon name="cart-outline" size={24} color={color} />
          ),
        }}
      />

      {/* <Tab.Screen
        name="Stock"
        component={UserStackStock}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="bar-chart-outline" size={24} color={color} />
          ),
        }}
      /> */}
      

      <Tab.Screen
        name="ProfileTab"
        component={UserStackProfile}
        options={{
          tabBarLabel: t("tabs.profile"),
          tabBarIcon: ({ color }) => (
            <Icon name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabStackuser;
