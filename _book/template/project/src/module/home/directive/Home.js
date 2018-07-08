(function() {
    'use strict';

    angular.module('app.directive.HomeDirective', [])
    .directive('homeDirective', ['HomeService', function(HomeService) {
        return {
            restrict: 'EA',
            replace: true,
            template: [
                '<div>',
                    'HomeDirective',
                '</div>'
            ].join('\n'),
            scope: {

            },
            link: function(scope, element, attrs) {

            }
        };
    }]);

})();