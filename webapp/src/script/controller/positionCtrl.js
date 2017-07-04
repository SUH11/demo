'use strict';

angular.module('app').controller('positionCtrl', ['$scope', '$http', '$state', '$q', function($scope, $http, $state, $q) {
    // cache.put('to', 'day');
    $scope.isLogin = false;

    function getPositon() {
        var def = $q.defer();
        $http.get('/data/position.json', {
            params : {
                id : $state.params.id
            }
        }).then(function(result) {
            $scope.position = result.data;
            def.resolve(result);
        }).catch(function(result) {
            def.reject(result);
        });
        return def.promise;
    }

    getPositon().then(function(result) {
        getCompany(result.data.companyId);
    }, function(result) {
        // 失败
    });

    function getCompany(id) {
        $http.get('/data/company.json?id=' + id).then(function(result) {
            $scope.company = result.data;
        });
    }

    


}]);