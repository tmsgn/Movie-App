import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Player from '../../components/player';
import Modal from 'react-native-modal';

const API_ENDPOINT = 'https://api.example.com/tvshow/'; // Placeholder

const TVShowPlayer = ({ showId }) => {
  const [seasons, setSeasons] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [isEpisodeModalVisible, setEpisodeModalVisible] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSeasons = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real scenario, you would fetch this from your API
      // const response = await fetch(`${API_ENDPOINT}${showId}`);
      // const data = await response.json();
      const data = [
        {
          id: 1,
          name: 'Season 1',
          episodes: [
            { id: 's1e1', title: '01 Almost True', duration: '45m' },
            { id: 's1e2', title: '02 A Kind of Grief', duration: '45m' },
          ],
        },
        {
          id: 2,
          name: 'Season 2',
          episodes: [
            { id: 's2e1', title: '01 Episode 1', duration: '42m' },
            { id: 's2e2', title: '02 Episode 2', duration: '43m' },
          ],
        },
      ];
      setSeasons(data);
      setSelectedSeason(data[0]);
      setSelectedEpisode(data[0].episodes[0]);
    } catch (e) {
      setError('Failed to load season data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeasons();
  }, [showId]);

  const toggleEpisodeModal = () => setEpisodeModalVisible(!isEpisodeModalVisible);

  const renderEpisode = ({ item }) => (
    <TouchableOpacity onPress={() => {
      setSelectedEpisode(item);
      toggleEpisodeModal();
    }}>
      <View style={styles.episodeContainer}>
        <Text style={styles.episodeTitle}>{item.title}</Text>
        <Text style={styles.episodeDuration}>{item.duration}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator style={styles.container} />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={fetchSeasons} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {selectedEpisode && <Player sourceId={selectedEpisode.id} />}
      <View style={styles.overlay}>
        <Button title="Episodes" onPress={toggleEpisodeModal} />
      </View>
      <Modal isVisible={isEpisodeModalVisible} onBackdropPress={toggleEpisodeModal} style={styles.modal}>
        <View style={styles.modalContent}>
          <View style={styles.seasonSelector}>
            {seasons.map(season => (
              <TouchableOpacity key={season.id} onPress={() => setSelectedSeason(season)}>
                <Text style={[styles.seasonText, selectedSeason?.id === season.id && styles.selectedSeasonText]}>
                  {season.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedSeason && (
            <FlatList
              data={selectedSeason.episodes}
              renderItem={renderEpisode}
              keyExtractor={item => item.id}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    right: 20,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: '50%',
  },
  seasonSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  seasonText: {
    fontSize: 18,
    color: 'gray',
  },
  selectedSeasonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  episodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  episodeTitle: {
    fontSize: 16,
  },
  episodeDuration: {
    fontSize: 16,
    color: 'gray',
  },
});

export default TVShowPlayer;
