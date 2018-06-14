(function() {
  angular.module('loc8rApp').service('loc8rData', ['$http','authentication', function($http,authentication) {
    var locationByCoords = function (lng, lat) {
        return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=10000');
    };
      
    var locationById = function(locationId) {
        return $http.get('/api/locations/' + locationId);
    };
      
    var addReviewById = function(locationId, data) {
        return $http.post('/api/locations/' + locationId + '/review', data, 
        {headers: {Authorization: 'Bearer '+ authentication.getToken()}});
    }
      
    return {
        locationByCoords: locationByCoords,
        locationById: locationById,
        addReviewById: addReviewById
    };
}]);  
})();