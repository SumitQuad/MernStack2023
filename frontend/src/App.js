import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./SignUp";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Products from "./Products";
import PrivateRoute from "./Component/PrivateRoutes";

function App() {
  const auth = { isAuthenticated: window.localStorage.getItem("token") };

  return (
    <Router>
      <Fragment>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route exact path="/dashboard" element={<PrivateRoute auth={auth} component={Dashboard} />} />
          <Route path="/products" element={<PrivateRoute auth={auth} component={Products} />} />
        </Routes>
      </Fragment>
    </Router>
  );
}

export default App;
