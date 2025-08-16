import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/public/Login';
import Register from './pages/public/Register';



function App() {
  return (
       <BrowserRouter>
          <Routes>
            <Route Component={ Register } path="/register" element={<Register />} />
            <Route Component={ Login } path="/" element={<Login />} />
          </Routes>
        </BrowserRouter>
  );
}

export default App;