import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Pantallas
import StartupScreen1 from '../screens/StartupScreen1';
import StartupScreen2 from '../screens/StartupScreen2';
import LoginScreen from '../screens/LoginScreen';
import RegisterTypeScreen from '../screens/RegisterTypeScreen';
import RegisterClientScreen from '../screens/RegisterClientScreen';
import RegisterRestaurantScreen from '../screens/RegisterRestaurantScreen';
import VideoReel from '../screens/FeedScreen';

// Parámetros para cada ruta
export type AuthStackParamList = {
  Startup1: undefined;
  Startup2: undefined;
  Login: undefined;
  RegisterType: undefined;
  RegisterClient: undefined;
  RegisterRestaurant: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Ocultamos el header por defecto
      }}
      initialRouteName="Startup1" // La primera pantalla que se muestra
    >
      <Stack.Screen name="Startup1" component={StartupScreen1} />
      <Stack.Screen name="Startup2" component={StartupScreen2} />
      <Stack.Screen name="RegisterType" component={RegisterTypeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegisterClient" component={RegisterClientScreen} />
      <Stack.Screen name="RegisterRestaurant" component={RegisterRestaurantScreen} />
      <Stack.Screen name="VideoReel" component={VideoReel} />
      </Stack.Navigator>
  );
};