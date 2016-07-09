// function initMap() {// initialLocations contains the information on the five locations


    // if (typeof google === 'undefined') {
    //     alert("Google Maps Failed to Load");
    // } else {
    //     alert("FAFA")
    // }


var initialLocations = [{
    streetAddress: 'Cinderella Castle',
    city: 'Walt Disney World',
    state: 'FL',
    latlng: [28.4194019, -81.5814004]
}, {
    streetAddress: 'Space Mountain',
    city: 'Walt Disney World',
    state: 'FL',
    latlng: [28.418896, -81.578173]
}, {
    streetAddress: 'Big Thunder Mountain Railroad',
    city: 'Walt Disney World',
    state: 'FL',
    latlng: [28.419973, -81.5851865]
}, {
    streetAddress: 'Splash Mountain',
    city: 'Walt Disney World',
    state: 'FL',
    latlng: [28.4190814, -81.5850448]
}, {
    streetAddress: 'Jungle Cruise',
    city: 'Walt Disney World',
    state: 'FL',
    latlng: [28.417988, -81.583436]
}];

/* Data Model Location
 * This object stores all of the data for the locations. The Wikipedia API is
 * used to obtain information for each location.
 */
var Location = function(data, map) {
    var self = this;
    this.streetAddress = ko.observable(data.streetAddress);
    this.city = ko.observable(data.city);
    this.state = ko.observable(data.state);
    this.latlng = ko.observable(data.latlng);

    this.cityState = ko.computed(function() {
        return this.city() + ", " + this.state();
    }, this);

    this.completeAddress = ko.computed(function() {
        return this.streetAddress() + ", " + this.cityState();
    }, this);

    // Get wikipedia article information and link using
    // https://www.mediawiki.org/wiki/API:Opensearch
    self.params = $.param({
        'action': 'opensearch',
        'search': self.streetAddress,
        'format': 'json',
        'limit': '1'
    });
    var URL = 'https://en.wikipedia.org/w/api.php?' + self.params;

    $.ajax({
        url: URL,
        dataType: 'jsonp'
    }).done(function (data) {
        var dataLength = data[1].length;
                for (var i = 0; i < dataLength; i++) {
                    self.wikiInfo = {
                        'title': data[0],
                        'leadPara': data[2][0],
                        'href': data[3][0]
                    };
                }
                self.infoWindow = new google.maps.InfoWindow({
                    content: '<div class="info-window"><h3>' +
                        self.wikiInfo.title +
                        '</h3><p>' + self.wikiInfo.leadPara + '</p><a href="' +
                        self.wikiInfo.href +
                        '" target="new">More Info...</a></div>'
                });
                self.infoWindow.addListener('closeclick', function() {
                    self.locationClicked();
                });
    }).fail(function (jqXHR, textStatus) {
        console.log(textStatus);
        $('#error').html('<div id="error">Error Loading Wikipedia.  Please refresh.</div>');
});
    //console.log(self.ajaxFailed);
    //if (self.ajaxFailed) {
    //    alert("Error loading Wikipedia.  Please try again later.");
    //}


    // Set up the location's marker using the data from the initialLocations
    // object
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.latlng()[0], this.latlng()[1]),
        animation: google.maps.Animation.DROP,
        title: this.completeAddress()
    });

    // Keeps track of whether or not this Location's Info Window is open
    this.infoOpen = false;

    marker.addListener('click', function() {
        self.locationClicked();
    });

    // Function that processes clicking on the marker or the location
    // in the list view.
    this.locationClicked = function() {
        if (!self.infoOpen) {
            //map.setZoom(20);
            //map.panTo(marker.position);
            self.infoWindow.open(map, marker);
            self.infoOpen = true;
            marker.setAnimation(google.maps.Animation.BOUNCE);
        } else {
            self.infoWindow.close();
            self.infoOpen = false;
            marker.setAnimation(null);
            //map.setZoom(16);
            map.fitBounds(new google.maps.LatLngBounds(
                new google.maps.LatLng(28.415051, -81.586766),
                new google.maps.LatLng(28.422288, -81.576917)));
        }
    };

    // Controls the visibility of the marker based on the search filter
    self.isVisible = ko.observable(false);

    self.isVisible.subscribe(function(currentState) {
        if (currentState) {
            marker.setMap(map);

        } else {
            marker.setMap(null);

        }
    });

    // Default is that the marker is visible
    self.isVisible(true);


};

var ViewModel = function() {
    var self = this;


    // Set up the Google Map
    var mapOptions = {
        center: new google.maps.LatLng(28.419552, -81.582196),
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        zoom: 16
    };
    var googleMap = new google.maps.Map(document.querySelector('#map'),
                                        mapOptions);



    var mapBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(28.415051, -81.586766),
        new google.maps.LatLng(28.422288, -81.576917));

    // Create an array of the locations
    self.locationList = ko.observableArray([]);

    initialLocations.forEach(function(locationItem) {
        self.locationList().push(new Location(locationItem, googleMap));
    });

    if (self.locationList()[0].ajaxFailed) {
        alert("FAILED");
    }
    // Stores the value of the search box
    self.query = ko.observable('');

    // filteredItems contains the locations that meet the search criteria
    self.filteredItems = ko.computed(function() {
        var filter = self.query().toLowerCase();
        return ko.utils.arrayFilter(self.locationList(), function(item) {
            var match = item.streetAddress().toLowerCase().indexOf(filter.toLowerCase()) >= 0;
            item.isVisible(match);
            return match;
        });
    });

    // Helps make the Google Map responsive to window resizing
    window.addEventListener('resize', function(e) {
        var center = googleMap.getCenter();
        googleMap.setCenter(center);
        googleMap.fitBounds(mapBounds);
    });
};


var initMap = function() {
    if (typeof google === 'undefined') {
        $('#error').html('<div id="error">Error Loading Google Maps.  Please refresh or try later.</div>');
    } else {
        ko.applyBindings(new ViewModel());
    }
    //  if (!isMapLoaded) {
    //     $('#error').html('<div id="error">Error Loading Google Maps.  Please refresh or try later.</div>');
    // } else {
    //     ko.applyBindings(new ViewModel());
    // }
 }