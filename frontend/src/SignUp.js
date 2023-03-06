import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });

  const { username, email, password, password2 } = formData;

  const handleChange = text => e => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      console.error("Passwords don't match");
    }
    try {
      const response = await axios.post('http://localhost:7000/signup', { username, email, password });
      window.location.href = '/login';
      console.log(response);
    } catch (err) {
      console.error(err.message);
      alert("Wrong Credential");
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
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
            type='email'
            placeholder='Email'
            value={email}
            onChange={handleChange('email')}
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
        <div>
          <input
            type='password'
            placeholder='Confirm Password'
            value={password2}
            onChange={handleChange('password2')}
          />
        </div>
        <button type='submit'>Submit</button>
      </form>
      <button onClick={() => window.location.href = '/login'}>Login</button>
    </div>
  );
};

export default App;
