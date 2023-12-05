import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Dataroom from './DataRoom';

function App() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const navigate = useNavigate();
  // const location = useLocation();

  // const handleLoginClick = (e) => {
  //   e.preventDefault();
  //   window.location.href = 'http://localhost:3001/auth/google';
  // };

  // useEffect(() => {
  //   // Check if the URL contains an authorization code
  //   const params = new URLSearchParams(location.search);
  //   const code = params.get('code');

  //   if (code) {
  //     // Make a POST request to exchange the code for an access token
  //     // Example:
  //     // axios.post('/exchange-code', { code })
  //     //   .then(response => {
  //     //     const authToken = response.data.authToken;
  //     //     localStorage.setItem('authToken', authToken);
  //     //     setIsAuthenticated(true);
  //     //     navigate('/dataroom');
  //     //   })
  //     //   .catch(error => {
  //     //     console.error('Error exchanging code:', error);
  //     //   });

  //     // For this example, we'll assume authentication is successful
  //     localStorage.setItem('authToken', 'your-auth-token');
  //     setIsAuthenticated(true);
  //     navigate('/dataroom');
  //   } else {
  //     const storedToken = localStorage.getItem('authToken');
  //     setIsAuthenticated(!!storedToken);
  //   }
  // }, [location, navigate]);

  // if (!isAuthenticated) {
  //   return (
  //     <div className="login-container">
  //       <h1>Welcome to the Data Room</h1>
  //       <p>Please log in to continue.</p>
  //       <button onClick={handleLoginClick}>Login with Google</button>
  //     </div>
  //   );
  // }

  return (
    <div className="data-room-container">
      <Dataroom/>
      {/* {isAuthenticated ? (
        <Routes>
          <Route path="/dataroom" element={<Dataroom />} />
          {/* Define other routes here */}
        {/* </Routes> */}
      {/* ) : ( */}
        {/* <p>Please log in to access the Data Room.</p> */}
      {/* )} */} 
    </div>
  );
}

export default App;
