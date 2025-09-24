import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, ActivityIndicator, useColorScheme, Button, Appearance, Platform } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState(null); 
  const [overrideScheme, setOverrideScheme] = useState(null); 
  
  const router = useRouter();
  const systemScheme = useColorScheme();
  const colorScheme = overrideScheme || systemScheme; 

  const colors = {
    background: colorScheme === 'dark' ? '#121212' : '#f0f0f0',
    text: colorScheme === 'dark' ? '#ffffff' : '#000000',
    itemBackground: colorScheme === 'dark' ? '#1f1f1f' : '#ffffff',
    borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0',
    button: colorScheme === 'dark' ? '#BB86FC' : '#007AFF',
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const fetchUsers = async (pageNumber, isRetry = false) => {
    if (pageNumber === 1 || isRetry) {
      setLoading(true);
      setError(null);
    } else {
      setIsFetchingMore(true);
    }

    try {
      const response = await axios.get(`https://randomuser.me/api/?results=20&page=${pageNumber}`);
      
      setUsers(prevUsers => pageNumber === 1 ? response.data.results : [...prevUsers, ...response.data.results]);
      setFilteredUsers(prevUsers => pageNumber === 1 ? response.data.results : [...prevUsers, ...response.data.results]);
      
      setLoading(false);
      setIsFetchingMore(false);
      setError(null);

    } catch (err) {
      console.error("API Fetch Error:", err);
      setError('Failed to load users. Please check your network and try again.'); 
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setError(null);
    setSearchQuery(''); 
    await fetchUsers(1);
    setRefreshing(false);
  };
  
  const handleLoadMore = () => {
    if (!isFetchingMore && !loading && searchQuery.length === 0) { 
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUsers(nextPage);
    }
  };

  // 🔥 இந்த ஃபங்ஷனில் தான் பிழை திருத்தம் செய்யப்பட்டுள்ளது
  const toggleDarkMode = () => {
    const newScheme = colorScheme === 'dark' ? 'light' : 'dark';
    setOverrideScheme(newScheme);
    
    // Appearance.setColorScheme நேரடியாக வேலை செய்யவில்லை என்றால், Appearance.default-ஐப் பயன்படுத்துக
    if (Appearance.setColorScheme) {
        Appearance.setColorScheme(newScheme);
    } else if (Appearance.default?.setColorScheme) {
        Appearance.default.setColorScheme(newScheme);
    }
  };

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View style={[styles.footer, { borderTopColor: colors.borderColor }]}>
        <ActivityIndicator size="small" color={colors.text} />
        <Text style={{ color: colors.text, marginLeft: 10 }}>Loading more users...</Text>
      </View>
    );
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const formattedQuery = text.toLowerCase();
    const filtered = users.filter(user => {
      return (
        user.name.first.toLowerCase().includes(formattedQuery) ||
        user.name.last.toLowerCase().includes(formattedQuery) ||
        user.email.toLowerCase().includes(formattedQuery)
      );
    });
    setFilteredUsers(filtered);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => router.push({ pathname: `/[user]`, params: { user: JSON.stringify(item) } })} style={[styles.userItem, { backgroundColor: colors.itemBackground, borderBottomColor: colors.borderColor }]}>
      <View style={[styles.thumbnail, { backgroundColor: colors.borderColor }]}>
          <Image 
              source={{ uri: item.picture.thumbnail }} 
              style={styles.thumbnail} 
          />
      </View>
      <View>
        <Text style={[styles.name, { color: colors.text }]}>{`${item.name.first} ${item.name.last}`}</Text>
        <Text style={[styles.email, { color: colors.text, opacity: 0.8 }]}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  // --- Conditional Rendering ---
  
  if (loading && !refreshing && !isFetchingMore && users.length === 0) { 
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ color: colors.text, marginTop: 10 }}>Loading users...</Text>
      </View>
    );
  }
  
  if (error && users.length === 0) { 
    return (
      <View style={[styles.centered, { backgroundColor: colors.background, padding: 20 }]}>
        <Text style={{ color: colors.text, fontSize: 16, textAlign: 'center', marginBottom: 20 }}>{error}</Text>
        <Button title="Try Again" onPress={() => fetchUsers(1, true)} color={colors.button} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Header & Dark Mode Toggle Button */}
      <View style={[styles.headerContainer, { borderBottomColor: colors.borderColor }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>User Directory</Text>
        <Button 
          title={colorScheme === 'dark' ? "☀️ Light Mode" : "🌙 Dark Mode"} 
          onPress={toggleDarkMode} 
          color={colors.button} 
        />
      </View>

      <TextInput
        style={[styles.searchBar, { borderColor: colors.borderColor, color: colors.text, backgroundColor: colors.itemBackground }]}
        placeholder="Search by name or email"
        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
        onChangeText={handleSearch}
        value={searchQuery}
      />
      
      {/* Search Empty state */}
      {filteredUsers.length === 0 && searchQuery.length > 0 ? (
          <View style={styles.centeredEmpty}>
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold' }}>No results found</Text>
              <Text style={{ color: colors.text, marginTop: 5 }}>Try searching for a different name or email.</Text>
          </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.login.uuid}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      )}
      
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? 30 : 50, 
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchBar: {
    height: 48, 
    borderWidth: 1,
    borderRadius: 24, 
    paddingHorizontal: 15,
    marginHorizontal: 15, 
    marginBottom: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12, 
    paddingHorizontal: 15,
    borderBottomWidth: StyleSheet.hairlineWidth, 
  },
  thumbnail: {
    width: 60, 
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
  },
  footer: {
    paddingVertical: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default UserListScreen;
