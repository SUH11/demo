'use strict';

// angular.module('app', ['ui.router', 'ngCookies']);
angular.module('app', ['ui.router']);

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

'user strict';

angular.module('app').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('main', {
        url : '/main', 
        templateUrl : 'view/main.html', 
        controller : 'mainCtrl'
    }).state('position', {
        url : '/position/:id',
        templateUrl : 'view/position.html',
        controller : 'positionCtrl'
    }).state('company', {
        url : '/company/:id',
        templateUrl : 'view/company.html',
        controller : 'companyCtrl'
    }).state('search', {
        url : '/search',
        templateUrl : 'view/search.html',
        controller : 'searchCtrl'
    });

    $urlRouterProvider.otherwise('main');

}]);
'use strict';
angular.module('app').controller('companyCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {

    // 请求公司详情json数据
    $http.get('data/company.json?id=' + $state.params.id).then(function(result) {
        $scope.company = result.data;
        // $scope.$broadcase广播收不到：
        // 原因：接收方可能没有初始化完成
    });


}]);
'use strict';
angular.module('app').controller('mainCtrl', ['$scope', '$http', function($scope, $http) {

    $http.get('/data/positionList.json').then(function(result){
        $scope.list = result.data;
    });
    
}]);
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
'use strict';
angular.module('app').controller('searchCtrl', ['$scope', '$http', 'dict', function($scope, $http, dict) {

    $scope.name = '';
    $scope.search = function () {
        $http.get('data/positionList.json?name' + $scope.name).then(function(result) {
            $scope.list = result.data;
        });
    }

    $scope.search();
    $scope.sheet = {};
    $scope.tabList = [{
        id : 'city',
        name : '城市'
    }, {
        id : 'salary',
        name : '薪水'
    }, {
        id : 'scale',
        name : '公司规模'
    }];

    // console.log($scope.tabList)
    $scope.filterObj = {};
    var tabId = '';
    $scope.tClick = function(id, name) {
        tabId = id;
        $scope.sheet.list = dict[id];
        $scope.sheet.visible = true;
    }

    $scope.sClick = function(id, name) {

        $scope.$watch('list', function(newVal) {
           if ( id ) {
               angular.forEach($scope.tabList, function(item){
                   if ( item.id === tabId ) {
                       item.name = name;
                   }
               });
               $scope.filterObj[tabId + 'Id'] = id;
           } else {
                delete  $scope.filterObj[tabId + 'Id'];
                angular.forEach($scope.tabList, function(item){
                    if ( item.id === tabId ) {
                        switch( item.id ) {
                            case 'city':
                                item.name = '城市';
                                break;
                            case 'salary':
                                item.name = '薪水';
                                break;
                            case 'scale':
                                item.name = '公司规模';
                                break;
                        }
                    }
                });
           }          
        });

        
    }
}]);
'use strict';

angular.module('app').directive('appCompany', [function() {
    return {
        restrict : 'A', 
        replace : true,
        templateUrl : 'view/template/company.html',
        scope : {
            com : '='
        }
    };;
}]);
'use strict';

angular.module('app').directive('appFoot', [function() {
    return {
        restrict : 'A',
        replace : true,
        templateUrl : 'view/template/foot.html'
    };
}]);
'use strict';

angular.module('app').directive('appHead', [function(){
    return {
        restrict: 'A', 
        replace: true,
        templateUrl: 'view/template/head.html'
    };
}]);
'use strict';

angular.module('app').directive('appHeadBar', [function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/headBar.html',
        scope : {
            text : '@'
        },
        link : function(scope) {
            scope.back = function() {
                window.history.back();
            }
        }
    };
}]);



'use strict';

angular.module('app').directive('appPositionClass', [function() {
    return {
        restrict : 'A', 
        replace : true,
        templateUrl : 'view/template/positionClass.html',
        scope : {
            com : '='
        },
        link : function(scope) {
            scope.showPositionList = function(index) {
                scope.positionList = scope.com.positionClass[index].positionList;
                scope.isActive = index;
            }
            scope.isActive = 0;
            // watch写太多会影响性能
            scope.$watch('com', function(newVal) {
                if ( newVal )
                    scope.showPositionList(0);
            });
        }
    };
}]);
'use strict';

angular.module('app').directive('appPositionInfo', [function() {
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
            // scope.imagePath = 'image/star.png';
            scope.imagePath = scope.isActive ? 'image/star-active.png' : 'image/star.png';
        }
    };

}]);



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



'use strict';

angular.module('app').directive('appSheet', [function() {
    return {
        restrict : 'A',
        replace : true,
        templateUrl : 'view/template/sheet.html',
        scope : {
            list : '=',
            visible : '=',
            select : '&'
        }
    };
}]);
'use strict';

angular.module('app').directive('appTab', [function() {
    return {
        restrict : 'A',
        replace : true,
        templateUrl : 'view/template/tab.html',
        scope : {
            list : '=',
            tabClick : '&'
        },
        link : function(scope) {
            scope.click = function(tab) {
                scope.selectId = tab.id;
                scope.tabClick(tab);
            }
        }
    };
}]);


'use strict';

angular.module('app').filter('filterByObj', [function() {
    return function(list, obj) {
        var result = [];
        angular.forEach(list, function(item) {
            var isEqual = true;
            for ( var e in obj ) {
                if ( item[e] !== obj[e] ) {
                    isEqual = false;
                }
            }
            if ( isEqual ) {
                result.push(item);
            }
        });
        return result;
    }
}]);


'use strict';

// angular.module('app')
// .service('cache', ['$cookies', function() {
//     console.log(1)
//     this.put = function(key, value) {
//         $cookies.put(key, value);
//     }
//     this.get = function(key) {
//         return $cookies.get(key);
//     }
//     this.remove = function(key) {
//         $cookies.remove(key);
//     }
// }]);
// .factory('cache', ['$cookies', function() {
//     return {
//         put = function(key, value) {
//             $cookies.put(key, value);
//         },
//         get : function(key) {
//             return $cookies.get(key);
//         }
//     };
// }]);