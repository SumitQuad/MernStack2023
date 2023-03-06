import React from "react";
import { Route, Redirect, Navigate } from "react-router-dom";
import Dashboard from "../Dashboard";

// function PrivateRoute({ component: Component, ...rest })  {
//   return (
//     <Route
//       {...rest}
//       render={props =>
//         localStorage.getItem("token") ? (
//           <Component {...props} />
//         ) : (
//           <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
//         )
//       }
//     />
//   );
// };

// export default PrivateRoute;

const PrivateRoute = ({ auth, component: Component }) => {
  const token = window.localStorage.getItem("token");
  return token ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;