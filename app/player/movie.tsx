import React from 'react';
import { View, StyleSheet } from 'react-native';
import Player from '../../components/player';

const MoviePlayer = () => {
  // Assuming the movie ID is passed as a prop or through navigation
  const movieId = 'some-movie-id';
  return (
    <View style={styles.container}>
      <Player sourceId={movieId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MoviePlayer;
