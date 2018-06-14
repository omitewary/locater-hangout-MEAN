(function() {
    angular
        .module('loc8rApp')
        .controller('locationDetailCtrl',[
        '$routeParams', 
        'loc8rData', 
        '$uibModal', 
        'authentication',
        '$location',
        function($routeParams, loc8rData, $uibModal, authentication, $location) {
            var vm = this;
            vm.locationId = $routeParams.locationId;
            
            vm.isLoggedIn = authentication.isLoggedIn();
            
            vm.currentPath = $location.path();
            
            loc8rData.locationById(vm.locationId).success(function(data) {
               console.log("data : ",data); 
                vm.data = {location: data};
                vm.pageHeader = {
                    title: vm.data.location.name
                }
            })
            .error(function(e) {
                console.log(e);
            })
            
            vm.popReviewModal = function() {
                var modalInstance = $uibModal.open({
                    templateUrl:'../reviewModal/reviewModal.view.html',
                    controller: 'reviewModalCtrl',
                    controllerAs: '$ctrl',
                    resolve: {
                        data: function() {
                            return vm.data;
                        }
                    }
                });
                modalInstance.result.then(function(data) {
                    vm.data.location.reviews.push(data); 
                });
            }
    }]);
})();