let url = "https://dubai.dubizzle.com/en/property-for-rent/rooms-for-rent-flatmates/"
console.log("content.sendMessage[before]")
chrome.runtime.sendMessage({ action: 'fetchData', url: url }, (response) => {
    console.log('content.sendMessage Data received:', response);
    // Process the data received from the background script
});