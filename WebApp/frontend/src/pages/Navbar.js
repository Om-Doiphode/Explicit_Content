import React from 'react'
import { Link, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
  
// Navbar component definition
const Navbar = () => {

    // Get the current location using useLocation hook
    let location = useLocation();

    // Retrieve the authentication token from local storage
    const authToken = localStorage.getItem('token');

    // Get the navigate function from useNavigate hook
    const navigate=useNavigate();
    const handleLogout = () => {
        // Clear the token from local storage
        localStorage.removeItem('token');
        
        // Redirect to the login page
        navigate('/login');
      };

    // Render the navbar
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Explicit Content and Fake News Detection</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname==="/"? "active": ""}`} aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname==="/about"? "active": ""}`} to="/about">About</Link>
                        </li>

                    </ul>
                    <form className="d-flex"> 
                    {authToken?<button className="btn btn-primary mx-1" onClick={handleLogout}>LogOut</button>:(
                        <>
                        <Link className="btn btn-primary mx-1" to="/login" role="button">Login</Link>
                        <Link className="btn btn-primary mx-1" to="/register" role="button">Signup</Link>
                        </>
                    )
                    }
                    </form>
                </div>
            </div>
        </nav>
    )
}

export default Navbar