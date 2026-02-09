import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const registerPatient = (patientData) => {
  return API.post('/patients/register-patient', patientData);
};
