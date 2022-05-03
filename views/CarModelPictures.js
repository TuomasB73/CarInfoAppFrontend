import React, {useContext} from 'react';
import {View, Text, StyleSheet, FlatList, Button, Alert} from 'react-native';
import PropTypes from 'prop-types';
import {useLoadCarModelPictures} from '../hooks/ApiHooks';
import PictureListItem from '../components/PictureListItem';
import {MainContext} from '../contexts/MainContext';

const CarModelPictures = ({navigation, route}) => {
  const {carId, carModelName} = route.params;
  const picturesArray = useLoadCarModelPictures({car: carId});
  const {isLoggedIn} = useContext(MainContext);

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.titleText}>{carModelName} pictures</Text>
            <View style={styles.buttonContainer}>
              <Button
                title="Add a picture"
                onPress={() => {
                  if (isLoggedIn) {
                    navigation.navigate('Add picture', {carId, carModelName});
                  } else {
                    Alert.alert('You must login/register to add a picture');
                  }
                }}
              ></Button>
            </View>
            <View style={styles.listContainer}>
              {picturesArray.length > 0 ? (
                <FlatList
                  data={picturesArray.reverse()}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <PictureListItem picture={item}></PictureListItem>
                  )}
                ></FlatList>
              ) : (
                <Text style={styles.text}>No pictures for this car yet</Text>
              )}
            </View>
          </>
        }
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    fontSize: 30,
    textAlign: 'center',
    margin: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    margin: 10,
  },
  listContainer: {
    backgroundColor: '#d5e3eb',
    margin: 10,
    borderRadius: 10,
  },
  pictureContainer: {
    backgroundColor: 'lightblue',
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  usernameText: {
    fontSize: 20,
  },
  iconButtonsContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    margin: 4,
  },
  pictureText: {
    fontSize: 20,
    marginBottom: 10,
  },
  image: {
    height: 220,
  },
  text: {
    fontSize: 26,
    textAlign: 'center',
    margin: 12,
  },
});

CarModelPictures.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default CarModelPictures;
