import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/public/Login.jsx';
import Register from './pages/public/Register';
import Dashboard from './pages/private/Dashboard';
import Profile from './pages/private/Profile';
import NewTransactions from './pages/private/NewTransactions.jsx';




function App() {
  return (
       <BrowserRouter>
          <Routes>

            <Route >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/NewTransactions" element={<NewTransactions />} />
            </Route>

            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </BrowserRouter>
  );
}

export default App;