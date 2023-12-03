chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const censored = {};
  for(const item of request.data) {
    console.log(`item: ${item}`);
    const endpoint = `http://127.0.0.1:5000/predict?src=${item}`;
    fetch(endpoint)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error in fetching");
        }
      })
      .then(data => {
        console.log(`data_length: ${data.class}`)
        if(data.class === 'explicit' || data.class === 'suggestive'){
          censored[item] = data.class;
        }
      })
      .catch(error => {
        console.log(error);
      })
    }
    setTimeout(function() {
      sendResponse({ type: 'response', data: censored });
    }, 1000);
  return true;
});