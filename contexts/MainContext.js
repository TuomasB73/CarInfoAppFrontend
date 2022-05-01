import React, {useState} from 'react';
import PropTypes from 'prop-types';

const MainContext = React.createContext({});

const MainProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUsingAnonymously, setIsUsingAnonymously] = useState(false);
  const [user, setUser] = useState({});
  const [updateBrands, setUpdateBrands] = useState(0);
  const [updateCarModels, setUpdateCarModels] = useState(0);
  const [updateCarModel, setUpdateCarModel] = useState(0);

  return (
    <MainContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isUsingAnonymously,
        setIsUsingAnonymously,
        user,
        setUser,
        updateBrands,
        setUpdateBrands,
        updateCarModels,
        setUpdateCarModels,
        updateCarModel,
        setUpdateCarModel,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node,
};

export {MainContext, MainProvider};
