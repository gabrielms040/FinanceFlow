import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();  
  // State to hold form data
  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  // Function to attach input values to state
const valueInput = (e) => setData({ ...data, [e.target.name]: e.target.value });

const LoginRequest = async (e) => {
  e.preventDefault(); // Prevent page refresh 


  await axios.post('http://localhost:3001/login' , data)
    .then(response => {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user_id', response.data.id);
      localStorage.setItem('user_name', response.data.name);
      setMessage(response.data.message);
      setData({
        email: '',
        password: ''
      });
    })
    .catch((err) => {
      if(err.response){
      setMessage(err.response.data);
      console.log(err.response.data);
      } else {
        setMessage("Erro: Tente mais tarde!");
      }
    });



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

export default Login