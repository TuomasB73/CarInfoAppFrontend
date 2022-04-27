import {useState} from 'react';

const useLoginForm = (callback) => {
  const [loginInputs, setLoginInputs] = useState({
    email: '',
    password: '',
  });

  const handleLoginInputChange = (name, text) => {
    setLoginInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
  };
  return {
    handleLoginInputChange,
    loginInputs,
  };
};

export default useLoginForm;
