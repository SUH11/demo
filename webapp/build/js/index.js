'use strict';

angular.module('app', ['ui.router']);

'user strict';

angular.module('app').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('main', {
        url : '/main', 
        templateUrl : 'view/main.html', 
        controller : 'mainCtrl'
    });

    $urlRouterProvider.otherwise('main');

    console.log(1);
}]);
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

angular.module('app').directive('appPosition', [function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/positionList.html',
        // 降低指令耦合度
        scope : {
            data : '='
        }
    };
}]);


