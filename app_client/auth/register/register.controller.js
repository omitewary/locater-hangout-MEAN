(function() {
    angular
        .module('loc8rApp').controller('registerCtrl', ['$scope','$location','authentication',
        function($scope, $location, authentication) {
            var vm = this;
            vm.pageHeader = {
                title: 'Create a new Loc8r account'
            };
            vm.credentials = {};
            vm.returnPage = $location.search().page || '/';
            console.log('returnPage: ',vm.returnPage);

            vm.onSubmit = function() {
                vm.formError = '';
                if(!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
                    vm.formError = 'All fields are required!';
                    return false;
                } else {
                    vm.doRegister();
                }
            };

            vm.doRegister = function() {
                authentication.register(vm.credentials)
                .error(function(err) {
                    vm.formError = err;
                })
                .then(function() {
                    $location.search('page', null);
                    $location.path(vm.returnPage);
                })
            };
        }
    ]);
})();
