import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  // State to hold form data
  const [data, setData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  // Function to attach input values to state
const valueInput = (e) => setData({ ...data, [e.target.name]: e.target.value });

const addUser = async (e) => {
  e.preventDefault(); // Prevent page refresh 


  await axios.post('http://localhost:3001/register' , data)
    .then(response => {
      setMessage(response.data);
      setData({
        name: '',
        email: '',
        password: ''
      });
      navigate('/');
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
    <h2>Register Page</h2>
      <form onSubmit={addUser}>
        <input type="text" placeholder="Username" name='name' value={data.name} onChange={valueInput} required />
        <input type="email" placeholder="Email" name='email' value={data.email} onChange={valueInput} required />
        <input type="text" placeholder="Password" name='password' value={data.password} onChange={valueInput} required /> 
        <button type="submit">Register</button>
        <p> ja tem uma conta?
        <button onClick={() => navigate('/')}>Login</button>    
       </p>
        {message ? <p>{message}</p> : ""}
      </form>
  </div>
  )
}

export default Register