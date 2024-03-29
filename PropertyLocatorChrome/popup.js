document.addEventListener('DOMContentLoaded', function () {
    let title = document.title;
    // ToDo fix only for the pop up
    if (title == "PropertyLocator_popup")
        document.getElementById("click-this").addEventListener("click", handler);
    else if (title == "PropertyLocator_Main")
        document.getElementById("webrequest").addEventListener("click", initialize_map);
});

function handler() {
    console.log('openCustomTab');

    chrome.tabs.create({
        url: chrome.runtime.getURL("popup.html"),
        active: true
    });
}

function initialize_map() {
    let url = "https://dubai.dubizzle.com/en/property-for-rent/rooms-for-rent-flatmates/?price__gte=2000&price__lte=3500&page="

    chrome.runtime.sendMessage({ action: 'fetchData', url: url }, (response) => {
        console.log("Data recieved");
        // console.log(response);
        // Process the data received from the background script
        display_coordinates(response)
    });

}

function display_coordinates(html_content) {
    let ads = extractPageJsonDetails(html_content)
    let geos = ads.map((ad, index) => extract_geo(ad, index)).filter(geo => geo !== null)
    console.log(geos)
    let geos_json = JSON.stringify(geos)
    var newURL = `https://httpbin.org/get?geos=${geos_json}`;
    chrome.tabs.create({ url: newURL });
}

function extractPageJsonDetails(pageContent) {
    const pattern = /type="application\/ld\+json">(.*?)<\/script>/gs;
    const matches = pageContent.matchAll(pattern);
    const results = [];
    for (const match of matches) {
        results.push(match[1]);
    }
    return results;
}

function extract_geo(ad_content, index = 0) {
    const jsAd = JSON.parse(ad_content);
    if (!jsAd.geo) {
        console.log("No geo for add index:", index, " ad:", ad_content)
        return null
    }
    if (!jsAd.geo['@type'] || jsAd.geo['@type'] !== 'GeoCoordinates') {
        console.log(`geo @type is not equal to GeoCoordinates index:${index}`, " ad:", ad_content);
        return null
    }
    console.log([index, jsAd.geo.latitude, jsAd.geo.longitude])
    return [index, jsAd.geo.latitude, jsAd.geo.longitude];
}

function setMarkers(geos, map) {
    var image = {
        url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        size: new google.maps.Size(20, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 32)
    };
    var shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
    };
    for (var i = 0; i < geos.length; i++) {
        var beach = geos[i];
        var marker = new google.maps.Marker({
            position: { lat: beach[1], lng: beach[2] },
            map: map,
            icon: image,
            shape: shape,
            title: beach[0],
            zIndex: beach[3],
            ref_index: i
        });
        (function (marker) {
            google.maps.event.addListener(marker, 'click', function () {
                console.log(marker.ref_index);
                window.open(geos[marker.ref_index][4], "_blank");
            });
        })(marker);

    }
} 