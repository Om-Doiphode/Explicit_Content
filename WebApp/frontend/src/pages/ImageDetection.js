import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Popup from "./Popup";
import LoadingSpinner from "./LoadingSpinner";

const defaultTheme = createTheme();

const ImageDetection = () => {
  const [imageLink, setImageLink] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Make a GET request to the backend with the image URL or website URL
    try {
      setIsLoading(true);
      let endpoint = "";

      if (imageLink) {
        endpoint = `https://hawkeyehs-detectimageexplicit.hf.space/predict?src=${encodeURIComponent(
          imageLink
        )}`;
      } else if (websiteLink) {
        endpoint = `https://hawkeyehs-imageexplicit.hf.space/extractimages?src=${encodeURIComponent(
          websiteLink
        )}`;
      } else {
        console.error("Error: No input provided");
        setIsLoading(false);
        return;
      }

      const response = await fetch(endpoint);

      if (response.ok) {
        const result = await response.json();
        console.log("Analysis Result:", result);
        setAnalysisResult(result);
        setIsLoading(false);
        // You can handle the result here
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }

    // Clear the input fields after submission
    setImageLink("");
    setWebsiteLink("");
  };

  const onImageLinkChange = (e) => {
    setImageLink(e.target.value);
  };

  const onWebsiteLinkChange = (e) => {
    setWebsiteLink(e.target.value);
  };

  return (
    <div
      style={{
        backgroundImage: "url('tp.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
    
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Paper elevation={6} style={{ padding: "2rem", opacity: 0.9 }}>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Explicit Image Detection Tool
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="image_link"
                label="Image Link"
                name="image_link"
                value={imageLink}
                onChange={onImageLinkChange}
                autoFocus
              />
              <Typography
                variant="body2"
                sx={{ mt: 1, mb: 1, display: "block", textAlign: "center" }}
              >
                OR
              </Typography>
              <TextField
                margin="normal"
                fullWidth
                id="website_link"
                label="Website Link"
                name="website_link"
                value={websiteLink}
                onChange={onWebsiteLinkChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </Button>
              {isLoading ? <LoadingSpinner /> : null}
            </Box>
          </Box>
        </Paper>
      </ThemeProvider>
      {analysisResult !== "" ? <Popup result={analysisResult} /> : null}
    </div>
  );
};

export default ImageDetection;
