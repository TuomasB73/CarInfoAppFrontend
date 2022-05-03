import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import {Ionicons} from '@expo/vector-icons';
import {UPLOADS_URL} from '../utils/Variables';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {usePicture, useLike} from '../hooks/ApiHooks';

const PictureListItem = ({navigation, picture, allPictures}) => {
  const {isLoggedIn, user, updatePictures, setUpdatePictures} =
    useContext(MainContext);
  const {deletePicture} = usePicture();
  const [likeCount, setLikeCount] = useState(0);
  const [updateLikes, setUpdateLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const {getLikes, postLike, deleteLike} = useLike();

  const getPictureLikes = async () => {
    try {
      const likes = await getLikes({picture: picture.id});
      if (likes) {
        setLikeCount(likes.length);
        if (likes.filter((e) => e.user.id === user.id).length > 0) {
          setIsLiked(true);
        }
      }
    } catch (e) {
      console.log('getPictureLikes error', e.message);
    }
  };

  const likeDislike = async () => {
    if (isLoggedIn) {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (isLiked) {
          const dislikedPicture = await deleteLike(
            {picture: picture.id},
            userToken
          );
          if (dislikedPicture) {
            setIsLiked(false);
          }
        } else {
          const likedPicture = await postLike({picture: picture.id}, userToken);
          if (likedPicture) {
            setIsLiked(true);
          }
        }
        setUpdateLikes(updateLikes + 1);
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
    getPictureLikes();
  }, [updateLikes]);

  return (
    <View style={styles.pictureContainer}>
      <View style={styles.userContainer}>
        <Text style={styles.usernameText}>{picture.user.nickname}</Text>
        <View style={styles.iconButtonsContainer}>
          {user.id === picture.user.id && (
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
                      onPress: () => deleteMyPicture(picture.id),
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
            <TouchableOpacity style={styles.iconButton} onPress={likeDislike}>
              {isLiked ? (
                <Ionicons name="heart" size={30} />
              ) : (
                <Ionicons name="heart-outline" size={30} />
              )}
            </TouchableOpacity>
            <Text style={styles.likeCountText}>{likeCount}</Text>
          </View>
        </View>
      </View>
      {allPictures && (
        <Text style={styles.carModelText}>
          {picture.car.fullModelName.name}
        </Text>
      )}
      <Text style={styles.pictureText}>{picture.text}</Text>
      <Image
        source={{
          uri: `${UPLOADS_URL}${picture.imageFilename}`,
        }}
        style={styles.image}
        resizeMode="contain"
      ></Image>
    </View>
  );
};

const styles = StyleSheet.create({
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

PictureListItem.propTypes = {
  navigation: PropTypes.object,
  picture: PropTypes.object,
  allPictures: PropTypes.bool,
};

export default PictureListItem;
