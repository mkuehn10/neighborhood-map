var initialLocations = [
        {
            streetAddress: 'Cinderella Castle',
            city: 'Walt Disney World',
            state: 'FL',
            latlng: [28.4194019,-81.5814004]
        },
        {
            streetAddress: 'Space Mountain',
            city: 'Walt Disney World',
            state: 'FL',
            latlng: [28.418896, -81.578173]
        },
        {
            streetAddress: 'Big Thunder Mountain Railroad',
            city: 'Walt Disney World',
            state: 'FL',
            latlng: [28.419973, -81.5851865]
        },
        {
            streetAddress: 'Splash Mountain',
            city: 'Walt Disney World',
            state: 'FL',
            latlng: [28.4190814, -81.5850448]
        },
        {
            streetAddress: 'Jungle Cruise',
            city: 'Walt Disney World',
            state: 'FL',
            latlng: [28.417988, -81.583436]
        }
    ];

var Location = function(data) {
    this.streetAddress = ko.observable(data.streetAddress);
    this.city = ko.observable(data.city);
    this.state = ko.observable(data.state);
    this.latlng = ko.observable(data.latlng);

    this.cityState = ko.computed(function () {
        return this.city() + ", " + this.state();
    }, this);

    this.completeAddress = ko.computed(function () {
        return this.streetAddress() + ", " + this.cityState();
    }, this);
};

var ViewModel = function () {
    var self = this;

    this.locationList = ko.observableArray([]);

    initialLocations.forEach(function(locationItem) {
        self.locationList().push(new Location(locationItem));
    })

    this.currentLocation = ko.observable(this.locationList()[0]);

    this.query =  ko.observable('');

    this.filteredItems = ko.computed(function() {
        var filter = self.query().toLowerCase();
        if (!filter) {
            return self.locationList();
        } else {
            return ko.utils.arrayFilter(self.locationList(), function(item) {
                //console.log(item.completeAddress().toLowerCase().indexOf(filter.toLowerCase()) >=0);
                //return ko.utils.stringStartsWith(item.city().toLowerCase(), filter);
                return item.completeAddress().toLowerCase().indexOf(filter.toLowerCase()) >=0;
            });
        }
    });
    // var map = initializeMap();
    // if (!map) {
    //     alert("Error loading Google Maps. Please try again later.");
    //     return;
    //   }

    // self.map = ko.observable(map);

    // function initializeMap() {
    //     var mapOptions = {
    //         center: new google.maps.LatLng(28.385233,-81.5660627),
    //         disableDefaultUI: true,
    //         mapTypeId: google.maps.MapTypeId.SATELLITE,
    //         zoom: 12
    //     };

    //     return new google.maps.Map(document.querySelector('#map'), mapOptions);
    // }

    // function placeMarkers() {
    //     //console.log(map);
    //         console.log(map);
    //     ko.utils.arrayForEach(self.filteredItems(), function(item) {
    //         //console.log(item);
    //         //console.log(item.latlng());

    //         var marker = new google.maps.Marker ({
    //             map: map,
    //             position: new google.maps.LatLng(item.latlng()),
    //             title: item.completeAddress()
    //         });
    //         console.log(marker);
    //     });
    // }
    // placeMarkers();
    // var marker = new google.maps.Marker({
    //         map: map,
    //         position: new google.maps.LatLng(28.418896, -81.578173),
    //         title: "Test"
    //     });

};

var ViewModel = new ViewModel();
// ko.applyBindings(new ViewModel());
ko.applyBindings(ViewModel);

var mapOptions = {
            center: new google.maps.LatLng(28.4194019,-81.5814004),
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            zoom: 17
        };
var map = new google.maps.Map(document.querySelector('#map'), mapOptions);

ViewModel.filteredItems().forEach(function(item) {
    console.log(item);
    var marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(item.latlng()[0], item.latlng()[1]),
            title: item.completeAddress()
        });
})

// console.log(ViewModel.filteredItems());
// var marker = new google.maps.Marker({
//             map: map,
//             position: new google.maps.LatLng(28.418896, -81.578173),
//             title: "Test"
//         });

//console.log(ViewModel.filteredItems());

// var map = initializeMap();
//     if (!map) {
//         alert("Error loading Google Maps. Please try again later.");
//         //return;
//       }

//     //this.map = ko.observable(map);

    // function initializeMap() {
    //     var mapOptions = {
    //         center: new google.maps.LatLng(28.385233,-81.5660627),
    //         disableDefaultUI: true,
    //         mapTypeId: google.maps.MapTypeId.SATELLITE,
    //         zoom: 12
    //     };

    //     return new google.maps.Map(document.querySelector('#map'), mapOptions);
    // }

    // function placeMarkers() {
    //     //console.log(map);
    //         console.log(ViewModel.map());
    //     ko.utils.arrayForEach(ViewModel.filteredItems(), function(item) {
    //         //console.log(item);
    //         //console.log(item.latlng());

    //         var marker = new google.maps.Marker ({
    //             map: ViewModel.map(),
    //             position: new google.maps.LatLng(item.latlng()),
    //             title: item.completeAddress()
    //         });
    //         console.log(marker);
    //     });
    // }
    // placeMarkers();
    // var marker = new google.maps.Marker({
    //         map: map,
    //         position: new google.maps.LatLng(28.418896, -81.578173),
    //         title: "Test"
    //     });


/*
This is the fun part. Here's where we generate the custom Google Map for the website.
See the documentation below for more details.
https://developers.google.com/maps/documentation/javascript/reference
*/
// var map; // declares a global map variable


// /*
// Start here! initializeMap() is called when page is loaded.
// */
// function initializeMap() {

//     var locations;

//     var mapOptions = {
//         disableDefaultUI: true
//     };

//     /*
//     For the map to be displayed, the googleMap var must be
//     appended to #mapDiv in resumeBuilder.js.
//     */
//     map = new google.maps.Map(document.querySelector('#map'), mapOptions);


//     /*
//     locationFinder() returns an array of every location string from the JSONs
//     written for bio, education, and work.
//     */
//     function locationFinder() {

//         // initializes an empty array
//         // var locations = ['Journey Into Imagination, Walt Disney World, FL',
//         //                  'Space Mountain, Walt Disney World, FL',
//         //                  'Disney\'s Boardwalk Villas, Walt Disney World, FL',
//         //                  'Tower of Terror, Walt Disney World, FL',
//         //                  'Disney\'s Animal Kingdown, Walt Disney World, FL'];
//         var locations = ko.observableArray([]);
//         console.log(ViewModel.filteredItems());
//         ko.utils.arrayForEach(ViewModel.filteredItems(), function(item) {
//             console.log(item.completeAddress());
//             locations.push(item.completeAddress())
//         });
//         console.log(locations());



//         return locations();
//     }

//     /*
//     createMapMarker(placeData) reads Google Places search results to create map pins.
//     placeData is the object returned from search results containing information
//     about a single location.
//     */
//     function createMapMarker(placeData) {

//         // The next lines save location data from the search result object to local variables
//         var lat = placeData.geometry.location.lat(); // latitude from the place service
//         var lon = placeData.geometry.location.lng(); // longitude from the place service
//         var name = placeData.formatted_address; // name of the place from the place service
//         var bounds = window.mapBounds; // current boundaries of the map window

//         // marker is an object with additional data about the pin for a single location
//         var marker = new google.maps.Marker({
//             map: map,
//             position: placeData.geometry.location,
//             title: name
//         });

//         // infoWindows are the little helper windows that open when you click
//         // or hover over a pin on a map. They usually contain more information
//         // about a location.
//         var infoWindow = new google.maps.InfoWindow({
//             content: name
//         });

//         // hmmmm, I wonder what this is about...
//         google.maps.event.addListener(marker, 'click', function() {
//             infoWindow.open(map, marker);
//         });

//         // this is where the pin actually gets added to the map.
//         // bounds.extend() takes in a map location object
//         bounds.extend(new google.maps.LatLng(lat, lon));
//         // fit the map to the new marker
//         map.fitBounds(bounds);
//         // center the map
//         map.setCenter(bounds.getCenter());
//     }

//     /*
//     callback(results, status) makes sure the search returned results for a location.
//     If so, it creates a new map marker for that location.
//     */
//     function callback(results, status) {
//         if (status == google.maps.places.PlacesServiceStatus.OK) {
//             createMapMarker(results[0]);
//         }
//     }

//     /*
//     pinPoster(locations) takes in the array of locations created by locationFinder()
//     and fires off Google place searches for each location
//     */
//     function pinPoster(locations) {

//         // creates a Google place search service object. PlacesService does the work of
//         // actually searching for location data.
//         var service = new google.maps.places.PlacesService(map);

//         // Iterates through the array of locations, creates a search object for each location
//         locations.forEach(function(place) {
//             // the search request object
//             var request = {
//                 query: place
//             };

//             // Actually searches the Google Maps API for location data and runs the callback
//             // function with the search results after each search.
//             service.textSearch(request, callback);
//         });
//     }

//     // // Sets the boundaries of the map based on pin locations
//     window.mapBounds = new google.maps.LatLngBounds();

//     // // locations is an array of location strings returned from locationFinder()
//     locations = locationFinder();

//     // // pinPoster(locations) creates pins on the map for each location in
//     // // the locations array
//     pinPoster(locations);

// }

// // Calls the initializeMap() function when the page loads
// window.addEventListener('load', initializeMap);

// // Vanilla JS way to listen for resizing of the window
// // and adjust map bounds
// window.addEventListener('resize', function(e) {
//     //Make sure the map bounds get updated on page resize
//     map.fitBounds(mapBounds);
// });