import {useState} from 'react';

const useAddReviewForm = (callback) => {
  const [addReviewInputs, setAddReviewInputs] = useState({
    text: '',
  });

  const handleAddReviewInputChange = (name, text) => {
    setAddReviewInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
  };
  return {
    handleAddReviewInputChange,
    addReviewInputs,
  };
};

export default useAddReviewForm;
