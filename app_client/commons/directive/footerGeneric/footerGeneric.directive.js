(function () {
    angular.module('loc8rApp').directive('footerGeneric', footerGeneric);

    function footerGeneric() {
        return {
            restrict: 'EA',
            templateUrl: '/commons/directive/footerGeneric/footerGeneric.template.html'
        };
    }
})(); 