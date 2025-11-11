import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Pantallas
import StartupScreen1 from '../screens/StartupScreen1';
import StartupScreen2 from '../screens/StartupScreen2';
import LoginScreen from '../screens/LoginScreen';
import RegisterTypeScreen from '../screens/RegisterTypeScreen';
import RegisterClientScreen from '../screens/RegisterClientScreen';
import RegisterRestaurantScreen from '../screens/RegisterRestaurantScreen';

// Navegador de pestañas principal
import MainTabNavigator from './MainTabNavigator';
import FeedScreen from '../screens/FeedScreen';

export type AuthStackParamList = {
  Startup1: undefined;
  Startup2: undefined;
  Login: undefined;
  RegisterType: undefined;
  RegisterClient: undefined;
  RegisterRestaurant: undefined;
  MainTabs: undefined; // 👈 agregamos esta ruta
};

const Stack = createStackNavigator<AuthStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Startup1"
    >
      <Stack.Screen name="Startup1" component={StartupScreen1} />
      <Stack.Screen name="Startup2" component={StartupScreen2} />
      <Stack.Screen name="RegisterType" component={RegisterTypeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegisterClient" component={RegisterClientScreen} />
      <Stack.Screen name="RegisterRestaurant" component={RegisterRestaurantScreen} />
      {/* 👇 Nueva pantalla con las pestañas */}
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    </Stack.Navigator>
  );
  
};

