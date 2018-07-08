(function() {
    'use strict';

    angular.module('app.directive.{{metadata.ModuleName}}Directive', [])
    .directive('{{metadata.moduleName}}Directive', ['{{metadata.ModuleName}}Service', function({{metadata.ModuleName}}Service) {
        return {
            restrict: 'EA',
            replace: true,
            template: [
                '<div>',
                    '{{metadata.ModuleName}}Directive',
                '</div>'
            ].join('\n'),
            scope: {

            },
            link: function(scope, element, attrs) {

            }
        };
    }]);

})();