import { createContext, useContext, useState, useEffect} from "react"; 
import { loginUser } from "../api/usersAPI";
import { setUserData } from "../api/utils";

const AuthContext = createContext(); 

export const AuthProvider = ({children}) => {

    const [loading, setLoading] = useState(true)

    //define the state to use in login functions 
    const [user, setUser] = useState({
      userID: '', 
      userName: '', 
      accessToken: '' 
    })

    //when the page refresh, try to get pasts session storage
    useEffect(() => {
      const userId = localStorage.getItem("userId")
      const userName = localStorage.getItem("userName")
      const accessToken = localStorage.getItem("accessToken")

      if (accessToken) {
        setUser({userID:userId, userName:userName, accessToken:accessToken});
        setUserData(user)
      } 

      setLoading(false)
    }, []);

    //get to call in login page
    const login = async (data) => {
      try {     
          const response = await loginUser(data);
            localStorage.setItem('userId', response.data.id);
            localStorage.setItem('userName', response.data.name);
            localStorage.setItem('accessToken', response.data.token);
            setUser({
              userID: response.data.id,
              userName: response.data.name,
              accessToken: response.data.token
            })
            setUserData(user)
            return{success: true};
      } catch (err) {
          const message = err.response ? err.response.data : 'Erro interno, tente novamente mais tarde !';
          return {success: false, message}
      }
    };

    //clear auth infos to not pass at private routes
    const logout = () => {
    localStorage.clear();
    setUser({ userID:'', userName:'', accessToken:''});
    setUser(user)
    };

    //set the AuthContext elements 
    return (
      <AuthContext.Provider value = {{ user, login, logout, loading}}>
        {children}
      </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
