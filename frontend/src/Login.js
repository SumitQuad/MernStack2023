import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const { username, password } = formData;

  const handleChange = text => e => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:7000/login', { username, password });
      window.localStorage.setItem("token", response.data.token);
      window.location.href = '/dashboard';
      console.log(response);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type='text'
            placeholder='Username'
            value={username}
            onChange={handleChange('username')}
          />
        </div>
        <div>
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={handleChange('password')}
          />
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default Login;
