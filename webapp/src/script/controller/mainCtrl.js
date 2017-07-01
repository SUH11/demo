'use strict';
angular.module('app').controller('mainCtrl', ['$scope', function($scope) {

    $scope.list = [
        {
            id : '1',
            name : '销售',
            imgSrc : 'image/company-3.png',
            companyName : '千度',
            city : '上海',
            industry : '互联网',
            time : '2017.07.01'
        },
        {
            id : '2',
            name : 'WEB前端',
            imgSrc : 'image/company-1.png',
            companyName : '慕课网',
            city : '上海',
            industry : '互联网',
            time : '2017.07.01'
        }
    ];
    
}]);