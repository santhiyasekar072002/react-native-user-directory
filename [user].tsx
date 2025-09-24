import React from 'react';
import { View, Text, StyleSheet, Image, useColorScheme } from 'react-native';
import { useLocalSearchParams } from 'expo-router';


const DetailRow = ({ label, value, colors }) => (
    <View style={styles.detailContainer}>
        <Text style={[styles.label, { color: colors.text }]}>{label}:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
    </View>
);

const UserDetailScreen = () => {
    const { user } = useLocalSearchParams();
    const colorScheme = useColorScheme();

    // Dark Mode-க்கான நிறங்கள்
    const colors = {
        background: colorScheme === 'dark' ? '#121212' : '#f0f0f0',
        text: colorScheme === 'dark' ? '#ffffff' : '#000000',
        cardBackground: colorScheme === 'dark' ? '#1f1f1f' : '#ffffff',
        borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0',
    };
    
    if (!user || typeof user !== 'string') {
        return (
            <View style={[styles.centered, { backgroundColor: colors.background }]}>
                <Text style={[styles.errorText, { color: colors.text }]}>
                    Error: User data not found or failed to load.
                </Text>
                <Text style={{ color: colors.text, marginTop: 10 }}>
                    Please go back to the list and try again.
                </Text>
            </View>
        );
    }

    const parsedUser = JSON.parse(user);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            
            {/* Profile Picture Section */}
            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: parsedUser.picture.large }} 
                    style={styles.largeProfilePic} 
                />
            </View>
            
            <Text style={[styles.fullName, { color: colors.text }]}>
                {`${parsedUser.name.title}. ${parsedUser.name.first} ${parsedUser.name.last}`}
            </Text>
            
            {/* Details Card */}
            <View style={[styles.detailsCard, { backgroundColor: colors.cardBackground, borderColor: colors.borderColor }]}>
                <DetailRow label="Email" value={parsedUser.email} colors={colors} />
                <DetailRow label="Phone" value={parsedUser.phone} colors={colors} />
                <DetailRow label="Location" value={`${parsedUser.location.city}, ${parsedUser.location.country}`} colors={colors} />
                <DetailRow label="Birthday" value={new Date(parsedUser.dob.date).toLocaleDateString()} colors={colors} />
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
  // 🔥 3. Error State-க்கான styles
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'red',
  },
  // 🔥
  imageContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#ccc',
    marginBottom: 25,
    overflow: 'hidden',
  },
  largeProfilePic: {
    width: '100%',
    height: '100%',
  },
  fullName: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  detailsCard: {
    width: '95%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  detailContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    minWidth: 90, 
  },
  value: {
    fontSize: 16,
    flexShrink: 1,
  },
});

export default UserDetailScreen;

