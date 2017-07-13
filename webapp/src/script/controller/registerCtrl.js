'use strict';
angular.module('app').controller('registerCtrl', ['$scope', '$http', '$interval', '$state', function($scope, $http, $interval, $state) {
    $scope.submit = function() {
        $http.post('data/regist.json', $scope.user).success(function() {
            console.log(111111111111)
            $state.go('login');
        });
    }
    $scope.send = function() {
        $http.get('data/code.json').then(function(result) {
            if ( result.data.state == 1 ) {
                var count = 60;
                $scope.time = '60s';
                var interval = $interval(function() {
                    if ( count <= 0 ) {
                        $interval.cancel(interval);
                        delete $scope.time;
                        return;
                    } else {
                        count --;
                        $scope.time = count + 's';
                    }
                    console.log(count)
                }, 1000);
            }
        });
    }
}]);