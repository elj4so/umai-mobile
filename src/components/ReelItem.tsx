import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
// ⚠️ NECESITAS INSTALAR ESTOS MÓDULOS ⚠️
 import { Video } from 'expo-av'; 
import { Search, Star, MessageSquare, ShoppingCart, Play, Icon } from 'lucide-react-native';

// Usamos el tamaño de la ventana para asegurar que ocupe toda la pantalla
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

// Datos de ejemplo para la tarjeta (simulando que vienen de la FlatList)
// const DUMMY_DATA = {
//     videoUrl: 'TU_URL_DE_VIDEO_AQUÍ', // Reemplaza con una URL de video de prueba
//     user: '@youkaybauldesensaciones',
//     description: 'Prueba nuestras Bolas de Fuego con sus sabores auténticos, frescos y llenos de tradición.',
//     foodServiceOptions: [
//         { name: 'Uber Eats', color: 'green' },
//         { name: 'DiDi Food', color: '#FF7D00' },
//         { name: 'Rappi', color: '#FF4A50' },
//     ]
// };

const ReelItem = ({ data = DUMMY_DATA, isPlaying }) => {
    // Componente Video (comentado, ya que necesita expo-av/expo-video)
    const VideoComponent = () => (
        <View style={styles.videoPlaceholder}>
            <Video
                source={{ uri: data.videoUrl }}
                style={styles.video}
                resizeMode="cover"
                isLooping={true}
                shouldPlay={isPlaying} // Reproducir si está activo
                useNativeControls={false}
            />
           
            {/* Imagen de referencia (el sushi) y el botón de Play */}
            {/* <Text style={styles.placeholderText}>[Imagen o Video de Sushi]</Text> */}
            <Play size={24} color={"white"}>
                
            </Play>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* 1. Área del Video (Fondo) */}
            <VideoComponent />
            
            {/* 2. Capa de Superposición Oscura (para mejorar contraste del texto) */}
            <View style={styles.overlay} />

            {/* 3. Controles Superiores */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>UMAI</Text>
                <Search size={24} color="white"/>
            </View>

            {/* {foto de perfil por hacer} */}
            <View>

                
            </View>

            {/* 5. Iconos de Interacción (Derecha) */}
            <View style={styles.rightControls}>
                <Star size={32} color="white" style={styles.iconMargin} fill="white" />
                <MessageSquare size={32} color="white" style={styles.iconMargin} />
            </View>

            {/* 6. Información Inferior y Botones de Pedido (Abajo Izquierda) */}
            <View style={styles.footer}>
                {/* Botón Principal de Pedido */}
                <TouchableOpacity style={styles.mainOrderButton}>
                    <Text style={styles.mainOrderText}>Pedir por</Text>
                    <ShoppingCart size={20} color="white" />
                </TouchableOpacity>

                {/* Botones de Servicios de Comida */}
                <View style={styles.foodServiceButtons}>
                    {data.foodServiceOptions.map(service => (
                        <View key={service.name} style={styles.serviceButton}>
                            <TouchableOpacity>
                            <Text style={[styles.serviceText, { color: service.color }]}>{service.name}</Text>
                            </TouchableOpacity>
                        </View>
                        
                    ))}
                </View>
                
                {/* Texto del Usuario y Descripción */}
                <Text style={styles.usernameText}>{data.user}</Text>
                <Text style={styles.descriptionText}>{data.description}</Text>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: screenHeight, // Ocupa toda la altura
        width: screenWidth,   // Ocupa todo el ancho
        backgroundColor: 'black',
        justifyContent: 'flex-end',
    },
    // --- Video ---
    videoPlaceholder: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333', // Simula el fondo del video
    },
    video: {
        ...StyleSheet.absoluteFillObject,
    },
    placeholderText: {
        color: 'white',
        fontSize: 16,
    },
    playButton: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // --- Capas Superpuestas ---
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Ligero oscurecimiento para mejor contraste
    },
    // --- Header (UMAI) ---
    header: {
        position: 'absolute',
        top: 60, // Ajusta según la barra de estado de iOS/Android
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
    // --- Indicadores de Progreso ---
    progressContainer: {
        position: 'absolute',
        top: screenHeight * 0.2, // Posición vertical
        width: '100%',
        zIndex: 5,
    },
    progressCircle: {
        position: 'absolute',
        width: 15,
        height: 15,
        borderRadius: 7.5,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        opacity: 0.6,
    },
    // --- Iconos de Interacción (Derecha) ---
    rightControls: {
        position: 'absolute',
        right: 15,
        bottom: screenHeight * 0.2, // Encima del footer
        alignItems: 'center',
        zIndex: 5,
    },
    iconMargin: {
        marginBottom: 25,
    },
    // --- Footer (Información y Botones) ---
    footer: {
        paddingHorizontal: 15,
        paddingBottom: 60, // Espacio para la barra de navegación inferior
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
        backgroundColor: '#4CAF50', // Verde similar al de la imagen
        borderRadius: 30,
        paddingVertical: 8,
        paddingHorizontal: 15,
        alignSelf: 'flex-start', // Solo ocupa el ancho necesario
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
    // --- Barra de Navegación Inferior ---
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: 'white', // Fondo blanco como en la imagen
        borderTopWidth: 1,
        borderTopColor: '#eee',
        zIndex: 10,
    },
    navText: {
        color: '#888',
        fontWeight: '600',
    },
    navActive: {
        color: '#FF0033', // Color rojo para la pestaña activa 'Inicio'
        // Puedes añadir un icono para el botón central si lo deseas
    }
});

export default ReelItem;