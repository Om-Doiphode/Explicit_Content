import Navbar from "./Navbar"
import ImageDetection from "./ImageDetection";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Home = () => {
    const navigate=useNavigate();
    useEffect(() => {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
          // User is authenticated, redirect to home page
          navigate('/login');
        }
      }, []);
      
    return (
        <div> 
            <Navbar/>
            <ImageDetection/>
        </div>
    )
}

export default Home;