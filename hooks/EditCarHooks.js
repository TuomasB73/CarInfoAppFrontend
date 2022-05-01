import {useState} from 'react';

const useEditCarForm = (callback) => {
  const [editCarInputs, setEditCarInputs] = useState({
    brand: '',
    model: '',
    year: '',
  });

  const handleEditCarInputChange = (name, text) => {
    setEditCarInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
  };
  return {
    handleEditCarInputChange,
    editCarInputs,
  };
};

export default useEditCarForm;
