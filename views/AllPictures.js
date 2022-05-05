import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import {useLoadAllPictures} from '../hooks/ApiHooks';
import {Picker} from '@react-native-picker/picker';
import {Ionicons} from '@expo/vector-icons';
import {UPLOADS_URL} from '../utils/Variables';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {usePicture, useLike} from '../hooks/ApiHooks';

const AllPictures = ({navigation}) => {
  const picturesArray = useLoadAllPictures();
  const [picturesArrayWithLikes, setPicturesArrayWithLikes] = useState([]);
  const [picturesArrayToDisplay, setPicturesArrayToDisplay] = useState([]);
  const {
    isLoggedIn,
    user,
    updatePictures,
    setUpdatePictures,
    updatePicsOfAllPicsScreen,
  } = useContext(MainContext);
  const {deletePicture} = usePicture();
  const {getLikes, postLike, deleteLike} = useLike();
  const [sortPickerValue, setSortPickerValue] = useState();

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
      setList(sortPickerValue, picturesWithLikes);
    } catch (e) {
      console.log('getPicturesLikes error', e.message);
    }
  };

  const setList = (sortValue, picturesArray) => {
    if (sortValue === 'Most liked') {
      console.log('most liked', JSON.stringify([...picturesArray]));
      const sortedArray = [...picturesArray].sort(
        (a, b) => b.likeCount - a.likeCount
      );
      setPicturesArrayToDisplay(sortedArray);
    } else {
      console.log('pics arr', JSON.stringify(picturesArray));
      setPicturesArrayToDisplay(picturesArray);
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
            setList(sortPickerValue, picturesArray);
            console.log('likefunc', JSON.stringify(picturesArray));
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
  }, [picturesArray, updatePicsOfAllPicsScreen]);

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.titleText}>User posted pictures</Text>
            <View style={styles.pickerContainer}>
              <Picker
                mode="dropdown"
                selectedValue={sortPickerValue}
                onValueChange={(itemValue, itemIndex) => {
                  setSortPickerValue(itemValue);
                  setList(itemValue, picturesArrayWithLikes);
                }}
              >
                <Picker.Item label={'Newest'} value={'Newest'} />
                <Picker.Item label={'Most liked'} value={'Most liked'} />
              </Picker>
            </View>
            <View style={styles.listContainer}>
              {picturesArray.length > 0 ? (
                <FlatList
                  data={picturesArrayToDisplay}
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
                      <Text style={styles.carModelText}>
                        {item.car.fullModelName.name}
                      </Text>
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
                <Text style={styles.text}>No pictures yet</Text>
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
    margin: 10,
  },
  pickerContainer: {
    backgroundColor: '#d5e3eb',
    width: 160,
    borderRadius: 22,
    alignSelf: 'center',
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
  carModelText: {
    backgroundColor: '#d5e3eb',
    borderRadius: 10,
    marginBottom: 4,
    padding: 4,
    alignSelf: 'flex-start',
  },
  pictureText: {
    fontSize: 20,
    marginBottom: 10,
  },
  image: {
    height: 220,
  },
});

AllPictures.propTypes = {
  navigation: PropTypes.object,
};

export default AllPictures;
