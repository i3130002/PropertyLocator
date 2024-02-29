// Function to fetch data from another site

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchData') {
    console.log("Background.addListener", "fetchData", message, sender)
    fetch(message.url, {
      method: 'GET'
    }).then(res => {
      console.log("bg.fetch.res:", res)
      return res.text();
    }).then(res => {
      sendResponse(res);
    }).catch((err) => {
      console.log("Error:", err)
    })
    return true; // Inform Chrome that we will make a delayed sendResponse
  }

});
