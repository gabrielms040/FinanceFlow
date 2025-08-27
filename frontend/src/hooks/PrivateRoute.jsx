import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
    const { user, loading } = useAuth();

    if (loading)
         return <div>Carregando...</div>
    

    return user.accessToken ? <Outlet /> : <Navigate to='/login' />;
}

export default PrivateRoute;