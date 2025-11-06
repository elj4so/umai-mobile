import React, { useState, useRef, useCallback } from 'react';
import { FlatList, Dimensions, StyleSheet, View, Text, StatusBar } from 'react-native';
// Si estás usando Expo, usa:
// import { StatusBar } from 'expo-status-bar'; 
import ReelItem from '../components/ReelItem'; 
// ... tus imports de FEED_DATA, etc.

const { height: screenHeight } = Dimensions.get('window');

const FEED_DATA = [
    {
        id: '1',
        user: '@TastyDGO',
        description: 'Los Hermosos',
        videoUrl: 'https://res.cloudinary.com/drfhnbhyo/video/upload/v1762391761/plateo/videos/878c0139-c09b-4640-b115-c742917dcfdc/vy1z3q5b34i8lhigzbvz.mp4', // Cambia por tus videos reales
        foodServiceOptions: [
            { name: 'Uber Eats', color: 'green' },
            { name: 'DiDi Food', color: '#FF7D00' },
            { name: 'Rappi', color: '#FF4A50' },
        ]
    },
    {
        id: '2',
        user: '@gourmet_mex',
        description: 'Salchichon',
        videoUrl: 'https://res.cloudinary.com/drfhnbhyo/video/upload/v1762391815/plateo/videos/878c0139-c09b-4640-b115-c742917dcfdc/tuatelqrxz0x5vp99hjr.mp4',
        foodServiceOptions: [
            { name: 'Uber Eats', color: 'green' },
            { name: 'Rappi', color: '#FF4A50' },
        ]
    },
    {
        id: '3',
        user: '@marmolejo',
        description: 'rico',
        videoUrl: 'https://res.cloudinary.com/drfhnbhyo/video/upload/v1762391853/plateo/videos/878c0139-c09b-4640-b115-c742917dcfdc/vbdk7obsgynqginalie8.mp4',
        foodServiceOptions: [
            { name: 'DiDi Food', color: '#FF7D00' },
        ]
    },
     {
        id: '4',
        user: '@ondecomer',
        description: 'rico',
        videoUrl: 'https://res.cloudinary.com/drfhnbhyo/video/upload/v1761116206/plateo/videos/878c0139-c09b-4640-b115-c742917dcfdc/gzszmnurdovhie16bkga.mp4',
        foodServiceOptions: [
            { name: 'DiDi Food', color: '#FF7D00' },
        ]
    },
];
// --------------------------------------------------- 
const FeedScreen = () => {
    const [activeVideoId, setActiveVideoId] = useState(FEED_DATA[0].id);

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const newActiveId = viewableItems[0].item.id;
            setActiveVideoId(newActiveId);
        }
    }).current;

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50,
    };

    const renderItem = useCallback(({ item }) => (
        // El contenedor del ítem sigue siendo la altura total de la pantalla
        <View style={{ height: screenHeight, width: '100%' }}>
            <ReelItem 
                data={item} 
                isPlaying={activeVideoId === item.id}
            />
        </View>
    ), [activeVideoId]);


    return (
        <View style={styles.container}>
            {/* Opcional: Configurar la barra de estado para que sea transparente */}
            <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" /> 

            <FlatList
                data={FEED_DATA}
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
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Esto asegura que ocupe todo el espacio disponible
        backgroundColor: 'black',
    },
});

export default FeedScreen;