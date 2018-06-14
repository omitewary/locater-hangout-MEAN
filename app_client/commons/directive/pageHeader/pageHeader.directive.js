(function () {
    angular.module('loc8rApp').directive('pageHeader', pageHeader);

    function pageHeader() {
        return {
            restrict: 'EA',
            scope: {
                content: '='
            },
            templateUrl: '/commons/directive/pageHeader/pageHeader.template.html'
        };
    }
})(); 