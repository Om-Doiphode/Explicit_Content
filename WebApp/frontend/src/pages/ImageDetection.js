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

// Create a default MUI theme
const defaultTheme = createTheme();

const ImageDetection = () => {
  const [imageLink, setImageLink] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // State to manage image link, website link, analysis result, and loading state
  const genResult=(link,checkEndpoint,createEndpoint,endpoint)=>{
    fetch(checkEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: link })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Error in fetching");
        }
    })
    .then(data => {
        if (data && data.category) {
              setAnalysisResult(data);
              setIsLoading(false);
        } else {
            fetch(endpoint)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Error in fetching");
                    }
                })
                .then(data => {
                    console.log(`data_length: ${data.class}`);
                    fetch(createEndpoint, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ url: link, type: 'image', category: data.class }),
                    })
                    .then(createResponse => {
                        if (createResponse.ok) {
                            return createResponse.json();
                        } else {
                            throw new Error("Error in creating entry");
                        }
                    })
                    .then(createData => {
                        console.log(`Entry created in the database. Category: ${createData.category}`);
                            setAnalysisResult(createData);
                            setIsLoading(false);
                    })
                    .catch(error => {
                        console.error(error);
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        }
    });
}
// Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Make a GET request to the backend with the image URL or website URL
    try {
      setIsLoading(true);

      if (imageLink) {
    genResult(imageLink,'https://explicit-image-backend1.onrender.com/image/check','https://explicit-image-backend1.onrender.com/image/create',`https://hawkeyehs-detectimageexplicit.hf.space/predict?src=${encodeURIComponent(imageLink)}`)
      } else if (websiteLink) {
        genResult(websiteLink,'https://explicit-image-backend1.onrender.com/image/check','https://explicit-image-backend1.onrender.com/image/create',`https://hawkeyehs-imageexplicit.hf.space/extractimages?src=${encodeURIComponent(
          websiteLink
        )}`)
      } else {
        console.error("Error: No input provided");
        setIsLoading(false);
        return;
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
