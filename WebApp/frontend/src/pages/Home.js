import Navbar from "./Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import ButtonBaseDemo from "./ButtonBaseDemo";

const Home = () => {
  // Use the useNavigate hook for programmatic navigation
  const navigate = useNavigate();

  // Use the useEffect hook to check if the user is authenticated on component mount
  useEffect(() => {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      // User is not authenticated, redirect to login page
      navigate("/login");
    }
  }, [navigate]); // Dependency array ensures this effect runs only once on component mount

  return (
    <div>
      <Navbar />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <ButtonBaseDemo/>
      </Box>
      {/* Additional components like ImageDetection and FakeNewsDetection go here */}
    </div>
  );
};

export default Home;
