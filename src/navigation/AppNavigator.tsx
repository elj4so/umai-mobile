import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// TabNavigator
import MainTabNavigator from './MainTabNavigator';

// Pantallas
import StartupScreen1 from '../screens/StartupScreen1';
import StartupScreen2 from '../screens/StartupScreen2';
import LoginScreen from '../screens/LoginScreen';
import RegisterTypeScreen from '../screens/RegisterTypeScreen';
import RegisterClientScreen from '../screens/RegisterClientScreen';
import RegisterRestaurantScreen from '../screens/RegisterRestaurantScreen';


// Define los tipos para el Stack RAÍZ
// Tendrá solo dos "rutas": el flujo Auth y el flujo Main
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// 4. Define los tipos SOLO para el flujo Auth
export type AuthStackParamList = {
  Startup1: undefined;
  Startup2: undefined;
  RegisterType: undefined;
  RegisterClient: undefined;
  RegisterRestaurant: undefined;
  Login: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

// 5. Un componente interno para el flujo de Autenticación
const AuthFlowNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Startup1"
    >
      <AuthStack.Screen name="Startup1" component={StartupScreen1} />
      <AuthStack.Screen name="Startup2" component={StartupScreen2} />
      <AuthStack.Screen name="RegisterType" component={RegisterTypeScreen} />
      <AuthStack.Screen name="RegisterClient" component={RegisterClientScreen} />
      <AuthStack.Screen name="RegisterRestaurant" component={RegisterRestaurantScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
};

export const AppNavigator = () => {
  // Aquí ira lógica de si el usuario está logueado o no
  // Por ahora, siempre empezamos en 'Auth'
  const isUserLoggedIn = false; 

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={isUserLoggedIn ? "Main" : "Auth"}
    >
      <Stack.Screen name="Auth" component={AuthFlowNavigator} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
    </Stack.Navigator>
  );
};