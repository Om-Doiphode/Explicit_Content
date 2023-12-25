import React, {useState} from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Popup from './Popup';
import LoadingSpinner from './LoadingSpinner';

// Create a default MUI theme
const defaultTheme = createTheme();



const ImageDetection=()=>{
  // State to manage image link, website link, analysis result, and loading state
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
    genResult(imageLink,'http://127.0.0.1:3001/image/check','http://127.0.0.1:3001/image/create',`https://hawkeyehs-detectimageexplicit.hf.space/predict?src=${encodeURIComponent(imageLink)}`)
      } else if (websiteLink) {
        genResult(websiteLink,'http://127.0.0.1:3001/image/check','http://127.0.0.1:3001/image/create',`https://hawkeyehs-imageexplicit.hf.space/extractimages?src=${encodeURIComponent(
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
    }

    // Function to handle image link input change
    const onImageLinkChange = (e) => {
      setImageLink(e.target.value);
    };
  
    // Function to handle website link input change
    const onWebsiteLinkChange = (e) => {
      setWebsiteLink(e.target.value);
    };

    // Render the component
    return (
        <>
        <ThemeProvider theme={defaultTheme}>
          <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid
              item
              xs={false}
              sm={4}
              md={7}
              sx={{
                backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                backgroundRepeat: 'no-repeat',
                backgroundColor: (t) =>
                  t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Explicit Image Detection Tool
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                  <Typography variant="body2" sx={{ mt: 1, mb: 1, display: 'block', textAlign: 'center' }}>
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
            </Grid>
          </Grid>
        </ThemeProvider>
        {analysisResult!==''?<Popup result={analysisResult}/>:null}
        </>
      );
}

export default ImageDetection;