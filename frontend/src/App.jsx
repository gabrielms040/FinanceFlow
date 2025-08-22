import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/public/Login.jsx';
import Register from './pages/public/Register';
import Dashboard from './pages/private/Dashboard';
import Profile from './pages/private/Profile';
import NewTransaction from './pages/private/NewTransaction.jsx';




function App() {
  return (
       <BrowserRouter>
          <Routes>

            <Route >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/NewTransaction" element={<NewTransaction />} />
            </Route>

            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </BrowserRouter>
  );
}

export default App;