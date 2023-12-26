import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Popup from "./Popup";
import LoadingSpinner from "./LoadingSpinner";

const defaultTheme = createTheme();

const FakeNewsDetection = () => {
  const [text, setText] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Make a GET request to the backend with the image URL
    try {
      setIsLoading(true);
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST", // Use the POST method for sending data
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify({ sample: text }), // Convert the text to JSON and send it in the request body
      });

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
    setText("");
  };

  const onChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div
      style={{
        backgroundImage: "url('tp2.jpg  ')",
        backgroundRepeat: "no-repeat",
        backgroundColor: (t) =>
          t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
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
              Fake News Detection Tool
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
                id="text_box"
                label="News"
                name="News"
                value={text}
                onChange={onChange}
                autoFocus
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

export default FakeNewsDetection;
