import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabOneScreen() {
  const [activeTab, setActiveTab] = useState<'new' | 'harvested'>('new');

  const newPlants = [
    {
      name: 'Sempervivum',
      date: '3 days ago',
      image:
        'https://img.freepik.com/free-photo/beautiful-green-succulent-plant_53876-132998.jpg',
    },
    {
      name: 'Peony',
      date: '2 days ago',
      image:
        'https://img.freepik.com/free-photo/pink-peony-isolated-white_53876-133159.jpg',
    },
    {
      name: 'Lavender',
      date: '1 week ago',
      image:
        'https://img.freepik.com/free-photo/lavender-isolated-white_53876-133160.jpg',
    },
  ];

  const harvestedPlants = [
    {
      name: 'Lavender',
      date: '1 week ago',
      image:
        'https://img.freepik.com/free-photo/lavender-isolated-white_53876-133160.jpg',
    },
    {
      name: 'Rose',
      date: '10 days ago',
      image:
        'https://img.freepik.com/free-photo/beautiful-red-rose-isolated-white_53876-133155.jpg',
    },
    {
      name: 'Lavender',
      date: '1 week ago',
      image:
        'https://img.freepik.com/free-photo/lavender-isolated-white_53876-133160.jpg',
    },
    
  ];


  const plantsToDisplay = activeTab === 'new' ? newPlants : harvestedPlants;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/100' }}
          style={styles.avatar}
        />
        <View style={styles.icons}>
          <Ionicons name="notifications-outline" size={24} style={styles.icon} />
          <Ionicons name="sunny-outline" size={24} style={styles.icon} />
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Manage Your</Text>
        <Text style={styles.subtitle}>Home Plants</Text>
      </View>

      {/* Featured Plant Card */}
      <View style={styles.card}>
        <Image
          source={{
            uri: 'https://img.freepik.com/free-photo/succulent-plant-white_53876-138103.jpg',
          }}
          style={styles.cardImage}
        />
        <View style={styles.cardOverlay}>
          <Text style={styles.cardTitle}>Succulent</Text>
          <Text style={styles.cardDetail}>12 days ago planted</Text>
          <Text style={styles.cardDetail}>Room Temp: 24°C</Text>
          <Text style={styles.cardDetail}>Room Light: 76%</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => setActiveTab('new')}>
          <Text style={activeTab === 'new' ? styles.activeTab : styles.inactiveTab}>
            New Plant
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('harvested')}>
          <Text
            style={activeTab === 'harvested' ? styles.activeTab : styles.inactiveTab}
          >
            Harvested
          </Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal ScrollView for plant cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {plantsToDisplay.map((plant, index) => (
          <View key={index} style={styles.plantItem}>
            <Image source={{ uri: plant.image }} style={styles.plantImage} />
            <Text style={styles.plantName}>{plant.name}</Text>
            <Text style={styles.plantInfo}>{plant.date}</Text>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  icons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
  },
  titleSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '300',
  },
  card: {
    backgroundColor: '#d9f2e6',
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardOverlay: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardDetail: {
    fontSize: 14,
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  activeTab: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  inactiveTab: {
    color: '#aaa',
  },
  plantItem: {
    width: 140,            // more width gives more breathing room
    marginRight: 20,       // space between each card
    alignItems: 'center',
  },
  horizontalScroll: {
    paddingLeft: 20,
    paddingRight: 10,      // optional: space at end of scroll
    paddingVertical: 10,
  },
  
  plantImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  plantName: {
    marginTop: 8,
    fontWeight: '600',
  },
  plantInfo: {
    color: '#888',
    fontSize: 12,
  },
});
