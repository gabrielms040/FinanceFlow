import axios from "axios";
import { getAccess } from "./usersAPI";
import { getUserData, newUserToken } from "./utils";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate()
let passedBy = false

const apiTransactions = axios.create({
    baseURL: 'https://localhost:3001/transactions',
})

apiTransactions.interceptors.request.use(
    (config) => {
    const accessToken = localStorage.getItem("accessToken")
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

apiTransactions.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if(error.response.status == 401 || passedBy == false)
            try {
                const response = await getAccess(getUserData)
                token = response.data.token
                newUserToken(token)
                passedBy = true
            } catch (err) {
            const message = err.response ? err.response.data : 'Sessão expirada';
                navigate('/login')
            }
    }

)

