import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import {useLoadCarModelPictures} from '../hooks/ApiHooks';
import {Ionicons} from '@expo/vector-icons';
import {UPLOADS_URL} from '../utils/Variables';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {usePicture} from '../hooks/ApiHooks';

const CarModelPictures = ({navigation, route}) => {
  const {carId, carModelName} = route.params;
  const picturesArray = useLoadCarModelPictures({car: carId});
  const {user, updatePictures, setUpdatePictures} = useContext(MainContext);
  const {deletePicture} = usePicture();

  const deleteMyPicture = async (pictureId) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const deletedPicture = await deletePicture(
        {deleteMyPictureId: pictureId},
        userToken
      );
      if (deletedPicture) {
        setUpdatePictures(updatePictures + 1);
      }
    } catch (e) {
      console.log('deletePicture error', e.message);
    }
  };

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
                  navigation.navigate('Add picture', {carId, carModelName});
                }}
              ></Button>
            </View>
            <View style={styles.listContainer}>
              {picturesArray.length > 0 ? (
                <FlatList
                  data={picturesArray.reverse()}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <View style={styles.pictureContainer}>
                      <View style={styles.userContainer}>
                        <Text style={styles.usernameText}>
                          {item.user.nickname}
                        </Text>
                        <View style={styles.iconButtonsContainer}>
                          {user.id === item.user.id && (
                            <TouchableOpacity
                              style={styles.iconButton}
                              onPress={() => {
                                Alert.alert(
                                  'Delete',
                                  'Are you sure you want to delete this picture?',
                                  [
                                    {
                                      text: 'Cancel',
                                      style: 'cancel',
                                    },
                                    {
                                      text: 'Delete',
                                      onPress: () => deleteMyPicture(item.id),
                                    },
                                  ],
                                  {cancelable: false}
                                );
                              }}
                            >
                              <Ionicons name="trash" size={30} />
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="heart-outline" size={30} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <Text style={styles.pictureText}>{item.text}</Text>
                      <Image
                        source={{
                          uri: `${UPLOADS_URL}${item.imageFilename}`,
                        }}
                        style={styles.image}
                        resizeMode="contain"
                      ></Image>
                    </View>
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
