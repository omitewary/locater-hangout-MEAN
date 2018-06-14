(function() {
    angular
        .module('loc8rApp').controller('loginCtrl', ['$scope','$location','authentication',
        function($scope, $location, authentication) {
            var vm = this;
            vm.pageHeader = {
                title: 'Sign in to Loc8r'
            };
            vm.credentials = {};
            vm.returnPage = $location.search().page || '/';
            
            vm.onSubmit = function() {
                vm.formError = '';
                if(!vm.credentials.email || !vm.credentials.password) {
                    vm.formError = 'All fields are required!';
                    return false;
                } else {
                    vm.doLogin();
                }
            };
            
            vm.doLogin = function() {
                console.log('credentials : ', vm.credentials);
                authentication.login(vm.credentials)
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