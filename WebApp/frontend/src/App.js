import './App.css';
import { Routes, Route} from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate=useNavigate();
  // Example in App.js or your main component
useEffect(() => {
  const authToken = localStorage.getItem('token');
  if (authToken) {
    // User is authenticated, redirect to home page
    navigate('/');
  }
}, []);

  return (
    <div className="App">
      <Routes>
      <Route
          exact path="/"
              element={<Home/>}
      ></Route>
      <Route
              exact path="/register"
              element={<Register/>}
      ></Route>
      <Route
              exact path="/login"
              element={<Login/>}
      ></Route>
      </Routes>
    </div>
  );
}

export default App;
