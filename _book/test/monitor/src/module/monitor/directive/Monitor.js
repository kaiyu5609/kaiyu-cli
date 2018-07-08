(function() {
    'use strict';

    angular.module('app.directive.MonitorDirective', [])
    .directive('monitorDirective', ['MonitorService', function(MonitorService) {
        return {
            restrict: 'EA',
            replace: true,
            template: [
                '<div>',
                    'MonitorDirective',
                '</div>'
            ].join('\n'),
            scope: {

            },
            link: function(scope, element, attrs) {

            }
        };
    }]);

})();