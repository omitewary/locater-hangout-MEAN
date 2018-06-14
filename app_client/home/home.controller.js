(function() {
    angular.module('loc8rApp').controller('homeCtrl', ['$scope', 'loc8rData', 'geoLocation', function($scope, loc8rData, geoLocation){
    var vm = this;
    vm.pageHeader = {
        title: 'Loc8r',
        strapline: 'Find places to work with wifi near you!'
    };
    vm.sidebar = {
        content: 'Looking for wifi and a seat etc etc'
    };
    vm.message = 'Getting your location';
    vm.getData = function (position) {
        var lng = position.coords.longitude
            lat = position.coords.latitude;

        vm.message = 'Searching for nearby places';
        loc8rData.locationByCoords(lng, lat).success(function (data) {
            console.log('data :', data);
            vm.message = data.length > 0 ? '' : 'No location found nearby!';
            vm.data = {
                locations: data
            }
        }).error(function (e) {
            vm.message = 'Sorry, Something gone wrong!';
            console.log(e);
        });

    }

    vm.showError = function (error) {
        $scope.$apply(function () {
            vm.message = error.message;
        })
    };

    vm.noGeo = function () {
        $scope.$apply(function () {
            vm.message = 'geolocation not supported!';
        })
    };
    geoLocation.getPosition(vm.getData, vm.showError, vm.noGeo);
}]);
})();
