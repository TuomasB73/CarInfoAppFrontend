import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';

const GRAPHQL_URL = 'https://env-8426215.jelastic.metropolia.fi/graphql';
const POST_IMAGE_URL =
  'https://env-8426215.jelastic.metropolia.fi/image-upload';

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

export {useUser, useLoadBrands, useLoadCarModels, useLoadCarModel, useCar};
