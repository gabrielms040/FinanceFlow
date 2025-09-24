import axios from "axios";

const apiUsers = axios.create({
    baseURL: 'https://localhost:3001',
});

export const loginUser = async(data) => {
    return apiUsers.post('/login', data, {
    withCredentials: true
    });
};

export const registerUser = async(data) => {
    return apiUsers.post('/register', data)
};

export const getAccess = async (data) => {
    return apiUsers.post('/refresh', data, {
    withCredentials: true
    });

};  
