// import React from 'react'
// import {
//     BrowserRouter as Router,
//     Switch,
//     Redirect,
//     Route
// } from "react-router-dom";


// const checkAuthToken = () => {
//     const token = localStorage.getItem('token');
//     return token ? true : false
// }
// const PrivateRoute = ({ component: Component, ...rest }) => {
//     console.log("working");
//     return (
        
//             <Route
//                 {...rest}
//                 render={props =>
//                     checkAuthToken() ? (
//                         <Component {...props} />
//                     ) : (
//                         <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
//                     )
//                 }
//             />
//     )
// }

// export default PrivateRoute
