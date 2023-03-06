import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard({ auth }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const name = window.localStorage.getItem('name');

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }
  }, [auth]);

  useEffect(() => {
    axios.get('http://localhost:7000/fetchproducts').then((res) => {
      setProducts(res.data);
      setFilteredProducts(res.data);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handlePriceFilterChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setPriceRange({ ...priceRange, [name]: value });
  };

  useEffect(() => {
    const filtered = products.filter(
      (product) => product.price >= priceRange.min && product.price <= priceRange.max
    );
    setFilteredProducts(filtered);
  }, [priceRange, products]);

  return (
    <>
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        <p>Welcome, {name}!</p>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={() => (window.location.href = './products')}>Go To Product</button>
        <div>
          <label>Price range:</label><br/>
          <input
            type="number"
            name="min"
            placeholder="Min"
            value={priceRange.min}
            onChange={handlePriceFilterChange}
          />
          <input
            type="number"
            name="max"
            placeholder="Max"
            value={priceRange.max}
            onChange={handlePriceFilterChange}
          />
        </div>
        <ul>
          {filteredProducts.map((product) => (
            <li key={product.id} className="product-item">
              <p>Name: {product.name}</p>
              <p>Price: {product.price}</p>
              <p>Description: {product.description}</p>
              <p>Created At: {new Date(product.createdAt).toLocaleString()}</p>
              <img src={product.image} alt={product.image} />
              <button>Add To Cart</button>
              <button>Buy Now</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Dashboard;
