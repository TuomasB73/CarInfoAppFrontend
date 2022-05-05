import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import {useLoadCarModelPictures} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Ionicons} from '@expo/vector-icons';
import {UPLOADS_URL} from '../utils/Variables';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {usePicture, useLike} from '../hooks/ApiHooks';

const CarModelPictures = ({navigation, route}) => {
  const {carId, carModelName} = route.params;
  const picturesArray = useLoadCarModelPictures({car: carId});
  const {
    isLoggedIn,
    user,
    updatePictures,
    setUpdatePictures,
    updatePicsOfAllPicsView,
    setUpdatePicsOfAllPicsView,
  } = useContext(MainContext);
  const [picturesArrayWithLikes, setPicturesArrayWithLikes] = useState([]);
  const {deletePicture} = usePicture();
  const {getLikes, postLike, deleteLike} = useLike();

  // Fetch all pictures' likes and add them to the array.
  const getPicturesLikes = async () => {
    try {
      const picturesWithLikes = picturesArray.reverse();
      await Promise.all(
        picturesWithLikes.map(async (picture) => {
          const likes = await getLikes({picture: picture.id});
          if (likes) {
            picture.likeCount = likes.length;
            if (likes.filter((e) => e.user.id === user.id).length > 0) {
              picture.isLiked = true;
            }
          }
        })
      );
      setPicturesArrayWithLikes(picturesWithLikes);
    } catch (e) {
      console.log('getPicturesLikes error', e.message);
    }
  };

  const likeDislike = async (pictureId) => {
    if (isLoggedIn) {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        let postedLikeDislike;
        const arrayIndex = picturesArrayWithLikes.findIndex(
          (picture) => picture.id === pictureId
        );
        if (picturesArrayWithLikes[arrayIndex].isLiked) {
          postedLikeDislike = await deleteLike({picture: pictureId}, userToken);
        } else {
          postedLikeDislike = await postLike({picture: pictureId}, userToken);
        }
        if (postedLikeDislike) {
          const updatedLikes = await getLikes({picture: pictureId});
          if (updatedLikes) {
            const picturesArray = [...picturesArrayWithLikes];
            picturesArray[arrayIndex].likeCount = updatedLikes.length;
            if (updatedLikes.filter((e) => e.user.id === user.id).length > 0) {
              picturesArray[arrayIndex].isLiked = true;
            } else {
              picturesArray[arrayIndex].isLiked = false;
            }
            setPicturesArrayWithLikes(picturesArray);
            setUpdatePicsOfAllPicsView(updatePicsOfAllPicsView + 1);
          }
        }
      } catch (e) {
        console.log('likeDislike error', e.message);
      }
    } else {
      Alert.alert('You must login/register to like a picture');
    }
  };

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
      console.log('deleteMyPicture error', e.message);
    }
  };

  useEffect(() => {
    getPicturesLikes();
  }, [picturesArray]);

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
                  data={picturesArrayWithLikes}
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
                                      onPress: () => {
                                        deleteMyPicture(item.id);
                                      },
                                    },
                                  ],
                                  {cancelable: false}
                                );
                              }}
                            >
                              <Ionicons name="trash" size={30} />
                            </TouchableOpacity>
                          )}
                          <View style={styles.likesContainer}>
                            <TouchableOpacity
                              style={styles.iconButton}
                              onPress={() => likeDislike(item.id)}
                            >
                              {item.isLiked ? (
                                <Ionicons name="heart" size={30} />
                              ) : (
                                <Ionicons name="heart-outline" size={30} />
                              )}
                            </TouchableOpacity>
                            <Text style={styles.likeCountText}>
                              {item.likeCount}
                            </Text>
                          </View>
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
  text: {
    fontSize: 26,
    textAlign: 'center',
    margin: 12,
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
  likesContainer: {
    flexDirection: 'row',
    backgroundColor: '#d5e3eb',
    borderRadius: 10,
  },
  iconButton: {
    margin: 4,
  },
  likeCountText: {
    fontSize: 20,
    margin: 4,
  },
  pictureText: {
    fontSize: 20,
    marginBottom: 10,
  },
  image: {
    height: 220,
  },
});

CarModelPictures.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default CarModelPictures;
