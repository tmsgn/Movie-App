import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import Video from 'react-native-video';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_ENDPOINT = 'https://api.example.com/stream/'; // Placeholder
const CACHE_EXPIRATION = 2 * 60 * 1000; // 2 minutes

const Player = ({ sourceId }) => {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qualities] = useState(['auto', '240p', '360p', '480p', '720p', '1080p']);
  const [selectedQuality, setSelectedQuality] = useState('auto');
  const [subtitles, setSubtitles] = useState([]);
  const [selectedSubtitle, setSelectedSubtitle] = useState(null);
  const [isQualityModalVisible, setQualityModalVisible] = useState(false);
  const [isSubtitleModalVisible, setSubtitleModalVisible] = useState(false);

  const timeoutRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a 2-minute timeout
    timeoutRef.current = setTimeout(() => {
      setError('Request timed out after 2 minutes.');
      setLoading(false);
    }, 120000); // 2 minutes in milliseconds

    try {
      // Check cache first
      const cachedData = await AsyncStorage.getItem(sourceId);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_EXPIRATION) {
          console.log('Using cached data');
          setStream(data.stream);
          setSubtitles(data.captions);
          const englishSubtitle = data.captions.find(c => c.language === 'en');
          if (englishSubtitle) {
            setSelectedSubtitle(englishSubtitle);
          }
          clearTimeout(timeoutRef.current);
          setLoading(false);
          return;
        }
      }

      // If no valid cache, fetch from API
      console.log('Fetching data from API');
      const response = await fetch(`${API_ENDPOINT}${sourceId}`);

      // Since the API is a placeholder, I'll simulate a response.
      // In a real scenario, the result of the fetch would be used.
      const json = { "sourceId": "rgshows", "stream": { "id": "primary", "type": "hls", "playlist": "https://hexa.cloudburst99.site/pnuFTYnemoo-Azrl8GjYX1p5ShCzYzOvwsc_rUtZ_w4JBcAbu--EdBYDCSblRjWNUgYs7qR9uC6JPAcwqpkDUEy7z2sICj-fDNwarzgNAHebgQpiS9dPXPDr9sI7l_vuSQCvUUF0hnnLMZSmuO75kvCg8K4eDchb7BebwPbHRG7gWbnYjpMtIkqG3wcxmYJPxtb6sPx1w0AmQkQ_eFW5q4SQ2QNcfy4I7D7sobV5PRyB0I4zoSBa-SgvvTACr_5Hhy8Oz0ZRrjqWc469o2Pk6dMJjDrCVkGHMPcI-_UU1XNalqwaEK7KVsNPRldHZRGCFWosZC05sHC7SKnbAMAscYJpmYlauuPBIx6bn_OpduNhWL48h9gS5ArOKF1JSV42IktxeqB3wMmvOLsa7gezH-RI9xueZAqnlY0vZBPJrS05rrxqtZdcfPb9Oe9eZBOpLcL-sddvVOZ3Rq3hmYxVBHp7okv3VS998hMJQPCTcfhBQSLY1_cgw_cf_vWpGP5gWJxem82j0li5zlbW_7UafF758MbG2vWSxjlDRqSUd48XooZ4zFta82aFOt8SBd0U7DRvwTzxCIpkNPD-xAcr_FlLc-dXwcUgLROJGFSIYRphvT5w7nd3LtLaC0d1K7LXokrqEIetkhYs47XOnzLRnBtvajKH2EypyRhVAlvYske6ub66SDzmTqOFClYOAZyhOdGw0A8LqUIiOrR7TxZYpddCSyRGPi7RYK_r_8MomHs.m3u8", "headers": { "referer": "https://www.rgshows.ru/", "origin": "https://www.rgshows.ru/", "host": "hexa.cloudburst99.site", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" }, "flags": [], "captions": [ { "id": "1", "language": "en", "url": "https://dl.opensubtitles.org/en/download/sub/src-api/vrf-19bd0c59/file/1961804937" }, { "id": "2", "language": "es", "url": "https://dl.opensubtitles.org/en/download/sub/src-api/vrf-19c30c58/file/1961805890" }, { "id": "3", "language": "fr", "url": "https://dl.opensubtitles.org/en/download/sub/src-api/vrf-19c90c5e/file/1961805896" } ] } };

      if (json.error === "no_output") {
        throw new Error("no_output");
      }

      // Cache the new data
      await AsyncStorage.setItem(sourceId, JSON.stringify({ data: json, timestamp: Date.now() }));

      setStream(json.stream);
      setSubtitles(json.captions);
      const englishSubtitle = json.captions.find(c => c.language === 'en');
      if (englishSubtitle) {
        setSelectedSubtitle(englishSubtitle);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      clearTimeout(timeoutRef.current);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [sourceId]);

  const toggleQualityModal = () => setQualityModalVisible(!isQualityModalVisible);
  const toggleSubtitleModal = () => setSubtitleModalVisible(!isSubtitleModalVisible);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading, please wait...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity onPress={fetchData}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {stream && (
        <Video
          source={{ uri: stream.playlist, headers: stream.headers }}
          style={styles.video}
          controls
          selectedVideoTrack={selectedQuality !== 'auto' ? { type: 'resolution', value: parseInt(selectedQuality) } : undefined}
          selectedTextTrack={selectedSubtitle ? { type: 'language', value: selectedSubtitle.language } : undefined}
          textTracks={subtitles.map(s => ({
            title: s.language,
            uri: s.url,
            type: 'application/x-subrip',
            language: s.language,
          }))}
        />
      )}
      <View style={styles.overlay}>
        <Button title="Quality" onPress={toggleQualityModal} />
        <Button title="Subtitles" onPress={toggleSubtitleModal} />
      </View>
      <Modal isVisible={isQualityModalVisible} onBackdropPress={toggleQualityModal}>
        <View style={styles.modalContent}>
          {qualities.map(q => (
            <TouchableOpacity key={q} onPress={() => { setSelectedQuality(q); toggleQualityModal(); }}>
              <Text style={styles.modalText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
      <Modal isVisible={isSubtitleModalVisible} onBackdropPress={toggleSubtitleModal}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={() => { setSelectedSubtitle(null); toggleSubtitleModal(); }}>
            <Text style={styles.modalText}>Off</Text>
          </TouchableOpacity>
          {subtitles.map(s => (
            <TouchableOpacity key={s.id} onPress={() => { setSelectedSubtitle(s); toggleSubtitleModal(); }}>
              <Text style={styles.modalText}>{s.language}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' },
  video: { width: '100%', height: '100%' },
  errorText: { color: 'white', marginBottom: 10 },
  retryText: { color: 'lightblue', fontSize: 16 },
  loadingText: { color: 'white', marginTop: 10 },
  overlay: { position: 'absolute', top: 20, right: 20, flexDirection: 'row', gap: 10 },
  modalContent: { backgroundColor: 'white', padding: 22, justifyContent: 'center', alignItems: 'center', borderRadius: 4, borderColor: 'rgba(0, 0, 0, 0.1)' },
  modalText: { fontSize: 18, marginBottom: 12 },
});

export default Player;
