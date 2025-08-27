import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage(){
  const { login } = useAuth(); // get the login function from useAuth
  const navigate = useNavigate();  
  const [data, setData] = useState({ email: '',password: '' });
  const [message, setMessage] = useState('');

  // Function to attach forms input values to state
  const valueInput = (e) => setData({ ...data, [e.target.name]: e.target.value });

  // function to request login 
  const LoginRequest = async (e) => {
    e.preventDefault();

    const result = await login(data)
    result.success ? navigate('/dashboard') : setMessage(result.message);  
  }
  
    
  return (
  <div>
    <h2>Login Page</h2>
      <form onSubmit={LoginRequest}>
        <input type="email" placeholder="Email" name='email' value={data.email} onChange={valueInput} required />
        <input type="text" placeholder="Password" name='password' value={data.password} onChange={valueInput} required /> 
        <button type="submit">Login</button>
        {message ? <p>{message}</p> : ""}
      </form>
       <p> nao tem uma conta?
        <button onClick={() => navigate('/register')}>Register</button>    
       </p>
  </div>
  )
 }

export default LoginPage;
