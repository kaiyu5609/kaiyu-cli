(function() {
    'use strict';

    angular.module('app.directive.CommonDirective', [])
    .directive('commonDirective', ['CommonService', function(CommonService) {
        return {
            restrict: 'EA',
            replace: true,
            template: [
                '<div>',
                    'CommonDirective',
                '</div>'
            ].join('\n'),
            scope: {

            },
            link: function(scope, element, attrs) {

            }
        };
    }]);

})();