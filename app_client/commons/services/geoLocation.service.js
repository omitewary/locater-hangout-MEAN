(function () {
    angular.module('loc8rApp').service('geoLocation', geoLocation)

    function geoLocation() {
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
})();