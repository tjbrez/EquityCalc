'use strict';

/**
 * @ngdoc function
 * @name equityCalcApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the equityCalcApp
 */
angular.module('equityCalcApp')
    .controller('MainCtrl', function ($scope, $location) {

        //Highlight Page in Top Menu
        $scope.isActive = function(route) {
            return route === $location.path();
        };

        var empRoles = [
            'Software Engineer',
            'Designer',
            'Business Development Rep',
            'Market Researcher',
            'Content Creator',
            'Data Scientist',
            'Mobile Developer'
        ];

        $scope.empRoles = empRoles;
        $scope.empRole = empRoles[0];

        $scope.setJobRole = function(pEmpRole) {
            $scope.empRole = pEmpRole;
        };

        $scope.empPreference = 'none';






        ////////////////////
        //JQUERY COMPONENTS
        ////////////////////
        $(document).ready(function(){

            var compScope = $('#compSection').scope();

            //Employee Preference Slider
            $('#pref_slider')
                .ionRangeSlider({
                    values: [
                        'Salary', 'Slightly Salary',
                        'No Preference',
                        'Slightly Equity', 'Equity'
                    ],
                    type: 'single',
                    from: 2,
                    step: 1,
                    grid: true
                })

                .on('change', function () {
                    var $this = $(this);
                    var value = $this.prop('value');

                    compScope.$apply(function(){
                        compScope.empPreference = value;
                 });

            });

            //Employee Experience Slider
            $('#experience_slider')
                .ionRangeSlider({
                    values: [
                        'Rookie',
                        'Skilled',
                        'Expert'
                    ],
                    type: 'single',
                    from: 1,
                    step: 1,
                    grid: true
                })

                .on('change', function () {
                    var $this = $(this);
                    var value = $this.prop('value');

                    compScope.$apply(function(){
                        compScope.empExperience = value;
                });
            });

            //Employee Responsibility Slider
            $('#responsibility_slider')
                .ionRangeSlider({
                    values: [
                        'N/A',
                        'Lead',
                        'Manager',
                        'Director',
                        'Executive'
                    ],
                    type: 'single',
                    from: 0,
                    step: 1,
                    grid: true
                })

                .on('change', function () {
                    var $this = $(this);
                    var value = $this.prop('value');

                    compScope.$apply(function(){
                        compScope.empResponsibility = value;
                });
            });

            //Company Valuation Slider
            $('#valuation_slider')
                .ionRangeSlider({
                    min: 0,
                    max: 20000,
                    type: 'single',
                    from: 0,
                    step: 50,
                    prefix: '$',
                    grid: true,
                    prettify_separator: ',',
                    prettify: function (num) {
                        if(num>999) {
                            num = num/1000 + 'M';
                        } else {
                            num = num + 'K';
                        }
                        return num;
                    }
                })

                .on('change', function () {
                    var $this = $(this);
                    var value = $this.prop('value');

                    compScope.$apply(function(){
                        compScope.companyValuation = value;
                });
            });

            //Company Emp Count Slider
            $('#emp_count_slider')
                .ionRangeSlider({
                    min: 1,
                    max: 100,
                    type: 'single',
                    from: 0,
                    step: 1,
                    grid: true,
                    prettify: function (num) {
                        if(num==100) {
                            num = num + '+';
                        }
                        return num;
                    }
                })

                .on('change', function () {
                    var $this = $(this);
                    var value = $this.prop('value');

                    compScope.$apply(function(){
                        compScope.compCount = value;
                    });
                });

        });


    });