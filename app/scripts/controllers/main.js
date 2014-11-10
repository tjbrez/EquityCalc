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

        var empRolesAndSalaries =
            {
                'Software Engineer': 80000,
                'Designer': 50000,
                'Business Development Rep': 60000,
                'Market Research Analyst': 45000,
                'Content Creator': 40000,
                'Data Scientist': 70000,
                'Mobile Developer': 55000
            };


        var empPreferences = [
            'No Preference',
            'Salary',
            'Equity'
        ];

        var empRoles = Object.keys(empRolesAndSalaries).map(function(k) { return k; });

        //DEAFAULT VALUES
        $scope.startupSalaryMultiplier = 0.5;
        $scope.empPreferenceSalBonus = 0;
        $scope.empPreferenceEquityMultiplier = 1;
        //$scope.empExperienceSalMultiplier = 1;
        $scope.empRoles = empRoles;
        $scope.empRole = empRoles[0];
        $scope.empRoleMarketSalary = empRolesAndSalaries[$scope.empRole];
        $scope.startupEquityBase = $scope.empRoleMarketSalary/100000;
        $scope.empStartupSalary =  $scope.empRoleMarketSalary * $scope.startupSalaryMultiplier;
        $scope.empPreferences = empPreferences;
        $scope.empPreference = empPreferences[0];

        $scope.setJobRole = function(pEmpRole) {
            $scope.empRole = pEmpRole;
            $scope.empRoleMarketSalary = empRolesAndSalaries[pEmpRole];
            $scope.startupEquityBase = $scope.empRoleMarketSalary/100000;
        };

        $scope.setEmpPreference = function(pEmpPreference) {
            $scope.empPreference = pEmpPreference;
            if ( pEmpPreference == 'No Preference'){
                $scope.empPreferenceSalBonus = 0;
                $scope.empPreferenceEquityMultiplier = 1;
            } else if ( pEmpPreference == 'Salary'){
                $scope.empPreferenceSalBonus = 8000;
                $scope.empPreferenceEquityMultiplier = 0.8;
            } else if ( pEmpPreference == 'Equity'){
                $scope.empPreferenceSalBonus = -8000;
                $scope.empPreferenceEquityMultiplier = 1.2;
            }
        };

        $scope.setMarketSalary = function(pEmpPreference) {
            $scope.empPreference = pEmpPreference;
        };





        ////////////////////
        //JQUERY COMPONENTS
        ////////////////////
        $(document).ready(function(){

            var compScope = $('#compSection').scope();

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

                        if (value == 'Rookie'){
                            compScope.empExperienceSalMultiplier = 1;
                            compScope.empExperienceEquityBonus= 0;
                        } else if (value == 'Skilled'){
                            compScope.empExperienceSalMultiplier = 1.1;
                            compScope.empExperienceEquityBonus= 0.1;
                        } else if (value == 'Expert'){
                            compScope.empExperienceSalMultiplier = 1.2;
                            compScope.empExperienceEquityBonus= 0.2;
                        }
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

                        if (value == 'N/A'){
                            compScope.empResponsibilitySalMultiplier = 1;
                            compScope.empResponsibilityEquityBonus = 0;
                        } else if (value == 'Lead'){
                            compScope.empResponsibilitySalMultiplier = 1.1;
                            compScope.empResponsibilityEquityBonus = 0.1;
                        } else if (value == 'Manager'){
                            compScope.empResponsibilitySalMultiplier = 1.2;
                            compScope.empResponsibilityEquityBonus = 0.2;
                        } else if (value == 'Director'){
                            compScope.empResponsibilitySalMultiplier = 1.5;
                            compScope.empResponsibilityEquityBonus = 0.3;
                        } else if (value == 'Executive'){
                            compScope.empResponsibilitySalMultiplier = 2;
                            compScope.empResponsibilityEquityBonus = 0.4;
                        }
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

                        if (value <= 3){
                            compScope.riskLayerDenominator = .6;
                        } else if (value > 3 && value <= 7){
                            compScope.riskLayerDenominator = 1;
                        } else if (value > 7 && value <= 15){
                            compScope.riskLayerDenominator = 2;
                        } else if (value > 16 && value <= 30){
                            compScope.riskLayerDenominator = 6;
                        } else if (value > 30 && value <= 99){
                            compScope.riskLayerDenominator = 15;
                        } else if (value > 99){
                            compScope.riskLayerDenominator = 30;
                        }
                    });
                });

        });


    });