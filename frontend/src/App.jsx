import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './hooks/PrivateRoute.jsx';

import LoginPage from './pages/public/Login.jsx';
import Register from './pages/public/Register';
import Dashboard from './pages/private/Dashboard';
import Profile from './pages/private/Profile';
import NewTransaction from './pages/private/NewTransaction.jsx';




function App() {
  return (
    <AuthProvider>
       <BrowserRouter>
          <Routes>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<LoginPage />} />

            <Route element={<PrivateRoute/>}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/newTransaction' element={<NewTransaction />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;