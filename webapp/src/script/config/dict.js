'use strict';

angular.module('app').value('dict', {}).run(['$http', 'dict', function($http, dict) {

    $http.get('data/city.json').then(function(result) {
        dict.city = result.data;
    });

    $http.get('data/salary.json').then(function(result) {
        dict.salary = result.data;
    });

    $http.get('data/scale.json').then(function(result) {
        dict.scale = result.data;
    });
    
}]);
