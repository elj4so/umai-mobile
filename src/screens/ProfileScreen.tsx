import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Star, Utensils, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Dimensiones para el ancho de la miniatura (Grid)
const { width: screenWidth } = Dimensions.get('window');
const THUMBNAIL_SIZE = (screenWidth - 45) / 3;

// Datos de ejemplo
const USER_PROFILE = {
  username: '@JoseTorresElReyDeAltoMando',
  followers: '200',
  favorites: '3',
  bio: '¿Ya te sabes la nueva?\nVe-rem, ve-rem, ve-rem, yo',
  profilePicUrl: 'https://via.placeholder.com/100',
};

const FOLLOWED_ACCOUNTS = [
  { id: '1', handle: '@youkaybauldesensaciones', rating: '4.8', avatarUrl: 'https://via.placeholder.com/60' },
  { id: '2', handle: '@john_boy_burger', rating: '4.6', avatarUrl: 'https://via.placeholder.com/60' },
  { id: '3', handle: '@malva.restaurante', rating: '4.9', avatarUrl: 'https://via.placeholder.com/60' },
];

const FAVORITE_VIDEOS = [
  { id: '1', thumbnail: 'https://images.unsplash.com/photo-1606851091489-7aa2d31a6e7a?w=500' },
  { id: '2', thumbnail: 'https://images.unsplash.com/photo-1604908177522-0404d45c3238?w=500' },
  { id: '3', thumbnail: 'https://images.unsplash.com/photo-1612197527762-8cfb6e5b6b24?w=500' },
];

// Tarjeta de restaurante seguido
const FollowedAccountCard = ({ account }) => {
  const [isFollowing, setIsFollowing] = useState(true);
  return (
    <View style={accountStyles.card}>
      <Image source={{ uri: account.avatarUrl }} style={accountStyles.avatar} />
      <View style={accountStyles.info}>
        <Text style={accountStyles.handle}>{account.handle}</Text>
        <Text style={accountStyles.rating}>Calificación: {account.rating}</Text>
      </View>
      <TouchableOpacity
        style={[accountStyles.button, isFollowing ? accountStyles.following : accountStyles.notFollowing]}
        onPress={() => setIsFollowing(!isFollowing)}
      >
        <Text style={accountStyles.buttonText}>{isFollowing ? 'Siguiendo' : 'Seguir'}</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- Pantalla principal ---
const ProfileScreen = ({ navigation }: any) => { // Navigation prop
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'favorites' | 'restaurants'>('favorites');

  return (
    <View style={styles.container}>
      {/* Header con botón de configuración */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>Perfil</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Config')}
          style={styles.settingsButton}
        >
          <Settings size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Sección Superior del Perfil (Diseño horizontal) */}
        <View style={styles.profileSection}>
          <Image source={{ uri: USER_PROFILE.profilePicUrl }} style={styles.profileImage} />
          
          <View style={styles.statsWrapper}>
            <Text style={styles.username}>{USER_PROFILE.username}</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{USER_PROFILE.followers}</Text>
                <Text style={styles.statLabel}>Siguiendo</Text>
              </View>
              <View style={styles.statSeparator} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{USER_PROFILE.favorites}</Text>
                <Text style={styles.statLabel}>Videos Favoritos</Text>
              </View>
            </View>

            <Text style={styles.bio}>{USER_PROFILE.bio}</Text>
          </View>
        </View>

        {/* Botón de Perfil */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
            onPress={() => setActiveTab('favorites')}
          >
            <Star size={28} color={activeTab === 'favorites' ? '#FF4A50' : '#ccc'} fill={activeTab === 'favorites' ? '#FF4A50' : 'none'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'restaurants' && styles.activeTab]}
            onPress={() => setActiveTab('restaurants')}
          >
            <Utensils size={28} color={activeTab === 'restaurants' ? '#FF4A50' : '#ccc'} />
          </TouchableOpacity>
        </View>

        {/* Contenido dinámico */}
        <View style={styles.contentContainer}>
          {activeTab === 'favorites' ? (
            <View style={styles.gridContainer}>
              {FAVORITE_VIDEOS.map((video) => (
                <Image key={video.id} source={{ uri: video.thumbnail }} style={styles.thumbnail} />
              ))}
            </View>
          ) : (
            <View>
              {FOLLOWED_ACCOUNTS.map((account) => (
                <FollowedAccountCard key={account.id} account={account} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: 'black' 
  },
  settingsButton: {
    padding: 5,
  },
  scrollContent: { paddingBottom: 40 },
  
  profileSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 15,
    marginBottom: 15,
    paddingTop: 20,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginRight: 15,
    backgroundColor: '#ff4081',
    marginLeft: 5,
  },
  statsWrapper: {
    flex: 1,
    marginTop: 5,
  },
  username: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10,
  },
  statsContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10,
  },
  statItem: { alignItems: 'center', paddingRight: 10, paddingLeft: 10 },
  statSeparator: { width: 1, height: '80%', backgroundColor: '#ccc' },
  statNumber: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#666' },
  bio: { fontSize: 14, color: '#333', lineHeight: 20, maxWidth: '90%' },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  editButton: { 
    backgroundColor: '#e0e0e0', 
    borderRadius: 8,
    paddingVertical: 10, 
    paddingHorizontal: 30,
    width: 129,
  },
  editButtonText: { fontWeight: 'bold', color: 'black' },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#FF4A50' },
  contentContainer: { paddingHorizontal: 15, paddingTop: 10 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  thumbnail: { width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE * 1.33, borderRadius: 10, marginBottom: 8 },
});

const accountStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15, backgroundColor: '#eee' },
  info: { flex: 1 },
  handle: { fontWeight: 'bold', fontSize: 16 },
  rating: { fontSize: 12, color: '#666' },
  button: { paddingVertical: 6, paddingHorizontal: 18, borderRadius: 6 },
  following: { backgroundColor: '#e0e0e0' },
  notFollowing: { backgroundColor: '#FF4A50' },
  buttonText: { color: 'black', fontWeight: 'bold' },
});

export default ProfileScreen;