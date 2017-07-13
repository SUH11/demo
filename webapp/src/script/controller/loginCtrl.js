'use strict';
angular.module('app').controller('loginCtrl', ['$scope', '$http', '$state', 'cache', function($scope, $http, $state, cache) {
    $scope.submit = function() {
        $http.post('data/login.json', $scope.user).success(function(reusutl) {
            cache.put('id', reusutl.id);
            cache.put('name', reusutl.name);
            cache.put('image', reusutl.image);
            $state.go('main');
        });
    }

}]);