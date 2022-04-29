import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';

const GRAPHQL_URL = 'https://env-8426215.jelastic.metropolia.fi/graphql';

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

  const getCarModels = async () => {
    const query = {
      query: `
            query Query($brand: ID) {
              getAllCars(brand: $brand) {
                id
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
  }, []);
  return carModelsArray;
};

const useLoadCarModel = (variables) => {
  const [carModel, setCarModel] = useState(null);

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
  }, []);
  return carModel;
};

const useCar = () => {
  const postCar = async (variables, token) => {
    const query = {
      query: `
              mutation Mutation($brand: String!, $model: String!, $year: Int!, $bodyStyles: [String], $numbersOfDoors: [Int], $drivetrains: [String], $variants: [VariantInput], $defaultImageFilename: String) {
                addCar(brand: $brand, model: $model, year: $year, bodyStyles: $bodyStyles, numbersOfDoors: $numbersOfDoors, drivetrains: $drivetrains, variants: $variants, defaultImageFilename: $defaultImageFilename) {
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
      const data = await fetchGraphql(query, token);
      return data.addCar;
    } catch (e) {
      console.log('postCar', e.message);
    }
  };

  return {postCar};
};

export {useUser, useLoadBrands, useLoadCarModels, useLoadCarModel, useCar};
