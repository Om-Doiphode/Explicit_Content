let imgTags = document.getElementsByTagName('img');

// Loop through each <img> tag and download the image
for (let i = 0; i < imgTags.length; i++) {
    let imgTag = imgTags[i];
    let imgSrc = imgTag.src;

    const checkEndpoint = 'https://explicit-image-backend1.onrender.com/image/check';
    fetch(checkEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imgSrc })
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
            if (data.category === 'explicit' || data.category === 'suggestive') {
                chrome.runtime.sendMessage({ redirect: "index.html" });
            }
        } else {
            const endpoint = `https://hawkeyehs-detectimageexplicit.hf.space/predict?src=${encodeURIComponent(imgSrc)}`;
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
                    const createEndpoint = 'https://explicit-image-backend1.onrender.com/image/create';
                    fetch(createEndpoint, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ url: imgSrc, type: 'image', category: data.class }),
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
                        if (createData.category === 'explicit' || createData.category === 'suggestive') {
                            // Handle explicit or suggestive content
                            chrome.runtime.sendMessage({ redirect: "index.html" });
                        }
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
