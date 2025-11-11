import React, { useState, useRef, useCallback } from 'react';
import { FlatList, Dimensions, StyleSheet, View, StatusBar } from 'react-native';
import ReelItem from '../components/ReelItem';

const { height: screenHeight } = Dimensions.get('window');

const FEED_DATA = [
    {
        id: '1',
        user: '@TastyDGO',
        description: 'Los Hermosos',
        videoUrl: 'https://res.cloudinary.com/drfhnbhyo/video/upload/v1762834864/plateo/videos/878c0139-c09b-4640-b115-c742917dcfdc/uxqec3igou913auenrnz.mp4',
        foodServiceOptions: [
            { name: 'Uber Eats', color: 'green' },
            { name: 'DiDi Food', color: '#FF7D00' },
            { name: 'Rappi', color: '#FF4A50' },
        ],
    },
    {
        id: '2',
        user: '@gourmet_mex',
        description: 'Salchichon',
        videoUrl: 'https://res.cloudinary.com/drfhnbhyo/video/upload/v1762834902/plateo/videos/878c0139-c09b-4640-b115-c742917dcfdc/m1xkquzkggj9t0mbxr4m.mp4',
        foodServiceOptions: [
            { name: 'Uber Eats', color: 'green' },
            { name: 'Rappi', color: '#FF4A50' },
        ],
    },
    {
        id: '3',
        user: '@marmolejo',
        description: 'rico',
        videoUrl: 'https://res.cloudinary.com/drfhnbhyo/video/upload/v1762834924/plateo/videos/878c0139-c09b-4640-b115-c742917dcfdc/x2l6rwm0syxpxy29lqfb.mp4',
        foodServiceOptions: [
            { name: 'DiDi Food', color: '#FF7D00' },
        ],
    },
    {
        id: '4',
        user: '@ondecomer',
        description: 'rico',
        videoUrl: 'https://res.cloudinary.com/drfhnbhyo/video/upload/v1761116206/plateo/videos/878c0139-c09b-4640-b115-c742917dcfdc/gzszmnurdovhie16bkga.mp4',
        foodServiceOptions: [
            { name: 'DiDi Food', color: '#FF7D00' },
        ],
    },
];

const FeedScreen = () => {
  const [activeVideoId, setActiveVideoId] = useState(FEED_DATA[0].id);
  const [pausedVideos, setPausedVideos] = useState<Record<string, boolean>>({});

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newActiveId = viewableItems[0].item.id;
      setActiveVideoId(newActiveId);
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const togglePause = (id: string) => {
    setPausedVideos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderItem = useCallback(
    ({ item }) => (
      <ReelItem
        data={item}
        isPlaying={activeVideoId === item.id && !pausedVideos[item.id]}
        onTogglePause={() => togglePause(item.id)}
      />
    ),
    [activeVideoId, pausedVideos]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <FlatList
        data={FEED_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: screenHeight,
          offset: screenHeight * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default FeedScreen;
