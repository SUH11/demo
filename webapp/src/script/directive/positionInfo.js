'use strict';

angular.module('app').directive('appPositionInfo', ['$http',function($http) {
    return {
        restrict : 'A',
        replace : true,
        templateUrl : 'view/template/positionInfo.html',
        scope : {
            isActive : '=',
            isLogin : '=',
            pos : '='
        },
        link : function(scope) {
            
            // 先监听pos是否加载完成
            scope.$watch('pos', function(newVal){
                if ( newVal ) {
                    scope.pos.select = scope.pos.select || false;
                    scope.imagePath = scope.pos.select ? 'image/star-active.png' : 'image/star.png';
                }
            });
            scope.favorite = function() {
                $http.post('data/favorite.json', {
                    id : scope.pos.id,
                    select : scope.pos.select
                }).success(function(result){
                    scope.pos.select = !scope.pos.select;
                    scope.imagePath = scope.pos.select ? 'image/star-active.png' : 'image/star.png';

                });
            }

        }
    };

}]);


