import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const UserDetailScreen = () => {
  const { user } = useLocalSearchParams();
  const parsedUser = JSON.parse(user);

  return (
    <View style={styles.container}>
      <Image source={{ uri: parsedUser.picture.large }} style={styles.largeProfilePic} />
      <Text style={styles.fullName}>{`${parsedUser.name.title} ${parsedUser.name.first} ${parsedUser.name.last}`}</Text>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{parsedUser.email}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{parsedUser.phone}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.value}>{`${parsedUser.location.city}, ${parsedUser.location.country}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  largeProfilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  value: {
    fontSize: 16,
  },
});

export default UserDetailScreen;