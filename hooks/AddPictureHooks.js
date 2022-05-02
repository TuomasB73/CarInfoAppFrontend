import {useState} from 'react';

const useAddPictureForm = (callback) => {
  const [addPictureInputs, setAddPictureInputs] = useState({
    text: '',
  });

  const handleAddPictureInputChange = (name, text) => {
    setAddPictureInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
  };
  return {
    handleAddPictureInputChange,
    addPictureInputs,
  };
};

export default useAddPictureForm;
