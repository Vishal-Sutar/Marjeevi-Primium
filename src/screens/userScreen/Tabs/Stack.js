import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  UserStackHome,
  UserStackVisit,
  UserStackPerformance,
  UserStackProfile
} from './UserStacks';


const Tab = createBottomTabNavigator();

const TabStackuser = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 70 },
        tabBarLabelStyle: { fontSize: 14 },
        tabBarActiveTintColor: 'orange',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Home"
        component={UserStackHome}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home-outline" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Farmers"
        component={UserStackVisit}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="people-outline" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Buy"
        component={UserStackPerformance}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="cart-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={UserStackProfile}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabStackuser;
