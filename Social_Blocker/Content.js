let imgTags = document.getElementsByTagName('img');

// Loop through each <img> tag and download the image
for (var i = 0; i < imgTags.length; i++) {
    var imgTag = imgTags[i];
    var imgSrc = imgTag.src;

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
            if (data.class === 'explicit' || data.class === 'suggestive') {
                // window.location.href = "https://www.google.com";
                chrome.runtime.sendMessage({redirect: "index.html"});
            }
        })
        .catch(error => {
            console.error(error);
        });
}
