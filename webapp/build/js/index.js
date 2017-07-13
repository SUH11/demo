'use strict';

// angular.module('app', ['ui.router', 'ngCookies']);
angular.module('app', ['ui.router', 'ngCookies', 'validation']);

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
angular.module('app').controller('favoriteCtrl', ['$scope', '$http', function($scope, $http) {
    $http.get('data/myFavorite.json').then(function(resutl) {
        $scope.list = resutl.data;
    });

    $scope.back = function() {
        window.history.back();
    }
}]);
'use strict';
angular.module('app').controller('loginCtrl', ['$scope', '$http', '$state', 'cache', function($scope, $http, $state, cache) {
    $scope.submit = function() {
        $http.post('data/login.json', $scope.user).success(function(reusutl) {
            cache.put('id', reusutl.id);
            cache.put('name', reusutl.name);
            cache.put('image', reusutl.image);
            $state.go('main');
        });
    }

}]);
'use strict';
angular.module('app').controller('mainCtrl', ['$scope', '$http', function($scope, $http) {

    $http.get('/data/positionList.json').then(function(result){
        $scope.list = result.data;
    });
    
}]);
'use strict';
angular.module('app').controller('meCtrl', ['$scope','$state', 'cache', function($scope, $state, cache) {
    if ( cache.get('name') ) {
        $scope.name = cache.get('name');
        $scope.image = cache.get('image');
    }
    $scope.logout = function () {
        cache.remove('id');
        cache.remove('name');
        cache.remove('image');
        $state.go('main');
    }
}]);
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
'use strict';
angular.module('app').controller('postCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.tabList = [{
        id : 'all', 
        name : '全部'
    },{
        id : 'pass', 
        name : '面试邀请'
    },{
        id : 'fail', 
        name : '不合适'
    }];

    $http.get('data/myPost.json').then(function(result) {
        $scope.list = result.data;
    });

    $scope.filterObj = {};

    $scope.back = function() {
        window.history.back();
    }

    $scope.tClick = function(id, name) {
        switch(id) {
            case 'all':
                delete $scope.filterObj.state;
                break;
            case 'pass':
                $scope.filterObj.state = '1';
                break;
            case 'fail':
                $scope.filterObj.state = '-1';
                break;
            default:
                break;

        }
    }

}]);
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

'use strict';

// 将post请求改为get请求
angular.module('app').config(['$provide', function($provide){
  $provide.decorator('$http', ['$delegate', '$q', function($delegate, $q){
    $delegate.post = function(url, data, config) {
      var def = $q.defer();
      $delegate.get(url).then(function(result){
        def.resolve(result.data);
      }, function(error){
        def.reject(error.data);
      });

      return {
        success: function(cb){
          def.promise.then(cb);
        },
        error: function(cb) {
          def.promise.then(null, cb);
        }
      }
    }
    return $delegate;
  }]);
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
    }).state('login', {
        url : '/login',
        templateUrl : 'view/login.html',
        controller : 'loginCtrl'
    }).state('register', {
        url : '/register',
        templateUrl : 'view/register.html',
        controller : 'registerCtrl'
    }).state('me', {
        url : '/me',
        templateUrl : 'view/me.html',
        controller : 'meCtrl'
    }).state('post', {
        url : '/post',
        templateUrl : 'view/post.html',
        controller : 'postCtrl'
    }).state('favorite', {
        url : '/favorite',
        templateUrl : 'view/favorite.html',
        controller : 'favoriteCtrl'
    });

    $urlRouterProvider.otherwise('main');

}]);
'user strict';

angular.module('app').config(['$validationProvider', function($validationProvider) {
    
    
    var expression = {
        phone : /^1[\d]{10}$/,
        password : function(value) {
            var str = value + '';
            return str.length > 6;
        },
        required : function(value) {
            return !!value;
        }
    };

    var defaultMsg = {
        phone : {
            success: '',
            error: '必须是11位手机号'
        },
        password : {
            success: '',
            error: '长度至少6位'
        },
        required : {
            success : '',
            error : '不能为空'
        }
    };

    $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);

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

angular.module('app').directive('appHead', ['cache', function(cache){
    return {
        restrict: 'A', 
        replace: true,
        templateUrl: 'view/template/head.html',
        link:function(scope){
        	scope.name = cache.get('name');
        }
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

angular.module('app').service('cache', ['$cookies', function($cookies){
    this.put = function(key, value){
      $cookies.put(key, value);
    };
    this.get = function(key) {
      return $cookies.get(key);
    };
    this.remove = function(key) {
      $cookies.remove(key);
    };
}]);

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