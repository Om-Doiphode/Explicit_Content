import Navbar from "./Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import ButtonBaseDemo from "./ButtonBaseDemo";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      // User is not authenticated, redirect to login page
      navigate("/login");
    }
  }, [navigate]);

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
