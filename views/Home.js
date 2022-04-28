import React, {useContext} from 'react';
import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {useLoadData} from '../hooks/ApiHooks';

const Home = ({navigation}) => {
  const {isLoggedIn, setIsLoggedIn, setUser, setIsUsingAnonymously} =
    useContext(MainContext);
  const brandsArray = useLoadData();

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
          <TouchableHighlight
            style={styles.logoutLoginButton}
            underlayColor={'transparent'}
            onPress={logout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableHighlight>
        ) : (
          <TouchableHighlight
            style={styles.logoutLoginButton}
            underlayColor={'transparent'}
            onPress={login}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableHighlight>
        )}
      </View>
      <Text style={styles.titleText}>Find car models</Text>
      <Text style={styles.text}>Select a car brand</Text>
      <View style={styles.listContainer}>
        <FlatList
          contentContainerStyle={styles.list}
          data={brandsArray}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>{item.name}</Text>
            </View>
          )}
        ></FlatList>
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
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
  list: {},
  listItem: {
    backgroundColor: 'white',
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
