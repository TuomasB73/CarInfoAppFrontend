import React, {useContext} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {useLoadBrands} from '../hooks/ApiHooks';

const Home = ({navigation}) => {
  const {isLoggedIn, setIsLoggedIn, setUser, setIsUsingAnonymously} =
    useContext(MainContext);
  const brandsArray = useLoadBrands();

  const logout = async () => {
    await AsyncStorage.clear();
    setUser({});
    setIsLoggedIn(false);
  };

  const login = async () => {
    await AsyncStorage.clear();
    setIsUsingAnonymously(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoutLoginButtonContainer}>
        {isLoggedIn ? (
          <TouchableOpacity style={styles.logoutLoginButton} onPress={logout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.logoutLoginButton} onPress={login}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.titleText}>Find car models</Text>
      <Text style={styles.text}>Select a car brand</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={brandsArray.sort((a, b) => a.name.localeCompare(b.name))}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {
                navigation.navigate('Car models', {brand: item});
              }}
            >
              <Text style={styles.listItemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        ></FlatList>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoutLoginButtonContainer: {
    alignSelf: 'flex-end',
    margin: 4,
  },
  logoutLoginButton: {
    padding: 14,
  },
  buttonText: {
    fontSize: 16,
  },
  titleText: {
    fontSize: 30,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    margin: 12,
  },
  listContainer: {
    flex: 1,
    backgroundColor: 'lightblue',
    marginTop: 20,
    marginStart: 60,
    marginEnd: 60,
    padding: 8,
  },
  listItem: {
    backgroundColor: '#e6e6e6',
    margin: 4,
  },
  listItemText: {
    fontSize: 20,
    margin: 8,
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
