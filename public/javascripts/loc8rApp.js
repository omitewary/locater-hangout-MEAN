var locationListCtrl = function locationListCtrl($scope, loc8rData, geoLocation) {
    $scope.message = 'Getting your location';
    $scope.getData = function (position) {
        var lng = position.coords.longitude,
            lat = position.coords.latitude;

        $scope.message = 'Searching for nearby places';
        loc8rData.locationByCoords(lng, lat).success(function (data) {
            console.log('data', data);
            $scope.message = data.length > 0 ? '' : 'No location found nearby!';
            $scope.data = {
                locations: data
            }
        }).error(function (e) {
            $scope.message = 'Sorry, Something gone wrong!';
            console.log(e);
        });

    }

    $scope.showError = function (error) {
        $scope.$apply(function () {
            $scope.message = error.message;
        })
    };

    $scope.noGeo = function () {
        $scope.$apply(function () {
            $scope.message = 'geolocation not supported!';
        })
    };
    geoLocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);
}

var geoLocation = function () {
    var getPosition = function (cbSuccess, cbError, cbNoGeo) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(cbSuccess, cbError)
        } else {
            cbNoGeo();
        }
    };
    return {
        getPosition: getPosition
    }
};

var formatDistance = function () {
    return function (distance) {
        if (distance > 1) {
            numDistance = parseFloat(distance.toFixed(1));
            unit = ' km';
        } else {
            numDistance = parseInt(distance * 1000, 10);
            unit = ' m'
        }
        return numDistance + unit;
    }
};

var ratingStars = function () {
    return {
        scope: {
            thisRating: '=rating'
        },
        templateUrl: '/views/rating-stars.html'
    };

};

var loc8rData = function ($http) {
    var locationByCoords = function (lng, lat) {
        return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=5000');
    };
    return {
        locationByCoords: locationByCoords
    }
}


angular.module('loc8rApp', []);
angular
    .module('loc8rApp')
    .controller('locationListCtrl', locationListCtrl)
    .filter('formatDistance', formatDistance)
    .directive('ratingStars', ratingStars)
    .service('loc8rData', loc8rData)
    .service('geoLocation', geoLocation);