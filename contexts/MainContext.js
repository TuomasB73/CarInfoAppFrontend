import React, {useState} from 'react';
import PropTypes from 'prop-types';

const MainContext = React.createContext({});

const MainProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isUsingAnonymously, setIsUsingAnonymously] = useState(false);
  const [user, setUser] = useState({});

  return (
    <MainContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isUsingAnonymously,
        setIsUsingAnonymously,
        user,
        setUser,
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
