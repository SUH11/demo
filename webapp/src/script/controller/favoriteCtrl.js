'use strict';
angular.module('app').controller('favoriteCtrl', ['$scope', '$http', function($scope, $http) {
    $http.get('data/myFavorite.json').then(function(resutl) {
        $scope.list = resutl.data;
    });

    $scope.back = function() {
        window.history.back();
    }
}]);