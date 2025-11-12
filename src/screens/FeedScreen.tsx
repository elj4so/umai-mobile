import React, { useState, useRef, useCallback } from 'react';
import { FlatList, Dimensions, StyleSheet, View, LayoutChangeEvent, StatusBar } from 'react-native';
import { useIsFocused } from '@react-navigation/native'; 

// Estilos Colores
import { COLORS } from '../constants/colors';
// Componentes
import VideoItem from '../components/VideoItem'; 
// Data Videos
import { VIDEOS } from '../data/staticVideos';

//const { height: screenHeight } = Dimensions.get('window');

const FeedScreen = () => {
    const [activeVideoId, setActiveVideoId] = useState(VIDEOS[0].id);
    const [containerHeight, setContainerHeight] = useState(0);
    
    // 'isTabFocused' será 'true' si estamos en la pestaña "Inicio",
    // y 'false' si estamos en "Guardados" o "Perfil".
    const isTabFocused = useIsFocused();

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const newActiveId = viewableItems[0].item.id;
            setActiveVideoId(newActiveId);
        }
    }).current;

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50,
    };

    const renderItem = useCallback(({ item }) => {
        const isCurrentlyPlaying = (activeVideoId === item.id) && isTabFocused;

        // Envuelve VideoItem en un View con la altura medida
        return (
            <View style={{ height: containerHeight, width: '100%' }}> 
                <VideoItem 
                    data={item} 
                    isPlaying={isCurrentlyPlaying}
                />
            </View>
        );
    }, [activeVideoId, isTabFocused, containerHeight]);

    const onLayout = (event: LayoutChangeEvent) => {
        // Solo mide la altura si aún no la tiene
        if (containerHeight === 0) {
            const { height } = event.nativeEvent.layout;
            setContainerHeight(height); // Guarda la altura real
        }
    };

    return (
        <View style={styles.container} onLayout={onLayout}>
            <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" /> 

            <FlatList
                data={VIDEOS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                
                pagingEnabled={true}
                decelerationRate="fast"
                showsVerticalScrollIndicator={false}

                getItemLayout={(data, index) => (
                   { length: containerHeight, offset: containerHeight * index, index }
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