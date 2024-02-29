document.addEventListener('DOMContentLoaded', function () {
    let title = document.title;
    // ToDo fix only for the pop up
    if (title == "PropertyLocator_popup")
        document.getElementById("click-this").addEventListener("click", handler);
    else if (title == "PropertyLocator_Main")
        document.getElementById("webrequest").addEventListener("click", webrequest);
});

function handler() {
    console.log('openCustomTab');

    chrome.tabs.create({
        url: chrome.runtime.getURL("popup.html"),
        active: true
    });
}

function webrequest() {
    console.log('popup.webrequest');
    let url = "https://dubai.dubizzle.com/en/property-for-rent/rooms-for-rent-flatmates/"
    
    chrome.runtime.sendMessage({ action: 'fetchData', url: url }, (response) => {
        console.log('popup.webrequest Data received:', response);
        // Process the data received from the background script
    });
    
}