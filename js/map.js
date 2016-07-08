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



var Location = function(data, map) {
    var self = this;
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

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.latlng()[0], this.latlng()[1]),
        animation: google.maps.Animation.DROP,
        title: this.completeAddress()
    });

    this.infoOpen = false;
    var infoWindow = new google.maps.InfoWindow({
            content: this.streetAddress()
        });

    marker.addListener('click', function() {
        self.locationClicked();
        });

    this.locationClicked = function() {
        //console.log(marker.open + "marker")
        if (!self.infoOpen) {
            infoWindow.open(map, marker);
            self.infoOpen = true;
            marker.setAnimation(google.maps.Animation.BOUNCE);
        } else {
            infoWindow.close();
            self.infoOpen = false;
            marker.setAnimation(null);
        }
    };
    this.isVisible = ko.observable(false);

    this.isVisible.subscribe(function(currentState) {
        if (currentState) {
            marker.setMap(map);
        } else {
            marker.setMap(null);
        }
    });

  this.isVisible(true);

};

var ViewModel = function () {
    var self = this;
    var mapOptions = {
            center: new google.maps.LatLng(28.419552, -81.582196),
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            zoom: 16
        };
    var googleMap = new google.maps.Map(document.querySelector('#map'), mapOptions);
    if (!googleMap) {
        alert("Issue loading Google Maps.  Please try again later.");
    }

    self.locationList = ko.observableArray([]);

    initialLocations.forEach(function(locationItem) {
        self.locationList().push(new Location(locationItem, googleMap));
    })

    self.currentLocation = ko.observable(this.locationList()[0]);

    self.query =  ko.observable('');

    self.filteredItems = ko.computed(function() {
        var filter = self.query().toLowerCase();
        //if (!filter) {
        //    ko.utils.arrayFilter(self.locationList(), function(item) {
        //        item.isVisible(true);
        //    });
        //    return self.locationList();
        //} else {
            return ko.utils.arrayFilter(self.locationList(), function(item) {
                var match = item.completeAddress().toLowerCase().indexOf(filter.toLowerCase()) >=0;
                item.isVisible(match);
                return match;
            });
        //}
    });
};

var ViewModel = new ViewModel();
ko.applyBindings(ViewModel);