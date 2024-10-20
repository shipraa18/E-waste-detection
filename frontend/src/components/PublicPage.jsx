import React, { useState } from 'react';
import axios from 'axios';

const PublicPage = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState('');

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:5000/api/waste/upload', formData);
      setResult(response.data); // Display the result from the ML model
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <h1>Upload an Image</h1>
      <form onSubmit={handleImageUpload}>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
      {result && <p>Result: {result}</p>}
    </div>
  );
};

export default PublicPage;
