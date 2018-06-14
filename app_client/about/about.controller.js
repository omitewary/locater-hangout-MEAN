(function() {
    angular.module('loc8rApp').controller('aboutCtrl',aboutCtrl);
    
    function aboutCtrl() {
        var vm = this;
        
        vm.pageHeader = {
            title: 'About Loc8r',
        };
        
        vm.main = {
            content: 'Loc8r was created to help people find places to sit down.Attitudes, orientations, or behaviors which take the interests, intentions, or needs of other people into account (in contrast to anti-social behaviour) has played some role in defining the idea or the principle. For instance terms like social realism, social justice, social constructivism, social psychology, social anarchism and social capital imply that there is some social process involved or considered, a process that is not there in regular, "non-social" realism, justice, constructivism, psychology, anarchism, or capital.'
        };
    };
})();