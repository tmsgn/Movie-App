import React from 'react';
import { View, StyleSheet } from 'react-native';
import Player from '../../components/player';
import { useLocalSearchParams } from 'expo-router';

const MoviePlayer = () => {
  const { id } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <Player sourceId={id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MoviePlayer;
