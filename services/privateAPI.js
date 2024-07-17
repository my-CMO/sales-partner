import axios from "axios";

// local-server
const baseURL = 'http://127.0.0.1:8000/';

const uploadRecording = async (formData) => {
  const endPoint = 'upload/';
  const url = baseURL + endPoint;
  
  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('File uploaded successfully:', response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {uploadRecording}