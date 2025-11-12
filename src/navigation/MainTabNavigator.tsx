import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'; // ⬅️ Agregar
import { Feather } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

// Importa tus pantallas principales
import FeedScreen from '../screens/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SavedScreen from '../screens/SavedScreen';
import PostScreen from '../screens/PostScreen';
import ConfigScreen from '../screens/ConfigScreen'; // ⬅️ Agregar

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator(); // ⬅️ Agregar

// Stack de perfil (Profile + Config)
function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="Config" component={ConfigScreen} />
    </ProfileStack.Navigator>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'black',
          borderTopColor: 'rgba(255,255,255,0.2)',
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Feather.glyphMap = 'home';

          if (route.name === 'Feed') iconName = 'home';
          else if (route.name === 'ProfileTab') iconName = 'user'; // ⬅️ Cambiar nombre
          else if (route.name === 'Saved') iconName = 'bookmark';
          else if (route.name === 'Post') iconName = 'plus';

          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Post" component={PostScreen} />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStackNavigator} // ⬅️ Usar el stack
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}