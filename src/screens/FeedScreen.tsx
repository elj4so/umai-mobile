// src/screens/FeedScreen.js

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  FlatList, 
  Dimensions, 
  StyleSheet, 
  View, 
  Text, 
  StatusBar,
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import ReelItem from '../components/ReelItem';
import feedService from '../services/feedService';

const { height: screenHeight } = Dimensions.get('window');

// --------------------------------------------------- 
const FeedScreen = () => {
  // Estados
  const [videos, setVideos] = useState([]);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Cargar feed inicial
  useEffect(() => {
    loadFeed();
  }, []);

  /**
   * Cargar videos del feed
   */
  const loadFeed = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        setPage(1);
      } else {
        setLoading(true);
      }

      const result = await feedService.getFeed({
        limit: 10,
        page: isRefresh ? 1 : page,
      });

      if (result.success) {
        const newVideos = result.data.map(video => ({
          id: video.id,
          user: `@${video.restaurant.name}`,
          description: video.description || video.title,
          videoUrl: video.cloudinaryUrl,
          thumbnailUrl: video.thumbnailUrl,
          restaurantId: video.restaurantId,
          dishId: video.dishId,
          likes: video.likesCount,
          views: video.viewsCount,
          isLiked: video.isLiked || false,
          isFavorite: video.isFavorite || false,
          foodServiceOptions: Object.entries(video.deliveryLinks || {})
            .filter(([_, url]) => url)
            .map(([platform, url]) => ({
              name: platform === 'uber' ? 'Uber Eats' : 
                    platform === 'didi' ? 'DiDi Food' : 
                    platform === 'rappi' ? 'Rappi' : platform,
              color: platform === 'uber' ? 'green' : 
                     platform === 'didi' ? '#FF7D00' : 
                     platform === 'rappi' ? '#FF4A50' : '#000',
              url: url,
            })),
        }));

        if (isRefresh) {
          setVideos(newVideos);
          setPage(2);
        } else {
          setVideos(prev => [...prev, ...newVideos]);
          setPage(prev => prev + 1);
        }

        // Establecer el primer video como activo
        if (newVideos.length > 0 && !activeVideoId) {
          setActiveVideoId(newVideos[0].id);
        }

        // Verificar si hay más videos
        setHasMore(result.pagination?.hasMore || false);
        
        setError(null);
      } else {
        setError(result.error);
        console.error('Error al cargar feed:', result.error);
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error('Error en loadFeed:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Refrescar feed (pull to refresh)
   */
  const onRefresh = () => {
    loadFeed(true);
  };

  /**
   * Cargar más videos (infinite scroll)
   */
  const loadMore = () => {
    if (!loading && hasMore) {
      loadFeed();
    }
  };

  /**
   * Detectar cambio de video visible
   */
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newActiveId = viewableItems[0].item.id;
      setActiveVideoId(newActiveId);
      
      // Registrar vista en el backend
      recordVideoView(newActiveId);
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  /**
   * Registrar vista de video
   */
  const recordVideoView = async (videoId) => {
    try {
      // Registrar vista básica
      await feedService.recordView(videoId, {
        watchTime: 0, // Se actualizará con el tiempo real
        completed: false,
      });
    } catch (error) {
      console.error('Error al registrar vista:', error);
    }
  };

  /**
   * Manejar like/unlike
   */
  const handleLike = async (videoId, isLiked) => {
    try {
      if (isLiked) {
        await feedService.unlikeVideo(videoId);
      } else {
        await feedService.likeVideo(videoId);
      }

      // Actualizar estado local
      setVideos(prev => 
        prev.map(video => 
          video.id === videoId 
            ? { 
                ...video, 
                isLiked: !isLiked,
                likes: isLiked ? video.likes - 1 : video.likes + 1
              }
            : video
        )
      );
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  /**
   * Manejar favorito
   */
  const handleFavorite = async (videoId, isFavorite) => {
    try {
      if (isFavorite) {
        await feedService.removeFavorite(videoId);
      } else {
        await feedService.addFavorite(videoId);
      }

      // Actualizar estado local
      setVideos(prev => 
        prev.map(video => 
          video.id === videoId 
            ? { ...video, isFavorite: !isFavorite }
            : video
        )
      );
    } catch (error) {
      console.error('Error al marcar favorito:', error);
    }
  };

  /**
   * Manejar click en botón de pedido
   */
  const handleOrderClick = async (videoId, platform) => {
    try {
      await feedService.recordOrderClick(videoId, platform.toLowerCase());
    } catch (error) {
      console.error('Error al registrar click de pedido:', error);
    }
  };

  /**
   * Renderizar cada video
   */
  const renderItem = useCallback(({ item }) => (
    <View style={{ height: screenHeight, width: '100%' }}>
      <ReelItem 
        data={item}
        isPlaying={activeVideoId === item.id}
        onLike={() => handleLike(item.id, item.isLiked)}
        onFavorite={() => handleFavorite(item.id, item.isFavorite)}
        onOrderClick={(platform) => handleOrderClick(item.id, platform)}
      />
    </View>
  ), [activeVideoId]);

  /**
   * Renderizar footer (loading al hacer scroll)
   */
  const renderFooter = () => {
    if (!loading) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#FF0033" />
      </View>
    );
  };

  /**
   * Pantalla de carga inicial
   */
  if (loading && videos.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0033" />
        <Text style={styles.loadingText}>Cargando videos...</Text>
      </View>
    );
  }

  /**
   * Pantalla de error
   */
  if (error && videos.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>😕 {error}</Text>
        <Text style={styles.errorSubtext}>Toca para reintentar</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" /> 

      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        
        pagingEnabled={true}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}

        getItemLayout={(data, index) => (
          { length: screenHeight, offset: screenHeight * index, index }
        )}

        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}

        // Pull to refresh
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="white"
          />
        }

        // Infinite scroll
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  errorSubtext: {
    color: '#999',
    fontSize: 14,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default FeedScreen;