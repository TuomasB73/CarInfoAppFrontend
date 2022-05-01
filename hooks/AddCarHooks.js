import {useState} from 'react';

const useAddCarForm = (callback) => {
  const [addCarInputs, setAddCarInputs] = useState({
    brand: '',
    model: '',
    year: '',
  });

  const handleAddCarInputChange = (name, text) => {
    setAddCarInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
  };
  return {
    handleAddCarInputChange,
    addCarInputs,
  };
};

export default useAddCarForm;
