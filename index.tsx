import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, ActivityIndicator, useColorScheme } from 'react-native';
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
  const router = useRouter();
  const colorScheme = useColorScheme(); 

  const colors = {
    background: colorScheme === 'dark' ? '#121212' : '#f0f0f0',
    text: colorScheme === 'dark' ? '#ffffff' : '#000000',
    itemBackground: colorScheme === 'dark' ? '#1f1f1f' : '#ffffff',
    borderColor: colorScheme === 'dark' ? '#333' : '#ccc',
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const fetchUsers = async (pageNumber) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setIsFetchingMore(true);
      }
      const response = await axios.get(`https://randomuser.me/api/?results=20&page=${pageNumber}`);
      setUsers(prevUsers => pageNumber === 1 ? response.data.results : [...prevUsers, ...response.data.results]);
      setFilteredUsers(prevUsers => pageNumber === 1 ? response.data.results : [...prevUsers, ...response.data.results]);
      setLoading(false);
      setIsFetchingMore(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await fetchUsers(1);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!isFetchingMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUsers(nextPage);
    }
  };

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View style={styles.footer}>
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
      <Image source={{ uri: item.picture.thumbnail }} style={styles.thumbnail} />
      <View>
        <Text style={[styles.name, { color: colors.text }]}>{`${item.name.first} ${item.name.last}`}</Text>
        <Text style={[styles.email, { color: colors.text }]}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        style={[styles.searchBar, { borderColor: colors.borderColor, color: colors.text, backgroundColor: colors.itemBackground }]}
        placeholder="Search by name or email"
        placeholderTextColor={colors.text}
        onChangeText={handleSearch}
        value={searchQuery}
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.login.uuid}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
  },
  footer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserListScreen;