import './App.css';
import { Routes, Route} from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageDetection from './pages/ImageDetection';
import FakeNewsDetection from './pages/FakeNewsDetection';

function App() {
  const navigate=useNavigate();
  useEffect(() => {
    const authToken = localStorage.getItem('token');
    const currentPath = window.location.pathname;

    if (authToken && currentPath === '/') {
      // User is authenticated and accessing the home page, redirect to home
      navigate('/');
    }
  }, [navigate]);

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
      <Route
              exact path="/image-detection"
              element={<ImageDetection/>}
      ></Route>
      <Route
              exact path="/fake-news-detection"
              element={<FakeNewsDetection/>}
      ></Route>
      </Routes>
    </div>
  );
}

export default App;
