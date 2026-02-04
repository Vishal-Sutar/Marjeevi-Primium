import { StyleSheet, View, ActivityIndicator } from 'react-native';
import React, { Suspense } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../TabScreen/Home';
import Profile from '../TabScreen/Profile';
import Visits from '../TabScreen/Visits';
import Performance from '../TabScreen/Performance';
import HomeSecond from '../TabScreen/HomeSecond';
import Listing from '../TabScreen/Listing';
import ListingDetails from '../TabScreen/ListingDetails';
import AddPurchaseEntry from '../TabScreen/AddPurchaseEntry ';
import EditProfile from '../TabScreen/EditProfile';
import StaffCreateListing from '../TabScreen/StaffCreateListing';
import StaffCommunity from '../TabScreen/StaffCommunity';

const Stack = createNativeStackNavigator();

const LoadingIndicator = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#3A9D4F" />
  </View>
);


export const UserStackHome = () => (
  <Suspense fallback={<LoadingIndicator />}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="HomeSecond" component={HomeSecond} />
      <Stack.Screen name="Listing" component={Listing} />
      <Stack.Screen name="ListingDetails" component={ListingDetails} />
      <Stack.Screen name="StaffCreateListing" component={StaffCreateListing} />
      <Stack.Screen name="StaffCommunity" component={StaffCommunity} />
    </Stack.Navigator>
  </Suspense>
);


export const UserStackVisit = () => (
  <Suspense fallback={<LoadingIndicator />}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Visits" component={Visits} />
    </Stack.Navigator>
  </Suspense>
);

export const UserStackPerformance = () => (
  <Suspense fallback={<LoadingIndicator />}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Performance" component={Performance} />
      <Stack.Screen name="AddPurchaseEntry" component={AddPurchaseEntry} />
    </Stack.Navigator>
  </Suspense>
);

export const UserStackProfile = () => (
  <Suspense fallback={<LoadingIndicator />}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  </Suspense>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

