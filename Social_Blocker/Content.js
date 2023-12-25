// Get all <img> tags in the document
let imgTags = document.getElementsByTagName('img');

// Loop through each <img> tag and download the image
for (let i = 0; i < imgTags.length; i++) {
    let imgTag = imgTags[i];
    let imgSrc = imgTag.src;

    // Endpoint for checking image category locally
    const checkEndpoint = 'http://127.0.0.1:3001/image/check';

    // Check the image category using the local endpoint
    fetch(checkEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imgSrc })
    })
    .then(response => {
        // Check if the fetch was successful
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Error in fetching");
        }
    })
    .then(data => {
        if (data && data.category) {
            // If the image is explicit or suggestive, redirect to index.html
            if (data.category === 'explicit' || data.category === 'suggestive') {
                chrome.runtime.sendMessage({ redirect: "index.html" });
            }
        } else {
             // If local check did not provide category information, use external API
            const endpoint = `https://hawkeyehs-detectimageexplicit.hf.space/predict?src=${encodeURIComponent(imgSrc)}`;
            fetch(endpoint)
                .then(response => {
                    if (response.ok) {
                        // Check if the fetch was successful
                        return response.json();
                    } else {
                        throw new Error("Error in fetching");
                    }
                })
                .then(data => {
                     // Log the predicted category from the external API
                    console.log(`data_length: ${data.class}`);
                    // Endpoint for creating an entry in the local database
                    const createEndpoint = 'http://localhost:3001/image/create';
                    // Create an entry in the local database with image information
                    fetch(createEndpoint, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ url: imgSrc, type: 'image', category: data.class }),
                    })
                    .then(createResponse => {
                        // Check if the creation of the entry was successful
                        if (createResponse.ok) {
                            return createResponse.json();
                        } else {
                            throw new Error("Error in creating entry");
                        }
                    })
                    .then(createData => {
                        // Log the created entry information
                        console.log(`Entry created in the database. Category: ${createData.category}`);
                        if (createData.category === 'explicit' || createData.category === 'suggestive') {
                            // Handle explicit or suggestive content
                            chrome.runtime.sendMessage({ redirect: "index.html" });
                        }
                    })
                    .catch(error => {
                        // Handle errors in creating the entry
                        console.error(error);
                    });
                })
                .catch(error => {
                    // Handle errors in fetching data from the external API
                    console.error(error);
                });
        }
    });
}
