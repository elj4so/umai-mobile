import React, { useState, useEffect } from 'react';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Search, Star, MessageSquare, ShoppingCart, Play, Heart, Bookmark } from 'lucide-react-native';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Linking, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Servicio
import videoService from '../services/videoService';

// Tipos de Datos actualizados según el backend
type PlatformLink = {
  platform: 'UBER_EATS' | 'DIDI_FOOD' | 'RAPPI';
  url: string;
};

type Restaurant = {
  id: string;
  name: string;
  address: string;
  rating: number;
};

type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  restaurant: Restaurant;
};

type VideoData = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  dish: Dish;
  platformLinks: PlatformLink[];
  isLiked?: boolean;
  isFavorited?: boolean;
};

type VideoItemProps = {
  data: VideoData;
  isPlaying: boolean;
};

// Mapeo de colores para las plataformas
const PLATFORM_COLORS: Record<string, string> = {
  UBER_EATS: '#06C167',
  DIDI_FOOD: '#FF6D1F',
  RAPPI: '#FF441F',
};

// Mapeo de nombres para mostrar
const PLATFORM_NAMES: Record<string, string> = {
  UBER_EATS: 'Uber Eats',
  DIDI_FOOD: 'DiDi Food',
  RAPPI: 'Rappi',
};

// Componente Guardia 'VideoItem'
const VideoItem = ({ data, isPlaying }: VideoItemProps) => {
  if (!data || !data.videoUrl) {
    return <View style={styles.container} />;
  }

  return <VideoPlayerComponent data={data} isVisible={isPlaying} />;
};

const VideoPlayerComponent = ({ data, isVisible }: { data: VideoData; isVisible: boolean }) => {
  const insets = useSafeAreaInsets();

  const player = useVideoPlayer(data.videoUrl, (player) => {
    player.loop = true;
  });

  // Estados del video
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [isLiked, setIsLiked] = useState(data.isLiked || false);
  const [isFavorited, setIsFavorited] = useState(data.isFavorited || false);
  const [likeCount, setLikeCount] = useState(data.likeCount);

  // LÓGICA DE SCROLL (Auto-play y Pausa al salir)
  useEffect(() => {
    if (isVisible) {
      if (!isPausedByUser) {
        player.play();
      }
    } else {
      player.pause();
      player.currentTime = 0;
      setIsPausedByUser(false);
    }
  }, [isVisible, player]);

  // Lógica (Pausa / Reanudar)
  const handlePress = () => {
    const newPausedState = !isPausedByUser;
    setIsPausedByUser(newPausedState);

    if (newPausedState) {
      player.pause();
    } else {
      if (isVisible) {
        player.play();
      }
    }
  };

  // Manejar Like
  const handleLike = async () => {
    try {
      const previousState = isLiked;
      const previousCount = likeCount;

      // Optimistic update
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

      await videoService.likeVideo(data.id);
    } catch (error) {
      console.error('❌ Error al dar like:', error);
      // Revertir en caso de error
      setIsLiked(isLiked);
      setLikeCount(likeCount);
      Alert.alert('Error', 'No se pudo dar like al video');
    }
  };

  // Manejar Favorito
  const handleFavorite = async () => {
    try {
      const previousState = isFavorited;

      setIsFavorited(!isFavorited);

      await videoService.favoriteVideo(data.id);
    } catch (error) {
      console.error('Error al guardar favorito:', error);
      // Revertir en caso de error
      setIsFavorited(isFavorited);
      Alert.alert('Error', 'No se pudo guardar el video');
    }
  };

  // Manejar click en botón de orden
  const handleMainOrderButton = () => {
    if (data.platformLinks && data.platformLinks.length > 0) {
      // Si solo hay una plataforma, abrir directamente
      if (data.platformLinks.length === 1) {
        handleOrderClick(data.platformLinks[0].url);
      }
      // Si hay múltiples, el usuario puede elegir de los botones abajo
    } else {
      Alert.alert(
        'No disponible',
        'Este platillo aún no está disponible en plataformas de delivery'
      );
    }
  };

  // Abrir link de plataforma específica
  const handleOrderClick = async (platformUrl: string) => {
    try {
      // Registrar el click
      await videoService.recordOrderClick(data.id);

      // Verificar si se puede abrir la URL
      const canOpen = await Linking.canOpenURL(platformUrl);

      if (canOpen) {
        await Linking.openURL(platformUrl);
      } else {
        Alert.alert(
          'Error',
          'No se pudo abrir el link. Verifica que tengas la app instalada.'
        );
      }
    } catch (error) {
      console.error('Error al abrir link:', error);
      Alert.alert('Error', 'No se pudo abrir el link de la plataforma');
    }
  };

  // Formatear número de likes
  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />

      {/* Icono de Play cuando está pausado */}
      {isVisible && isPausedByUser && (
        <View style={styles.playIconContainer}>
          <Play size={80} color="rgba(255, 255, 255, 0.6)" fill="rgba(255, 255, 255, 0.6)" />
        </View>
      )}

      {/* Overlay oscuro */}
      <View style={styles.overlay} />

      {/* Header */}
      <View style={[styles.header, { top: insets.top }]}>
        <Text style={styles.headerTitle}>UMAI</Text>
        <Search size={24} color="white" />
      </View>

      {/* Controles derechos */}
      <View style={styles.rightControls}>
        {/* Botón de Like */}
        <TouchableOpacity onPress={handleLike} style={styles.controlButton}>
          <Heart
            size={32}
            color="white"
            fill={isLiked ? '#FF3B5C' : 'transparent'}
            style={styles.iconMargin}
          />
          {likeCount > 0 && (
            <Text style={styles.countText}>{formatCount(likeCount)}</Text>
          )}
        </TouchableOpacity>

        {/* Botón de Comentarios (próximamente) */}
        <TouchableOpacity style={styles.controlButton}>
          <MessageSquare size={32} color="white" style={styles.iconMargin} />
          <Text style={styles.countText}>{data.shareCount || 0}</Text>
        </TouchableOpacity>

        {/* Botón de Favoritos */}
        <TouchableOpacity onPress={handleFavorite} style={styles.controlButton}>
          <Bookmark
            size={32}
            color="white"
            fill={isFavorited ? 'white' : 'transparent'}
            style={styles.iconMargin}
          />
        </TouchableOpacity>
      </View>

      {/* Footer con información */}
      <View style={styles.footer}>
        {/* Botón principal de orden */}
        <TouchableOpacity
          style={styles.mainOrderButton}
          onPress={handleMainOrderButton}
        >
          <Text style={styles.mainOrderText}>Pedir por</Text>
          <ShoppingCart size={20} color="white" />
        </TouchableOpacity>

        {/* Botones de plataformas */}
        {data.platformLinks && data.platformLinks.length > 0 && (
          <View style={styles.foodServiceButtons}>
            {data.platformLinks.map((link) => (
              <TouchableOpacity
                key={link.platform}
                style={styles.serviceButton}
                onPress={() => handleOrderClick(link.url)}
              >
                <Text
                  style={[
                    styles.serviceText,
                    { color: PLATFORM_COLORS[link.platform] || '#000' },
                  ]}
                >
                  {PLATFORM_NAMES[link.platform] || link.platform}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Información del restaurante y platillo */}
        <Text style={styles.restaurantText}>
          {data.dish.restaurant.name}
        </Text>
        <Text style={styles.dishNameText}>
          {data.dish.name} • ${data.dish.price.toFixed(2)}
        </Text>
        <Text style={styles.descriptionText} numberOfLines={2}>
          {data.description || data.dish.description}
        </Text>

        {/* Rating del restaurante */}
        {data.dish.restaurant.rating > 0 && (
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFD700" fill="#FFD700" />
            <Text style={styles.ratingText}>
              {data.dish.restaurant.rating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'black',
    justifyContent: 'flex-end',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  playIconContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  header: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    paddingTop: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  rightControls: {
    position: 'absolute',
    right: 15,
    bottom: 200,
    alignItems: 'center',
    zIndex: 5,
  },
  controlButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconMargin: {
    marginBottom: 5,
  },
  countText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    paddingHorizontal: 15,
    paddingBottom: 35,
    zIndex: 5,
  },
  mainOrderButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  mainOrderText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 15,
  },
  foodServiceButtons: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  serviceButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  serviceText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  restaurantText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  dishNameText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  descriptionText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default VideoItem;