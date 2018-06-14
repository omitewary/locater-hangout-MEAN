(function () {
    angular.module('loc8rApp').controller('reviewModalCtrl', [
    '$scope',
    'data',
    '$uibModalInstance',
    'loc8rData',
    '$log',
        function ($scope, data, $uibModalInstance, loc8rData, $log) {
            var $ctrl = this;
            $ctrl.x = 'active';
            $ctrl.data = data;

            $ctrl.onSubmit = function () {
                doAddReview($ctrl.data);
            }

            $ctrl.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            }

            function doAddReview(data) {
                var locationId = data.location._id;
                var requestPayload = {
                    "reviewText": $ctrl.reviewText,
                    "rating": $ctrl.rating
                }
                loc8rData.addReviewById(locationId, requestPayload).success(function (response) {
                    $uibModalInstance.close(response);
                    $log.log('res : ', response);
                }).error(function (error) {
                    $ctrl.errorData = 'Your review has not been saved, Please try again!'
                })
            }

}]);
})();