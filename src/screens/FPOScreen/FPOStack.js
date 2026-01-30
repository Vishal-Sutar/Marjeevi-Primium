import { StyleSheet, View, ActivityIndicator } from 'react-native';
import React, { Suspense } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import Home from './FpoScreen/Home';
import Profile from './FpoScreen/Profile';
import Visits from './FpoScreen/Visits';
import Performance from './FpoScreen/Performance';
import Ledger from './FpoScreen/Ledger';
import FieldCropMapping from './FpoScreen/FieldCropMapping';
import SchemesSubsidies from './FpoScreen/SchemesSubsidies';
import AddProduct from "./FpoScreen/AddProduct";
import UpdateProfile from './FpoScreen/UpdateProfile';
import Stock from "./FpoScreen/Stock";
import OrderDetails from './FpoScreen/OrderDetails';
import FarmerListing from './FpoScreen/FarmerListing';
import FarmerListingDetails from './FpoScreen/FarmerListingDetails';
import Screen1 from '../Signup/Form/Screen1';
import Screen2 from '../Signup/Form/Screen2';
import Screen3 from '../Signup/Form/Screen3';
import Screen4 from '../Signup/Form/Screen4';
import Screen5 from '../Signup/Form/Screen5';
import Screen6 from '../Signup/Form/Screen6';
import Screen7 from '../Signup/Form/Screen7';

const LoadingIndicator = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#2563EB" />
  </View>
);


export const UserStackHome = () => {
//   const BottomhomeTab = React.lazy(() => import('../TabScreen/Home'));
  return (

    <Suspense fallback={<LoadingIndicator />}>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
    
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Ledger" component={Ledger} />
            <Stack.Screen name="Performance" component={Performance} />
            <Stack.Screen name="OrderDetails" component={OrderDetails} />
            <Stack.Screen name="FarmerListing" component={FarmerListing} />
            <Stack.Screen name="FarmerListingDetails" component={FarmerListingDetails} />
            <Stack.Screen name="Screen1" component={Screen1} />
            <Stack.Screen name="Screen2" component={Screen2} />
            <Stack.Screen name="Screen3" component={Screen3} />
            <Stack.Screen name="Screen4" component={Screen4} />
            <Stack.Screen name="Screen5" component={Screen5} />
            <Stack.Screen name="Screen6" component={Screen6} />
            <Stack.Screen name="Screen7" component={Screen7} />
      
    </Stack.Navigator>
    </Suspense>
  );
};


export const UserStackVisit = () => {

  return (

    <Suspense fallback={<LoadingIndicator />}>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
    
            <Stack.Screen name="Visits" component={Visits} />
          
            {/* <Stack.Screen name="PropertyListDetail" component={PropertyListDetail} /> */}
     
     
    </Stack.Navigator>
    </Suspense>
  );
};



export const UserStackPerformance = () => {

  return (

    <Suspense fallback={<LoadingIndicator />}>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
    
            <Stack.Screen name="Performance" component={Performance} />
            <Stack.Screen name="AddProduct" component={AddProduct} />
          
            {/* <Stack.Screen name="PropertyListDetail" component={PropertyListDetail} /> */}
     
     
    </Stack.Navigator>
    </Suspense>
  );
};

export const UserStackStock = () => {

  return (

    <Suspense fallback={<LoadingIndicator />}>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
    
            <Stack.Screen name="Stock" component={Stock} />
          
            {/* <Stack.Screen name="PropertyListDetail" component={PropertyListDetail} /> */}
     
     
    </Stack.Navigator>
    </Suspense>
  );
};




export const UserStackProfile= () => {

  return (

    <Suspense fallback={<LoadingIndicator />}>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
    
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="FieldCropMapping" component={FieldCropMapping} />
            <Stack.Screen name="SchemesSubsidies" component={SchemesSubsidies} />
            <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
          
            {/* <Stack.Screen name="PropertyListDetail" component={PropertyListDetail} /> */}
     
     
    </Stack.Navigator>
    </Suspense>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

