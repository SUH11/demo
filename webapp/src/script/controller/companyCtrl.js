'use strict';
angular.module('app').controller('companyCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {

    // 请求公司详情json数据
    $http.get('data/company.json?id=' + $state.params.id).then(function(result) {
        $scope.company = result.data;
        // $scope.$broadcase广播收不到：
        // 原因：接收方可能没有初始化完成
    });


}]);