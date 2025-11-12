import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';

// TabNavigator
import MainTabNavigator from './MainTabNavigator';

// Pantallas
import StartupScreen1 from '../screens/StartupScreen1';
import StartupScreen2 from '../screens/StartupScreen2';
import LoginScreen from '../screens/LoginScreen';
import RegisterTypeScreen from '../screens/RegisterTypeScreen';
import RegisterClientScreen from '../screens/RegisterClientScreen';
import RegisterRestaurantScreen from '../screens/RegisterRestaurantScreen';

// Servicio
import authService from '../services/authService';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export type AuthStackParamList = {
  Startup1: undefined;
  Startup2: undefined;
  RegisterType: undefined;
  RegisterClient: undefined;
  RegisterRestaurant: undefined;
  Login: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

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
  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuth = await authService.isAuthenticated();
      setIsUserLoggedIn(isAuth);
    } catch (error) {
      console.error('Error verificando auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

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