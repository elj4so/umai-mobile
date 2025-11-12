import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  LayoutChangeEvent,
  StatusBar,
  ActivityIndicator,
  Text,
  RefreshControl,
  Alert,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";

// Estilos Colores
import { COLORS } from "../constants/colors";
// Componentes
import VideoItem from "../components/VideoItem";
// Servicio
import videoService from "../services/videoService";
// Adaptador
import { adaptVideos } from "../utils/videoAdapter";

// Tipo de Video FRONTEND (el que usa VideoItem)
interface PlatformLink {
  platform: "UBER_EATS" | "DIDI_FOOD" | "RAPPI";
  url: string;
}

interface Restaurant {
  id: string;
  name: string;
  address: string;
  rating: number;
}

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  restaurant: Restaurant;
}

interface Video {
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
}

const FeedScreen = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const isTabFocused = useIsFocused();

  // Cargar videos al iniciar
  useEffect(() => {
    loadVideos(1, true);
  }, []);

  // Registrar vista cuando cambia el video activo
  useEffect(() => {
    if (activeVideoId && isTabFocused) {
      videoService.recordView(activeVideoId).catch((err) => {
        console.log("Error registrando vista:", err);
      });
    }
  }, [activeVideoId, isTabFocused]);

  const loadVideos = async (
    pageNum: number = 1,
    isInitialLoad: boolean = false
  ) => {
    if (loadingMore && !isInitialLoad) return;

    try {
      if (isInitialLoad) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      console.log(`📥 Cargando videos - Página ${pageNum}`);

      const response = await videoService.getFeed(pageNum, 10);

      console.log("✅ Response:", response);

      if (response.success && response.data) {
        // Los videos vienen directamente en response.data como array
        const backendVideos = Array.isArray(response.data) ? response.data : [];

        console.log(`📦 ${backendVideos.length} videos recibidos del backend`);

        // ✅ ADAPTAR LOS VIDEOS AL FORMATO FRONTEND
        const adaptedVideos = adaptVideos(backendVideos);

        console.log(`✨ ${adaptedVideos.length} videos adaptados`);
        console.log("📹 Primer video adaptado:", adaptedVideos[0]);

        if (pageNum === 1) {
          setVideos(adaptedVideos);
          if (adaptedVideos.length > 0) {
            setActiveVideoId(adaptedVideos[0].id);
          }
        } else {
          setVideos((prev) => [...prev, ...adaptedVideos]);
        }

        setHasMore(adaptedVideos.length === 10);
        setPage(pageNum);
        setError(null);
      } else {
        console.warn("⚠️ Respuesta sin datos válidos");
        setError("No se pudieron cargar los videos");

        if (pageNum === 1) {
          setVideos([]);
        }
      }
    } catch (error: any) {
      console.error("❌ Error cargando videos:", error);

      const errorMessage = error.message || "Error al cargar videos";
      setError(errorMessage);

      if (isInitialLoad) {
        Alert.alert("Error", errorMessage, [
          {
            text: "Reintentar",
            onPress: () => loadVideos(1, true),
          },
          {
            text: "Cancelar",
            style: "cancel",
          },
        ]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    loadVideos(1, false);
  };

  const loadMore = () => {
    if (!loadingMore && !loading && hasMore && videos.length > 0) {
      console.log("📄 Cargando más videos...");
      loadVideos(page + 1, false);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const newActiveId = viewableItems[0].item.id;
      if (newActiveId !== activeVideoId) {
        setActiveVideoId(newActiveId);
      }
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
  }).current;

  const renderItem = useCallback(
    ({ item }: { item: Video }) => {
      const isCurrentlyPlaying = activeVideoId === item.id && isTabFocused;

      return (
        <View style={{ height: containerHeight, width: "100%" }}>
          <VideoItem data={item} isPlaying={isCurrentlyPlaying} />
        </View>
      );
    },
    [activeVideoId, isTabFocused, containerHeight]
  );

  const onLayout = (event: LayoutChangeEvent) => {
    if (containerHeight === 0) {
      const { height } = event.nativeEvent.layout;
      setContainerHeight(height);
      console.log("📐 Altura del contenedor:", height);
    }
  };

  const keyExtractor = useCallback((item: Video) => item.id, []);

  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: containerHeight,
      offset: containerHeight * index,
      index,
    }),
    [containerHeight]
  );

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#fff" />
        <Text style={styles.footerText}>Cargando más videos...</Text>
      </View>
    );
  };

  if (loading && videos.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando videos...</Text>
      </View>
    );
  }

  if (videos.length === 0 && !loading) {
    return (
      <View style={styles.emptyContainer}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <Text style={styles.emptyIcon}>🍽️</Text>
        <Text style={styles.emptyText}>
          {error || "No hay videos disponibles"}
        </Text>
        <Text style={styles.emptySubtext}>
          {error
            ? "Verifica tu conexión a internet"
            : "Sé el primero en subir contenido"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={onLayout}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        // ✅ SCROLL MÁS RÁPIDO Y SENSIBLE
        pagingEnabled
        decelerationRate="normal" // ⬅️ Cambia de "fast" a "normal"
        snapToInterval={containerHeight} // ⬅️ NUEVO
        snapToAlignment="start" // ⬅️ NUEVO
        disableIntervalMomentum={true} // ⬅️ NUEVO - Hace que vaya de video en video sin inercia extra
        showsVerticalScrollIndicator={false}
        getItemLayout={containerHeight > 0 ? getItemLayout : undefined}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
            title="Actualizando..."
            titleColor="#fff"
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={1}
        updateCellsBatchingPeriod={100}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  loadingText: {
    color: "white",
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
  },
  footerLoader: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#999",
    fontSize: 12,
    marginTop: 8,
  },
});

export default FeedScreen;
