// src/components/ReelItem.js

import React, { useState, useEffect, useRef, memo } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Linking } from 'react-native';
import { Video } from 'expo-av';
import { Search, Star, MessageSquare, ShoppingCart, Heart } from 'lucide-react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const ReelItem = memo(({ data, isPlaying, onLike, onFavorite, onOrderClick }) => {
    const videoRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [watchTime, setWatchTime] = useState(0);
    const watchTimeInterval = useRef(null);

    // Control de reproducción - solo cuando cambia isPlaying
    useEffect(() => {
        if (!videoRef.current || !isLoaded) return;

        const controlVideo = async () => {
            try {
                if (isPlaying) {
                    await videoRef.current.playAsync();
                    startWatchTimer();
                } else {
                    await videoRef.current.pauseAsync();
                    stopWatchTimer();
                }
            } catch (error) {
                console.error('Error controlando video:', error);
            }
        };

        controlVideo();

        return () => {
            stopWatchTimer();
        };
    }, [isPlaying, isLoaded]);

    // Cargar video cuando el componente se monta
    useEffect(() => {
        return () => {
            // Cleanup al desmontar
            if (videoRef.current) {
                videoRef.current.unloadAsync();
            }
        };
    }, []);

    // Timer para medir tiempo de visualización
    const startWatchTimer = () => {
        if (watchTimeInterval.current) return; // Ya está corriendo
        watchTimeInterval.current = setInterval(() => {
            setWatchTime(prev => prev + 1);
        }, 1000);
    };

    const stopWatchTimer = () => {
        if (watchTimeInterval.current) {
            clearInterval(watchTimeInterval.current);
            watchTimeInterval.current = null;
        }
    };

    // Manejar cuando el video se carga
    const handleVideoLoad = (status) => {
        if (status.isLoaded && !isLoaded) {
            setIsLoaded(true);
        }
    };

    // Manejar click en servicio de comida
    const handleServiceClick = async (service) => {
        if (service.url) {
            try {
                // Registrar click en el backend
                if (onOrderClick) {
                    onOrderClick(service.name);
                }
                
                // Abrir enlace
                const canOpen = await Linking.canOpenURL(service.url);
                if (canOpen) {
                    await Linking.openURL(service.url);
                }
            } catch (error) {
                console.error('Error al abrir URL:', error);
            }
        }
    };

    return (
        <View style={styles.container}>
            {/* Video */}
            <View style={styles.videoPlaceholder}>
                <Video
                    ref={videoRef}
                    source={{ uri: data.videoUrl }}
                    style={styles.video}
                    resizeMode="cover"
                    isLooping={true}
                    shouldPlay={false} // Controlamos manualmente
                    useNativeControls={false}
                    onPlaybackStatusUpdate={handleVideoLoad}
                    isMuted={false}
                    volume={1.0}
                />
            </View>
            
            {/* Overlay oscuro */}
            <View style={styles.overlay} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>UMAI</Text>
                <Search size={24} color="white"/>
            </View>

            {/* Controles de interacción (derecha) */}
            <View style={styles.rightControls}>
                {/* Like */}
                <TouchableOpacity 
                    onPress={onLike}
                    style={styles.iconButton}
                    activeOpacity={0.7}
                >
                    <Heart 
                        size={32} 
                        color="white" 
                        fill={data.isLiked ? "red" : "transparent"}
                    />
                    {data.likes > 0 && (
                        <Text style={styles.iconCount}>{data.likes}</Text>
                    )}
                </TouchableOpacity>

                {/* Favorito */}
                <TouchableOpacity 
                    onPress={onFavorite}
                    style={styles.iconButton}
                    activeOpacity={0.7}
                >
                    <Star 
                        size={32} 
                        color="white" 
                        fill={data.isFavorite ? "gold" : "transparent"}
                    />
                </TouchableOpacity>

                {/* Comentarios */}
                <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                    <MessageSquare size={32} color="white" />
                </TouchableOpacity>
            </View>

            {/* Footer con info y botones */}
            <View style={styles.footer}>
                {/* Botón principal de pedido */}
                <TouchableOpacity style={styles.mainOrderButton} activeOpacity={0.8}>
                    <Text style={styles.mainOrderText}>Pedir por</Text>
                    <ShoppingCart size={20} color="white" />
                </TouchableOpacity>

                {/* Botones de servicios de comida */}
                {data.foodServiceOptions && data.foodServiceOptions.length > 0 && (
                    <View style={styles.foodServiceButtons}>
                        {data.foodServiceOptions.map((service, index) => (
                            <TouchableOpacity
                                key={`${service.name}-${index}`}
                                style={styles.serviceButton}
                                onPress={() => handleServiceClick(service)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.serviceText, { color: service.color }]}>
                                    {service.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                
                {/* Usuario y descripción */}
                <Text style={styles.usernameText}>{data.user}</Text>
                <Text style={styles.descriptionText} numberOfLines={2}>
                    {data.description}
                </Text>
                
                {/* Contador de vistas */}
                {data.views > 0 && (
                    <Text style={styles.viewsText}>
                        👁️ {data.views.toLocaleString()} visualizaciones
                    </Text>
                )}
            </View>
        </View>
    );
}, (prevProps, nextProps) => {
    // Solo re-renderizar si estas props cambian
    return (
        prevProps.isPlaying === nextProps.isPlaying &&
        prevProps.data.id === nextProps.data.id &&
        prevProps.data.isLiked === nextProps.data.isLiked &&
        prevProps.data.isFavorite === nextProps.data.isFavorite &&
        prevProps.data.likes === nextProps.data.likes
    );
});

const styles = StyleSheet.create({
    container: {
        height: screenHeight,
        width: screenWidth,
        backgroundColor: 'black',
        justifyContent: 'flex-end',
    },
    videoPlaceholder: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    video: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    header: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
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
        bottom: screenHeight * 0.2,
        alignItems: 'center',
        zIndex: 5,
    },
    iconButton: {
        alignItems: 'center',
        marginBottom: 25,
    },
    iconCount: {
        color: 'white',
        fontSize: 12,
        marginTop: 5,
        fontWeight: 'bold',
    },
    footer: {
        paddingHorizontal: 15,
        paddingBottom: 60,
        zIndex: 5,
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
        flexWrap: 'wrap',
    },
    serviceButton: {
        backgroundColor: 'white',
        borderRadius: 8,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 10,
        marginBottom: 5,
    },
    serviceText: {
        fontWeight: 'bold',
        fontSize: 12,
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
    viewsText: {
        color: '#ccc',
        fontSize: 12,
        marginTop: 5,
    },
});

ReelItem.displayName = 'ReelItem';

export default ReelItem;