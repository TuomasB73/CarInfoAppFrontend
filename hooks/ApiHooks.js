import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {GRAPHQL_URL, POST_IMAGE_URL} from '../utils/Variables';

const fetchGraphql = async (query, token) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(query),
  };
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }
  try {
    const response = await fetch(GRAPHQL_URL, options);
    const json = await response.json();
    return json.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const useUser = () => {
  const postLogin = async (variables) => {
    const query = {
      query: `
              query Query($username: String!, $password: String!) {
                login(username: $username, password: $password) {
                  id
                  username
                  nickname
                  token
                }
              }`,
      variables,
    };
    try {
      const data = await fetchGraphql(query);
      return data.login;
    } catch (e) {
      console.log('postLogin', e.message);
    }
  };

  const postRegister = async (variables) => {
    const query = {
      query: `
              mutation Mutation($username: String!, $nickname: String!, $password: String!) {
                registerUser(username: $username, nickname: $nickname, password: $password) {
                  id
                  username
                  nickname
                  token
                }
              }`,
      variables,
    };
    try {
      const data = await fetchGraphql(query);
      return data.registerUser;
    } catch (e) {
      console.log('postRegister', e.message);
    }
  };

  const checkToken = async (token) => {
    const query = {
      query: `
              query Query {
                getMyUser {
                  id
                  username
                  nickname
                  token
                }
              }`,
    };
    try {
      const data = await fetchGraphql(query, token);
      return data.getMyUser;
    } catch (e) {
      console.log('checkToken', e.message);
    }
  };

  const checkIsEmailAvailable = async (variables) => {
    const query = {
      query: `
              query Query($username: String!) {
                checkIsUsernameAvailable(username: $username)
              }`,
      variables,
    };
    try {
      const data = await fetchGraphql(query);
      return data.checkIsUsernameAvailable;
    } catch (e) {
      console.log('checkIsEmailAvailable', e.message);
    }
  };

  const checkIsNicknameAvailable = async (variables) => {
    const query = {
      query: `
              query Query($nickname: String!) {
                checkIsNicknameAvailable(nickname: $nickname)
              }`,
      variables,
    };
    try {
      const data = await fetchGraphql(query);
      return data.checkIsNicknameAvailable;
    } catch (e) {
      console.log('checkIsNicknameAvailable', e.message);
    }
  };

  return {
    postLogin,
    postRegister,
    checkToken,
    checkIsEmailAvailable,
    checkIsNicknameAvailable,
  };
};

const useLoadBrands = () => {
  const [brandsArray, setBrandsArray] = useState([]);
  const {updateBrands} = useContext(MainContext);

  const getBrands = async () => {
    const query = {
      query: `
              query Query {
                getAllBrands {
                  id
                  name
                }
              }`,
    };
    try {
      const data = await fetchGraphql(query);
      setBrandsArray(data.getAllBrands);
    } catch (e) {
      console.log('getBrands', e.message);
    }
  };
  useEffect(() => {
    getBrands();
  }, [updateBrands]);
  return brandsArray;
};

const useLoadCarModels = (variables) => {
  const [carModelsArray, setCarModelsArray] = useState([]);
  const {updateCarModels} = useContext(MainContext);

  const getCarModels = async () => {
    const query = {
      query: `
            query Query($brand: ID) {
              getAllCars(brand: $brand) {
                id
                fullModelName {
                  name
                }
                model
                year
              }
            }`,
      variables,
    };
    try {
      const data = await fetchGraphql(query);
      setCarModelsArray(data.getAllCars);
    } catch (e) {
      console.log('getCarModels', e.message);
    }
  };
  useEffect(() => {
    getCarModels();
  }, [updateCarModels]);
  return carModelsArray;
};

const useLoadCarModel = (variables) => {
  const [carModel, setCarModel] = useState(null);
  const {updateCarModel} = useContext(MainContext);

  const getCarModel = async () => {
    const query = {
      query: `
              query Query($getCarByIdId: ID!) {
                getCarById(id: $getCarByIdId) {
                  id
                  fullModelName {
                    id
                    name
                  }
                  brand {
                    id
                    name
                  }
                  model
                  year
                  bodyStyles
                  numbersOfDoors
                  drivetrains
                  variants {
                    id
                    fuelType
                    engineDisplacement
                    transmission
                    powerHp
                    acceleration0_100KmhS
                    fuelConsumptionL100Km
                    co2EmissionsGkm
                  }
                  defaultImageFilename
                }
              }`,
      variables,
    };
    try {
      const data = await fetchGraphql(query);
      setCarModel(data.getCarById);
    } catch (e) {
      console.log('getCarModel', e.message);
    }
  };
  useEffect(() => {
    getCarModel();
  }, [updateCarModel]);
  return carModel;
};

const useLoadReviews = (variables) => {
  const [reviewsArray, setReviewsArray] = useState([]);
  const {updateReviews} = useContext(MainContext);

  const getReviews = async () => {
    const query = {
      query: `
              query Query($car: ID!) {
                getAllReviewsByCarId(car: $car) {
                  id
                  user {
                    id
                    nickname
                  }
                  text
                }
              }`,
      variables,
    };
    try {
      const data = await fetchGraphql(query);
      setReviewsArray(data.getAllReviewsByCarId);
    } catch (e) {
      console.log('getReviews', e.message);
    }
  };
  useEffect(() => {
    getReviews();
  }, [updateReviews]);
  return reviewsArray;
};

const useLoadCarModelPictures = (variables) => {
  const [picturesArray, setPicturesArray] = useState([]);
  const {updatePictures} = useContext(MainContext);

  const getPictures = async () => {
    const query = {
      query: `
              query Query($car: ID!) {
                getAllPicturesByCarId(car: $car) {
                  id
                  user {
                    id
                    nickname
                  }
                  imageFilename
                  text
                }
              }`,
      variables,
    };
    try {
      const data = await fetchGraphql(query);
      setPicturesArray(data.getAllPicturesByCarId);
    } catch (e) {
      console.log('getPictures', e.message);
    }
  };
  useEffect(() => {
    getPictures();
  }, [updatePictures]);
  return picturesArray;
};

const useLoadAllPictures = () => {
  const [picturesArray, setPicturesArray] = useState([]);
  const {updatePictures, picturesLoaded, setPicturesLoaded} =
    useContext(MainContext);

  const getPictures = async () => {
    const query = {
      query: `
              query Query {
                getAllPictures {
                  id
                  car {
                    fullModelName {
                      name
                    }
                  }
                  user {
                      id
                      nickname
                    }
                    imageFilename
                    text
                  }
                }`,
    };
    try {
      const data = await fetchGraphql(query);
      setPicturesArray(data.getAllPictures);
      setPicturesLoaded(picturesLoaded + 1);
    } catch (e) {
      console.log('getPictures', e.message);
    }
  };
  useEffect(() => {
    getPictures();
  }, [updatePictures]);
  return picturesArray;
};

const useCar = () => {
  const postCar = async (variables, token) => {
    const query = {
      query: `
              mutation Mutation($brand: String!, $model: String!, $year: Int!, $bodyStyles: [String], $numbersOfDoors: [Int], $drivetrains: [String], $variants: [VariantInput], $defaultImageFilename: String) {
                addCar(brand: $brand, model: $model, year: $year, bodyStyles: $bodyStyles, numbersOfDoors: $numbersOfDoors, drivetrains: $drivetrains, variants: $variants, defaultImageFilename: $defaultImageFilename) {
                  id
                }
              }`,
      variables,
    };
    try {
      const data = await fetchGraphql(query, token);
      return data.addCar;
    } catch (e) {
      console.log('postCar', e.message);
    }
  };

  const modifyCar = async (variables, token) => {
    const query = {
      query: `
              mutation Mutation($modifyCarId: ID, $brand: String, $model: String, $year: Int, $bodyStyles: [String], $numbersOfDoors: [Int], $drivetrains: [String], $variants: [VariantInput], $defaultImageFilename: String) {
                modifyCar(id: $modifyCarId, brand: $brand, model: $model, year: $year, bodyStyles: $bodyStyles, numbersOfDoors: $numbersOfDoors, drivetrains: $drivetrains, variants: $variants, defaultImageFilename: $defaultImageFilename) {
                  id
                }
              }`,
      variables,
    };
    try {
      const data = await fetchGraphql(query, token);
      return data.modifyCar;
    } catch (e) {
      console.log('modifyCar', e.message);
    }
  };

  const postCarImage = async (image, fileType, token) => {
    let uploadedFilename;
    const axios = require('axios').default;
    const filename = image.split('/').pop();

    // Infer the type of the image/video
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `${fileType}/${match[1]}` : fileType;
    if (type === 'image/jpg') type = 'image/jpeg';

    const formData = new FormData();
    formData.append('image', {uri: image, name: filename, type});

    const options = {
      url: POST_IMAGE_URL,
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      data: formData,
    };

    try {
      await axios(options).then(async (res) => {
        if (res.status == 200) {
          console.log('Upload successful: ', res.status, res.message);
          uploadedFilename = res.data;
        } else {
          console.log('Upload error: ', res.status, res.message);
        }
      });
    } catch (e) {
      console.log('postCarImage', e.message);
    }
    return uploadedFilename;
  };

  return {postCar, modifyCar, postCarImage};
};

const useReview = () => {
  const postReview = async (variables, token) => {
    const query = {
      query: `
              mutation Mutation($car: ID!, $text: String!) {
                addReview(car: $car, text: $text) {
                  id
                }
              }`,
      variables,
    };
    try {
      const data = await fetchGraphql(query, token);
      return data.addReview;
    } catch (e) {
      console.log('postReview', e.message);
    }
  };

  const deleteReview = async (variables, token) => {
    const query = {
      query: `
              mutation Mutation($deleteMyReviewId: ID!) {
                deleteMyReview(id: $deleteMyReviewId) {
                  id
                }
              }`,
      variables,
    };
    try {
      const data = await fetchGraphql(query, token);
      return data.deleteMyReview;
    } catch (e) {
      console.log('deleteReview', e.message);
    }
  };

  return {postReview, deleteReview};
};

const usePicture = () => {
  const postPicture = async (variables, token) => {
    const query = {
      query: `
              mutation Mutation($car: ID!, $imageFilename: String!, $text: String) {
                addPicture(car: $car, imageFilename: $imageFilename, text: $text) {
                  id
                }
              }`,
      variables,
    };
    try {
      const data = await fetchGraphql(query, token);
      return data.addPicture;
    } catch (e) {
      console.log('postPicture', e.message);
    }
  };

  const deletePicture = async (variables, token) => {
    const query = {
      query: `
              mutation Mutation($deleteMyPictureId: ID!) {
                deleteMyPicture(id: $deleteMyPictureId) {
                  id
                }
              }`,
      variables,
    };
    try {
      const data = await fetchGraphql(query, token);
      return data.deleteMyPicture;
    } catch (e) {
      console.log('deletePicture', e.message);
    }
  };

  return {postPicture, deletePicture};
};

const useLike = () => {
  const getLikes = async (variables) => {
    const query = {
      query: `
              query Query($picture: ID!) {
                getAllLikesByPictureId(picture: $picture) {
                  id
                  user {
                    id
                  }
                }
              }`,
      variables,
    };
    try {
      const data = await fetchGraphql(query);
      return data.getAllLikesByPictureId;
    } catch (e) {
      console.log('getLikes', e.message);
    }
  };

  const postLike = async (variables, token) => {
    const query = {
      query: `
              mutation Mutation($picture: ID!) {
                addLike(picture: $picture) {
                  id
                }
              }`,
      variables,
    };
    try {
      const data = await fetchGraphql(query, token);
      return data.addLike;
    } catch (e) {
      console.log('postLike', e.message);
    }
  };

  const deleteLike = async (variables, token) => {
    const query = {
      query: `
              mutation Mutation($picture: ID!) {
                deleteMyLike(picture: $picture) {
                  id
                }
              }`,
      variables,
    };
    try {
      const data = await fetchGraphql(query, token);
      return data.deleteMyLike;
    } catch (e) {
      console.log('deleteLike', e.message);
    }
  };

  return {getLikes, postLike, deleteLike};
};

export {
  useUser,
  useLoadBrands,
  useLoadCarModels,
  useLoadCarModel,
  useLoadReviews,
  useLoadCarModelPictures,
  useLoadAllPictures,
  useCar,
  useReview,
  usePicture,
  useLike,
};
