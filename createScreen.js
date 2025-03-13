import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { MomentsContext } from '../context/MomentsContext';
import { AuthContext } from '../context/AuthContext';
import { colors, spacing, borderRadius, fontSize } from '../styles/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'react-native-image-picker';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const CreateScreen = ({ navigation }) => {
  const { saveMoment } = useContext(MomentsContext);
  const { user, verifyBiometrics } = useContext(AuthContext);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('event');
  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [location, setLocation] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [isChallenge, setIsChallenge] = useState(false);
  const [requireVerification, setRequireVerification] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const momentTypes = [
    { id: 'event', label: 'Event' },
    { id: 'wedding', label: 'Wedding' },
    { id: 'trip', label: 'Trip' },
    { id: 'challenge', label: 'Challenge' },
    { id: 'promise', label: 'Promise' },
  ];
  
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          name: 'Current Location',
        });
      },
      (error) => {
        console.error(error);
        Alert.alert('Error', 'Failed to get your location');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 3,
    });
    
    if (!result.didCancel && result.assets) {
      setPhotos(result.assets.map(asset => asset.uri));
    }
  };
  
  const takePhoto = async () => {
    const result = await ImagePicker.launchCamera({
      mediaType: 'photo',
      quality: 0.8,
    });
    
    if (!result.didCancel && result.assets) {
      setPhotos([...photos, ...result.assets.map(asset => asset.uri)]);
    }
  };
  
  const addParticipant = () => {
    // In a real app, this would open a contact picker or search
    // For now, we'll just add a dummy participant
    const newParticipant = {
      id: `temp-${Date.now()}`,
      name: `Friend ${participants.length + 1}`,
      email: `friend${participants.length + 1}@example.com`,
    };
    
    setParticipants([...participants, newParticipant]);
  };
  
  const removeParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id));
  };
  
  const handleCreateMoment = async () => {
    if (!title) {
      Alert.alert('Error', 'Please enter a title for your moment');
      return;
    }
    
    if (requireVerification) {
      const verified = await verifyBiometrics();
      if (!verified) {
        Alert.alert('Verification Failed', 'Biometric verification is required to create a verified moment');
        return;
      }
    }
    
    setLoading(true);
    
    const newMoment = {
      title,
      description,
      type,
      date: date.toISOString(),
      participants: [
        { id: user.id, name: user.name, email: user.email },
        ...participants
      ],
      location,
      photos,
      verified: requireVerification,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    };
    
    if (isChallenge) {
      newMoment.status = 'in-progress';
      newMoment.endDate = endDate.toISOString();
      newMoment.progress = 0;
      newMoment.milestones = [
        { id: 1, title: '25% Complete', completed: false },
        { id: 2, title: '50% Complete', completed: false },
        { id: 3, title: '75% Complete', completed: false },
        { id: 4, title: '100% Complete', completed: false },
      ];
    }
    
    const success = await saveMoment(newMoment);
    
    setLoading(false);
    
    if (success) {
      Alert.alert('Success', 'Your moment has been created!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } else {
      Alert.alert('Error', 'Failed to create moment. Please try again.');
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Moment Details</Text>
        
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Give your moment a