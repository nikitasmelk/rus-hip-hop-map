// window.onSpotifyIframeApiReady = (IFrameAPI) => {
//     const element = document.getElementById('embed-iframe');
//     const options = {
//         uri: 'https://open.spotify.com/track/0BmBWpZ1obsPKGCT8azVAs?si=968195d8892d44a6'
//       };
//     const callback = (EmbedController) => {};
//     IFrameAPI.createController(element, options, callback);
//   };

// let spotify = document.getElementsByClassName("spotify")[0].src ="https://open.spotify.com/track/1xIDRR91yrYa3LvYWkOxxz?si=10891633c8e84048";
// console.log(spotify);








//   // Function to check if the popup has been closed before
// function isPopupClosed() {
//     return localStorage.getItem('popupClosed') === 'true';
//   }
  
//   // Function to show the popup
//   function showPopup() {
//     const popup = document.getElementById('popup');
//     popup.classList.add('show');
//   }
  
//   // Function to hide the popup and remember the action
//   function closePopup() {
//     const popup = document.getElementById('popup');
//     popup.classList.remove('show');
//     localStorage.setItem('popupClosed', 'true'); // Remember that the popup has been closed
//   }
  
//   // Event listener for the close button
//   document.querySelector('.close-button').addEventListener('click', closePopup);
  
//   // Show the popup on page load if it hasn't been closed before
//   window.addEventListener('load', () => {

//     // FOR TESTING PURPOSES ONLY
//     // localStorage.setItem('popupClosed', 'false');

//     if (!isPopupClosed()) {
//       showPopup();
//     }
//   });
  
  

  




// Initialize the map
var map = L.map('map').setView([55.751244, 37.618423], 5); // Moscow as a central point

var MarkerCluster = new L.MarkerClusterGroup({
    // disableClusteringAtZoom: 17,
    //spiderfyOnMaxZoom: false,
    // maxClusterRadius: 500,
    });
var markers = [];

//var markers = L.markerClusterGroup();

var Marker1 = L.icon({
    iconUrl: 'mrkr1.png',
    iconSize: [48, 48], // size of the icon
    iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
  });

  var Marker2 = L.icon({
    iconUrl: 'mrkr2.png',
    iconSize: [48, 48], // size of the icon
    iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
  });

  
// Set dark theme tile layer for the map

// var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);



// Customize the style of the map to be dark
 var tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
});

tileLayer.addTo(map);


// Add pins to the map with notable releases and events from JSON file
var events;

fetch('events.json')
    .then(response => response.json())
    .then(data => {
        events = data;
        renderMapEvents();
        //updateMapAndTimeline();
    });

function renderMapEvents() {
    events.forEach(function(event) {
        // console.log(event);
        var popupContent = '<b>' + eval(`event.title_${currentLanguage}`) + '</b><br>' +
                           event.date + '<br>' + eval(`event.description_${currentLanguage}`);

        // console.log(popupContent)

        if (event.album_cover) {
            popupContent += '<br><img src="' + event.album_cover + '" alt="Album Cover" class="album-cover">';
        }

        var markerIcon = Marker1;
        if (event.marker){
            markerIcon = eval(event.marker);
        }

        var marker = L.marker(event.coords, { icon: markerIcon }).bindPopup(popupContent);
        
        markers.push(marker);
        MarkerCluster.addLayer(markers[markers.length - 1]);
    });

    // Add the marker Cluster group to the map
    map.addLayer(MarkerCluster);
}

// Load content data from indexContent.json
let contentData = {};

fetch('indexContent.json')
    .then(response => response.json())
    .then(data => {
        contentData = data;
        updatePageContent();
    });

let currentLanguage = 'ru';

// Updated toggleLanguage function to toggle between English and Russian
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'ru' : 'en';
    document.documentElement.lang = currentLanguage;

    // Update button text to reflect the new language
    document.getElementById('languageToggle').textContent = currentLanguage === 'en' ? 'Русский' : 'English';
    console.log('Language toggled to ' + currentLanguage);

    // Update all dynamic content on the page
    updatePageContent();
}

function updatePageContent() {
    // Update map events
    if (events) {
        events.forEach(event => {
            event.currentTitle = currentLanguage === 'en' ? event.title_en : event.title_ru;
            event.currentDescription = currentLanguage === 'en' ? event.description_en : event.description_ru;
        });
    }

    updateMapAndTimeline();

    // Update static content from the JSON file
    if (contentData) {
        for (let key in contentData) {
            const element = document.getElementById(key);
            if (element) {
                element.innerHTML = contentData[key][currentLanguage];
            }
        }
    }
}

function updateMapAndTimeline() {

    if(markers){
        markers.forEach(function (marker, index) {
            // Access the location data associated with the marker

            var event = events[index];

            var popupContent = '<div class="popup-flexbox"><div class="popup-left"> <div class="popup-title">' + eval(`event.title_${currentLanguage}`) + '</div> <div class="popup-date">' +
            event.date + '</div> <div class="popup-desc">' + eval(`event.description_${currentLanguage}`) + '</div> </div>';

            // console.log(popupContent)

            if (event.album_cover) {
            popupContent += ' <div class="popup-right"><img src="' + event.album_cover + '" class="popup-image"></div>';
            }

            popupContent += '</div>';

            if(event.source){
                popupContent += ' <div class="popup-source"> <a  href="' + event.source[1] + '" target="_blank">' + event.source[0] + '</a></div>';
            }

        
            // Update the popup content
            marker.getPopup().setContent(popupContent);
        
            // Refresh the popup if it's open
            if (marker.isPopupOpen()) {
              marker.openPopup();
            }
          });
    }


    // Clear existing markers from the map
    // console.log(Markers);
    // map.removeLayer(Markers);
    // map.removeLayer(Markers);
    // map.eachLayer(function(layer) {
    //     if (layer instanceof L.MarkerClusterGroup) {
    //         map.removeLayer(layer);
    //     }
    // });

    // Add markers to the map
    // events.forEach(function(event) {
    //     var popupContent = '<b>' + (event.currentTitle || event.title_en) + '</b><br>' +
    //                        event.date + '<br>' + (event.currentDescription || event.description_en);



    //     if (event.album_cover) {
    //         popupContent += '<br><img src="' + event.album_cover + '" alt="Album Cover" class="album-cover">';
    //     }

    //     var marker = Marker1;
    //     if (event.marker){
    //         marker = eval(event.marker);
    //     }


    //     //L.marker(event.coords, { icon: marker }).addTo(map).bindPopup(popupContent);
    //     Markers.addLayer(L.marker(event.coords, { icon: marker })).bindPopup(popupContent);
    // });

    // // Add the marker Cluster group to the map
    // map.addLayer(Markers);

    // Update the timeline
    // const timelineElement = document.getElementById('timeline');
    // timelineElement.innerHTML = '<div class="timeline-line"></div>';
    // events.forEach(function(event, index) {
    //     const timelineItem = document.createElement('div');
    //     timelineItem.className = 'timeline-item';
    //     timelineItem.style.top = (20 + index * 100) + 'px';
    //     timelineItem.innerHTML = '<h3>' + event.year + ' - ' + (event.currentTitle || event.title_en) + '</h3>' +
    //                              '<p>' + event.date + '<br>' + (event.currentDescription || event.description_en) + '</p>';
    //     if (event.album_cover) {
    //         timelineItem.innerHTML += '<br><img src="' + event.album_cover + '" alt="Album Cover" class="album-cover">';
    //     }
    //     timelineElement.appendChild(timelineItem);
    // });
}







function showMap() {
    document.getElementById("map").style.display = "block";
    document.getElementById("timeline").style.display = "none";
}

function showTimeline() {
    document.getElementById("map").style.display = "none";
    document.getElementById("timeline").style.display = "block";
}

// Event listener for language toggle button
//document.getElementById('languageToggle').addEventListener('click', toggleLanguage);
