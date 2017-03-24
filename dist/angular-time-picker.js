angular.module("html2js", [ "/angular-time-picker.tpl.html" ]);

angular.module("/angular-time-picker.tpl.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("/angular-time-picker.tpl.html", '<div class="angular-time-picker-rapper">\n' + '\t<span class="angular-time-picker-button"\n' + '\t\tng-class="theme"\n' + '\t\ttitle="Time Range Filter"\n' + '\t\tng-click="dropdownToggleState = !dropdownToggleState;">\n' + "\t\t\t<span ng-show=\"!noRange\">{{ timeSettings.fromHour + ':' + timeSettings.fromMinute + ' - ' + timeSettings.toHour + ':' + timeSettings.toMinute }}</span>\n" + "\t\t\t<span ng-show=\"noRange\">{{ timeSettings.fromHour + ':' + timeSettings.fromMinute }}</span>\n" + '\t\t<i class="angular-time-picker-caret" ng-class="theme"></i>\n' + "\t</span>\n" + '\t<div ng-show="dropdownToggleState" class="angular-time-picker-dropdown__menu  angular-time-picker-theme" ng-class="theme">\n' + "\t\t<div>\n" + "\t\t\tStart:\n" + '\t\t\t<span class="angular-time-picker-float--right">\n' + "\t\t\t\t<!-- `browser-default` class is being used as materializecss framework override default select css-->\n" + "\t\t\t\t<!-- Thus to prevent this, adding a class. Materializecss is a famous framework for Material Design. -->\n" + '\t\t\t\t<select ng-model="startingHour" class="input input--select w--3">\n' + '\t\t\t\t\t<option ng-repeat="option in startingTimeHoursRange" ng-disabled="option.disabled" value="{{option.value}}">{{option.name}}</option>\n' + "\t\t\t\t</select>\n" + "\t\t\t\t:\n" + '\t\t\t\t<select ng-model="startingMinute" class="input input--select w--3">\n' + '\t\t\t\t\t<option ng-repeat="option in startingTimeHMinutesRange" ng-disabled="option.disabled" value="{{option.value}}">{{option.name}}</option>\n' + "\t\t\t\t</select>\n" + "\t\t\t</span>\n" + "\t\t</div>\n" + '\t\t<div class="angular-time-picker-push--top" ng-show="!noRange">\n' + "\t\t\tEnd:\n" + '\t\t\t<span class="angular-time-picker-float--right">\n' + '\t\t\t\t<select ng-model="endingHour" class="input input--select w--3">\n' + '\t\t\t\t\t<option ng-repeat="option in endingTimeHoursRange" ng-disabled="option.disabled" value="{{option.value}}">{{option.name}}</option>\n' + "\t\t\t\t</select>\n" + "\t\t\t\t:\n" + '\t\t\t\t<select ng-model="endingMinute" class="input input--select w--3">\n' + '\t\t\t\t\t<option ng-repeat="option in endingTimeHMinutesRange" ng-disabled="option.disabled" value="{{option.value}}">{{option.name}}</option>\n' + "\t\t\t\t</select>\n" + "\t\t\t</span>\n" + "\t\t</div>\n" + '\t\t<div class="angular-time-picker-push--top">\n' + '\t\t\t<button type="button" class="btn btn--ghost btn--med btn--nospace" ng-click="resetToOriginalTimeSettings()">Reset</button>\n' + '\t\t\t<button type="button" class="angular-time-picker-push-half--left  angular-time-picker-float--right  angular-time-picker-apply-btn btn btn--primary btn--med" ng-click="applyTimeRangeFilter()">Apply</button>\n' + '\t\t\t<button type="button" class="angular-time-picker-push-half--left  angular-time-picker-float--right  angular-time-picker-cancel-btn btn btn--ghost btn--med" ng-click="closeTimeFilterDropdown()">Cancel</button>\n' + "\t\t</div>\n" + "\t</div>\n" + "</div>\n" + "");
} ]);

"use strict";

angular.module("wingify.timePicker", [ "html2js" ]).directive("wyTimePicker", [ "$timeout", function($timeout) {
    return {
        restrict: "EA",
        replace: true,
        templateUrl: "/angular-time-picker.tpl.html",
        scope: {
            timeSettings: "=",
            dropdownToggleState: "=?",
            format: "=?",
            theme: "=?",
            noRange: "=",
            noValidation: "=",
            applyCallback: "&",
            clearCallback: "&"
        },
        link: function(scope, element) {
            var i, timeHoursRange = [], timeMinutesRange = [];
            scope.startingTimeHoursRange = [];
            scope.endingTimeHoursRange = [];
            scope.startingTimeHMinutesRange = [];
            scope.endingTimeHMinutesRange = [];
            scope.timeSettings = scope.timeSettings || {};
            scope.theme = scope.theme ? "angular-time-picker-" + scope.theme : "angular-time-picker-light";
            scope.timeHourFormat = scope.format && parseInt(scope.format, 10) === 12 ? 12 : 24;
            for (i = 0; i < scope.timeHourFormat; i++) {
                timeHoursRange.push({
                    name: i < 10 ? "0" + i : i + "",
                    value: i < 10 ? "0" + i : i + ""
                });
            }
            for (i = 0; i < 60; i++) {
                timeMinutesRange.push({
                    name: i < 10 ? "0" + i : i + "",
                    value: i < 10 ? "0" + i : i + ""
                });
            }
            angular.copy(timeHoursRange, scope.startingTimeHoursRange);
            angular.copy(timeMinutesRange, scope.startingTimeHMinutesRange);
            angular.copy(timeHoursRange, scope.endingTimeHoursRange);
            angular.copy(timeMinutesRange, scope.endingTimeHMinutesRange);
            if (!scope.noValidation && scope.timeSettings.toHour < scope.timeSettings.fromHour) {
                scope.timeSettings.toHour = scope.timeSettings.fromHour;
            }
            scope.updateTimeRangeFilter = function() {
                scope.timeSettings.fromHour = scope.startingHour;
                scope.timeSettings.fromMinute = scope.startingMinute;
                if (!scope.noRange) {
                    scope.timeSettings.toHour = scope.endingHour;
                    scope.timeSettings.toMinute = scope.endingMinute;
                }
            };
            scope.setInitialTimeRange = function() {
                if (angular.isUndefined(scope.timeSettings.fromHour)) {
                    scope.timeSettings.fromHour = scope.startingTimeHoursRange[0].value;
                }
                scope.initStartingHour = scope.startingHour = scope.timeSettings.fromHour;
                if (angular.isUndefined(scope.timeSettings.fromMinute)) {
                    scope.timeSettings.fromMinute = scope.endingTimeHMinutesRange[0].value;
                }
                scope.initStartingMinute = scope.startingMinute = scope.timeSettings.fromMinute;
                if (!scope.noRange && angular.isUndefined(scope.timeSettings.toHour)) {
                    scope.timeSettings.toHour = scope.startingTimeHoursRange[scope.timeHourFormat - 1].value;
                }
                scope.initEndingHourHour = scope.endingHour = scope.timeSettings.toHour;
                if (!scope.noRange && angular.isUndefined(scope.timeSettings.toMinute)) {
                    scope.timeSettings.toMinute = scope.endingTimeHMinutesRange[59].value;
                }
                scope.initEndingMinute = scope.endingMinute = scope.timeSettings.toMinute;
            };
            scope.resetToOriginalTimeSettings = function() {
                scope.startingHour = scope.initStartingHour;
                scope.startingMinute = scope.initStartingMinute;
                if (!scope.noRange) {
                    scope.endingHour = scope.initEndingHourHour;
                    scope.endingMinute = scope.initEndingMinute;
                }
                scope.applyTimeRangeFilter();
            };
            scope.clearTimeRange = function() {
                scope.clearCallback();
                scope.closeTimeFilterDropdown();
            };
            scope.applyTimeRangeFilter = function() {
                scope.updateTimeRangeFilter();
                scope.applyCallback();
                scope.closeTimeFilterDropdown();
            };
            scope.closeTimeFilterDropdown = function() {
                scope.dropdownToggleState = false;
                scope.startingHour = scope.timeSettings.fromHour;
                scope.startingMinute = scope.timeSettings.fromMinute;
                if (!scope.noRange) {
                    scope.endingHour = scope.timeSettings.toHour;
                    scope.endingMinute = scope.timeSettings.toMinute;
                }
            };
            scope.validateHours = function() {
                if (scope.startingHour !== scope.endingHour) {
                    for (var i = 0; i < timeMinutesRange.length; i++) {
                        scope.startingTimeHMinutesRange[i].disabled = false;
                        scope.endingTimeHMinutesRange[i].disabled = false;
                    }
                } else if (scope.startingMinute >= scope.endingMinute) {
                    if (scope.endingMinute !== "00") {
                        scope.startingMinute = scope.endingMinute - 1;
                        scope.startingMinute = scope.startingMinute < 10 ? "0" + scope.startingMinute : scope.startingMinute + "";
                        scope.validateStartingMinuteTime();
                    } else if (scope.endingMinute === "00") {
                        scope.endingMinute = "01";
                    }
                } else if (scope.startingHour === scope.endingHour) {
                    scope.validateStartingMinuteTime();
                    scope.validateEndingMinuteTime();
                }
                if (scope.areInitialSettingsValidated) {
                    scope.applyTimeRangeFilter();
                }
            };
            scope.validateStartingMinuteTime = function() {
                for (var i = 0; i < timeMinutesRange.length; i++) {
                    if (i > parseInt(scope.endingMinute, 10) - 1 && i < timeMinutesRange.length) {
                        scope.startingTimeHMinutesRange[i].disabled = true;
                    } else {
                        scope.startingTimeHMinutesRange[i].disabled = false;
                    }
                }
            };
            scope.validateEndingMinuteTime = function() {
                for (var i = 0; i < timeMinutesRange.length; i++) {
                    if (i >= 0 && i < parseInt(scope.startingMinute, 10) + 1) {
                        scope.endingTimeHMinutesRange[i].disabled = true;
                    } else {
                        scope.endingTimeHMinutesRange[i].disabled = false;
                    }
                }
            };
            if (!scope.noRange && !scope.noValidation) {
                scope.$watch("startingHour", function(newValue, oldValue) {
                    if (!newValue || newValue === oldValue) {
                        return;
                    }
                    for (var i = 0; i < timeHoursRange.length; i++) {
                        if (i >= 0 && i < parseInt(scope.startingHour, 10)) {
                            scope.endingTimeHoursRange[i].disabled = true;
                        } else {
                            scope.endingTimeHoursRange[i].disabled = false;
                        }
                    }
                    scope.validateHours(scope.startingHour, scope.endingTimeHoursRange);
                });
                scope.$watch("startingMinute", function(newValue, oldValue) {
                    if (!newValue || newValue === oldValue || scope.startingHour !== scope.endingHour) {
                        return;
                    }
                    scope.validateEndingMinuteTime();
                });
                scope.$watch("endingHour", function(newValue, oldValue) {
                    if (!newValue || newValue === oldValue) {
                        return;
                    }
                    for (var i = 0; i < timeHoursRange.length; i++) {
                        if (i > parseInt(scope.endingHour, 10) && i < timeHoursRange.length) {
                            scope.startingTimeHoursRange[i].disabled = true;
                        } else {
                            scope.startingTimeHoursRange[i].disabled = false;
                        }
                    }
                    scope.validateHours(scope.endingHour, scope.startingTimeHoursRange);
                });
                scope.$watch("endingMinute", function(newValue, oldValue) {
                    if (!newValue || newValue === oldValue || scope.startingHour !== scope.endingHour) {
                        return;
                    }
                    scope.validateStartingMinuteTime();
                    if (!scope.areInitialSettingsValidated) {
                        scope.areInitialSettingsValidated = true;
                    }
                });
            }
            $timeout(function() {
                scope.setInitialTimeRange();
            }, 0);
            element.bind("click", function(e) {
                if (e !== null) {
                    if (typeof e.stopPropagation === "function") {
                        e.stopPropagation();
                    }
                }
            });
            var onDocumentClick = function() {
                scope.closeTimeFilterDropdown();
                scope.$digest();
            };
            angular.element(document).bind("click", onDocumentClick);
            scope.$on("$destroy", function() {
                return angular.element(document).unbind("click", onDocumentClick);
            });
        }
    };
} ]);