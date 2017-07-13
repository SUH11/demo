'use strict';

angular.module('app').directive('appPosition', ['$http', 'cache', function($http,cache) {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/positionList.html',
        // 降低指令耦合度
        scope : {
            data : '=',
            filterObj : '=',
            isFavorite:'='
        },
        link : function(scope) {
            // 判断是否登录
            scope.name=cache.get('name')||'';
            
            scope.select=function(item){
                $http.post('data/favorite.json', {
                    id : item.id,
                    select : !item.select
                }).success(function(result){
                    // 返回成功就取消
                    item.select=!item.select;
                });
            }            
        }
    };
}]);


