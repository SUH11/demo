'use strict';

angular.module('app').controller('positionCtrl', ['$scope', '$http', '$state', '$q', '$log', 'cache', function($scope, $http, $state, $q, $log, cache) {
    // cache.put('to', 'day');

    $scope.isLogin = !!cache.get('name');

    $scope.message = $scope.isLogin ? '投个简历' : '去登陆';

    $scope.go = function() {

        if ( $scope.message !== '已投递' ) {
            if ( $scope.isLogin ) {
                $http.post('data/handle.json', {
                    id : $scope.position.id
                }).success(function(result){
                    $log.info(result);
                    $scope.message = '已投递';
                });
            } else {
                $state.go('login');
            }
        }

    }

    function getPositon() {
        var def = $q.defer();
        $http.get('/data/position.json', {
            params : {
                id : $state.params.id
            }
        }).then(function(result) {
            $scope.position = result.data;
            if ( $scope.position.posted ) {
                $scope.message = '已投递';
            }
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