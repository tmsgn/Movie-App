import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const API_ENDPOINT = 'https://api.example.com/movie/'; // Placeholder

const MovieDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Cast');
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real app, you'd fetch this from your API
        // const response = await fetch(`${API_ENDPOINT}${id}`);
        // const data = await response.json();

        // Using dummy data for now
        const data = {
          id: 'our-fault',
          title: 'Our Fault',
          year: '2025',
          rating: '7.6',
          posterUrl: 'https://image.tmdb.org/t/p/w500/2y46TssoKxudxSkMY6J64M0G0Tz.jpg',
          backdropUrl: 'https://image.tmdb.org/t/p/w1280/2y46TssoKxudxSkMY6J64M0G0Tz.jpg',
          cast: [
            { id: '1', name: 'Nicole Wallace', character: 'Noah Moran', profileUrl: 'https://image.tmdb.org/t/p/w185/AbXQ0v9W29gAud5f5I2D642i8eI.jpg' },
            { id: '2', name: 'Gabriel Guevara', character: 'Nick Leister', profileUrl: 'https://image.tmdb.org/t/p/w185/A232eSckX2BA1dODaRM665sCFw9.jpg' },
          ],
        };
        setMovie(data);
      } catch (e) {
        setError('Failed to load movie details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const renderCastItem = ({ item }) => (
    <View style={styles.castItem}>
      <Image source={{ uri: item.profileUrl }} style={styles.castImage} />
      <View>
        <Text style={styles.castName}>{item.name}</Text>
        <Text style={styles.castCharacter}>{item.character}</Text>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={styles.container} />;
  }

  if (error || !movie) {
    return <Text style={styles.errorText}>{error || 'Movie not found.'}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: movie.backdropUrl }} style={styles.backdrop} />
        <View style={styles.overlay} />
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Image source={{ uri: movie.posterUrl }} style={styles.poster} />
          <View style={styles.info}>
            <Text style={styles.title}>{movie.title}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{movie.rating}</Text>
            </View>
            <Text style={styles.year}>{movie.year}</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabs}>
        {['Overview', 'Cast', 'Related'].map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.playButton} onPress={() => router.push(`/player/movie?id=${movie.id}`)}>
        <Ionicons name="play" size={24} color="black" />
        <Text style={styles.playButtonText}>Play</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {activeTab === 'Cast' && (
          <>
            <Text style={styles.sectionTitle}>Cast</Text>
            <FlatList
              data={movie.cast}
              renderItem={renderCastItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  errorText: { color: 'white', textAlign: 'center', marginTop: 50 },
  header: { height: 350, marginBottom: 20 },
  backdrop: { width: '100%', height: '100%', position: 'absolute' },
  overlay: { width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute' },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 1 },
  headerContent: { flexDirection: 'row', position: 'absolute', bottom: 20, left: 20 },
  poster: { width: 100, height: 150, borderRadius: 8 },
  info: { marginLeft: 15, justifyContent: 'flex-end' },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  rating: { color: 'white', marginLeft: 5 },
  year: { color: 'gray' },
  tabs: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 20 },
  tabText: { color: 'gray', fontSize: 16 },
  activeTabText: { color: 'white', fontWeight: 'bold' },
  playButton: { flexDirection: 'row', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', margin: 20, padding: 15, borderRadius: 30 },
  playButtonText: { color: 'black', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  content: { paddingHorizontal: 20 },
  sectionTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  castItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  castImage: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  castName: { color: 'white', fontSize: 16 },
  castCharacter: { color: 'gray' },
});

export default MovieDetailsScreen;
