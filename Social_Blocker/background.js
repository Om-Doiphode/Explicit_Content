// Listen for messages from the extension or content scripts
chrome.runtime.onMessage.addListener(
    // Callback function triggered when a message is received
    function(request, sender, sendResponse) {

        // Check if the message contains a 'redirect' property
        if(request.redirect) {

            // If 'redirect' property is present, update the current tab's URL
            chrome.tabs.update(sender.tab.id, {url: chrome.runtime.getURL(request.redirect)});
        }
    }
);
