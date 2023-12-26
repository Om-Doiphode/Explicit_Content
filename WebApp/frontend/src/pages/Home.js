import Navbar from "./Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

      <ButtonBaseDemo />

      {/* Additional components like ImageDetection and FakeNewsDetection go here */}
    </div>
  );
};

export default Home;
