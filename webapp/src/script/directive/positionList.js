'use strict';

angular.module('app').directive('appPosition', [function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/positionList.html',
        // 降低指令耦合度
        scope : {
            data : '=',
            filterObj : '='
        }
    };
}]);


