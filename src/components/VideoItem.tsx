import React, { useState, useEffect } from 'react';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Search, Star, MessageSquare, ShoppingCart, Play } from 'lucide-react-native';
import { View, Text, StyleSheet, TouchableOpacity, Pressable , StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Tipos de Datos
type FoodService = { name: string; color: string; };
type VideoData = { id: string; url: string; user: string; description: string; foodServiceOptions: FoodService[]; };
type VideoItemProps = { data: VideoData; isPlaying: boolean; };

//const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

//Componente Guardia 'VideoItem'
const VideoItem = ({ data, isPlaying }: VideoItemProps) => {
  
  if (!data || !data.url) {
    return <View style={styles.container} />;
  }

  // Pasa la data al componente real
  return <VideoPlayerComponent data={data} isVisible={isPlaying} />;
};

const VideoPlayerComponent = ({ data, isVisible }: { data: VideoData, isVisible: boolean }) => {

  const insets = useSafeAreaInsets();
  
  const player = useVideoPlayer(data.url, (player) => {
    player.loop = true;
  });

  // true = pausado por el usuario
  // false = reproduciendo (o listo para reproducir)
  const [isPausedByUser, setIsPausedByUser] = useState(false);

  //LÓGICA DE SCROLL (Auto-play y Pausa al salir)
  useEffect(() => {
    if (isVisible) {
      // Si el video se vuelve visible Y el usuario NO lo pausó, dale play.
      if (!isPausedByUser) {
        player.play();
      }
    } else {
      // Si el usuario se va, SIEMPRE pausa y rebobina.
      player.pause();
      player.currentTime = 0; // Rebobina
      // Resetea el estado de pausa para la próxima vez que sea visible
      setIsPausedByUser(false);
    }
  }, [isVisible, player]); 

  // Lógica (Pausa / Reanudar)
  const handlePress = () => {
    // Alternamos el estado de pausa del usuario
    const newPausedState = !isPausedByUser;
    setIsPausedByUser(newPausedState);

    // Aplicamos el cambio al reproductor
    if (newPausedState) {
      // Si el usuario acaba de pausar
      player.pause();
    } else {
      // Si el usuario acaba de reanudar
      // (Nos aseguramos de que solo suene si es visible)
      if (isVisible) {
        player.play();
      }
    }
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />
      
      {/* Mostramos el icono 'Play' si el video está pausado por el usuario y solo si es el video visible */}
      {isVisible && isPausedByUser && (
        <View style={styles.playIconContainer}>
          <Play size={80} color="rgba(255, 255, 255, 0.6)" fill="rgba(255, 255, 255, 0.6)" />
        </View>
      )}

      {/* UI */}
      <View style={styles.overlay} />

      <View style={[styles.header, { top: insets.top }]}>
        <Text style={styles.headerTitle}>UMAI</Text>
        <Search size={24} color="white"/>
      </View>

      <View style={styles.rightControls}>
        <Star size={32} color="white" style={styles.iconMargin} fill="white" />
        <MessageSquare size={32} color="white" style={styles.iconMargin} />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.mainOrderButton}>
          <Text style={styles.mainOrderText}>Pedir por</Text>
          <ShoppingCart size={20} color="white" />
        </TouchableOpacity>
        <View style={styles.foodServiceButtons}>
          {data.foodServiceOptions.map(service => (
            <View key={service.name} style={styles.serviceButton}>
              <TouchableOpacity>
                <Text style={[styles.serviceText, { color: service.color }]}>{service.name}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <Text style={styles.usernameText}>{data.user}</Text>
        <Text style={styles.descriptionText}>{data.description}</Text>
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
  iconMargin: {
    marginBottom: 25,
  },
  footer: {
    paddingHorizontal: 15,
    paddingBottom: 30, 
    zIndex: 5,
  },
  usernameText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  descriptionText: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },
  mainOrderButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
    marginBottom: 10,
    alignItems: 'center',
  },
  mainOrderText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 5,
    fontSize: 14,
  },
  foodServiceButtons: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  serviceButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  serviceText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default VideoItem;