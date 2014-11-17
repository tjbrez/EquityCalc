'use strict';

/**
 * @ngdoc function
 * @name equityCalcApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the equityCalcApp
 */
angular.module('equityCalcApp')

    .controller('MainCtrl', function ($scope, $location, externalAPIs) {

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

        var empLocationAndLocationID =
        {
            'Atlanta': 1616,
            'Cleveland': 1630,
            'Los Angeles': 1653,
            'New York': 1664,
            'San Francisco': 1692,
            'Washington, DC':1691

        };

        var companyMarket =
        {


        };


        var empPreferences = [
            'No Preference',
            'Salary',
            'Equity'
        ];

        //var empRoles = Object.keys(empRolesAndSalaries).map(function(k) { return k; });
        var empLocations = Object.keys(empLocationAndLocationID).map(function(k) { return k; });

        //DEFAULT VALUES
        $scope.startupSalaryMultiplier = 0.75;
        $scope.empPreferenceSalBonus = 0;
        $scope.empPreferenceEquityMultiplier = 1;
        //$scope.empExperienceSalMultiplier = 1;
        //$scope.empRoles = empRoles;
        //$scope.empRole = empRoles[0];
        $scope.empLocations = empLocations;
        $scope.empLocation = empLocations[0];
        $scope.empRoleSalary = empRolesAndSalaries[$scope.empRole];
        $scope.startupEquityBase = $scope.empRoleSalary/100000;
        $scope.empStartupSalary =  $scope.empRoleSalary * $scope.startupSalaryMultiplier;
        $scope.empPreferences = empPreferences;
        $scope.empPreference = empPreferences[0];
        $scope.angellistDataJobsFiltered = [];


        //function used for loading angellist data
        var loadAngelListData = function(pEmpLocation){
            var loc = empLocationAndLocationID[pEmpLocation];
            var url = 'https://api.angel.co/1/tags/' + loc + '/jobs' + '?callback=JSON_CALLBACK';
            $scope.angellistDataSatus = 'Loading Jobs..';
            $scope.empRoles = [];
            $scope.empRole = 'Loading...';
            $scope.markets = [];
                $scope.market = 'Loading...';
            externalAPIs.getAngelListData(url)
                .then(function(response){

                    $scope.angellistDataLastPage = response.data.last_page;
                    $scope.angellistDataTotal = response.data.total;
                    $scope.angellistDataPage = response.data.page;
                    $scope.angellistDataJobs = response.data.jobs;
                    //console.log($scope.angellistDataLastPage);

                    //Loop through additional pages of job data from AngelList API
                    for (var i = 2; i <= $scope.angellistDataLastPage; i++){
                        //console.log('total pages more than 1: ' + response.data.last_page);
                        url = 'https://api.angel.co/1/tags/' + loc + '/jobs?page=' + i + '&callback=JSON_CALLBACK';
                        externalAPIs.getAngelListData(url)
                            .then(function(response){
                                $scope.angellistDataPage = response.data.page;
                                $scope.angellistDataJobs = $scope.angellistDataJobs.concat(response.data.jobs);

                                if(response.data.page == response.data.last_page){
                                    $scope.angellistDataSatus = 'All Jobs Loaded';

                                    //$scope.empRoles =
                                    for (var job in $scope.angellistDataJobs){
                                        //console.log($scope.angellistDataJobs[job].salary_max);
                                        for(var tag in $scope.angellistDataJobs[job].tags){
                                            //console.log($scope.angellistDataJobs[job].tags[tag].tag_type);
                                            if($scope.angellistDataJobs[job].tags[tag].tag_type == 'RoleTag'){
                                                //push only unique roles
                                                if ($scope.empRoles.indexOf($scope.angellistDataJobs[job].tags[tag].display_name) == -1){
                                                    $scope.empRoles.push($scope.angellistDataJobs[job].tags[tag].display_name);
                                                }
                                                $scope.empRole = $scope.empRoles[0];
                                            }
                                        }
                                    }
                                    $scope.setJobRole($scope.empRole);
                                }

                            });
                    }

                    if ($scope.angellistDataLastPage == 1){
                        $scope.angellistDataSatus = 'All Jobs Loaded';

                        //$scope.empRoles =
                        for (var job in $scope.angellistDataJobs){
                            //console.log($scope.angellistDataJobs[job].salary_max);
                            for(var tag in $scope.angellistDataJobs[job].tags){
                                //console.log($scope.angellistDataJobs[job].tags[tag].tag_type);
                                if($scope.angellistDataJobs[job].tags[tag].tag_type == 'RoleTag'){
                                    //push only unique roles
                                    if ($scope.empRoles.indexOf($scope.angellistDataJobs[job].tags[tag].display_name) == -1){
                                        $scope.empRoles.push($scope.angellistDataJobs[job].tags[tag].display_name);
                                    }
                                    $scope.empRole = $scope.empRoles[0];
                                }
                            }
                        }
                        $scope.setJobRole($scope.empRole);
                    }
                });
        }

        $scope.setJobRole = function(pEmpRole) {
            $scope.empRole = pEmpRole;
            $scope.empRoleSalary = empRolesAndSalaries[pEmpRole];
            $scope.startupEquityBase = $scope.empRoleMarketSalary/100000;

            //Filter job list for by Role
            $scope.angellistDataJobsFiltered = [];
            for (var job in $scope.angellistDataJobs){
                for(var tag in $scope.angellistDataJobs[job].tags){
                    if($scope.angellistDataJobs[job].tags[tag].tag_type == 'RoleTag' &&
                        $scope.angellistDataJobs[job].tags[tag].display_name == pEmpRole){
                        $scope.angellistDataJobsFiltered.push($scope.angellistDataJobs[job]);
                    }
                }
            }

            //Calculate average salary
            var salaryCount = 0;
            var salaryTotal = 0;
            for (var job in $scope.angellistDataJobsFiltered){
                //make sure it's a real salary figure and not 0
                if ($scope.angellistDataJobsFiltered[job].salary_min > 0 &&
                    $scope.angellistDataJobsFiltered[job].salary_max > 0) {
                    salaryTotal = salaryTotal + $scope.angellistDataJobsFiltered[job].salary_min
                         + $scope.angellistDataJobsFiltered[job].salary_max;
                    salaryCount = salaryCount + 2;
                }
            }
            $scope.empRoleSalary = salaryTotal / salaryCount;

            //Calculate average equity
            var equityCount = 0;
            var equityTotal = 0.0;
            for (var job in $scope.angellistDataJobsFiltered){
                //make sure it's a real salary figure and not 0
                if ($scope.angellistDataJobsFiltered[job].salary_min > 0 &&
                    $scope.angellistDataJobsFiltered[job].salary_max > 0 &&
                    $scope.angellistDataJobsFiltered[job].equity_min != null &&
                    $scope.angellistDataJobsFiltered[job].equity_max != null ) {
                    equityTotal = equityTotal + parseFloat($scope.angellistDataJobsFiltered[job].equity_min)
                        + parseFloat($scope.angellistDataJobsFiltered[job].equity_max);
                    console.log($scope.angellistDataJobsFiltered[job].equity_min + '   ' + $scope.angellistDataJobsFiltered[job].equity_max);
                    equityCount = equityCount + 2;
                }
            }
            $scope.empRoleEquity = equityTotal / equityCount;


        };

        $scope.setLocation= function(pEmpLocation) {
            $scope.empLocation = pEmpLocation;

            //Load AngelList Job Data
            loadAngelListData(pEmpLocation);
        };
        $scope.setLocation($scope.empLocation);

        $scope.setEmpPreference = function(pEmpPreference) {
            $scope.empPreference = pEmpPreference;
            if ( pEmpPreference == 'No Preference'){
                $scope.empPreferenceSalBonus = 0;
                $scope.empPreferenceEquityMultiplier = 1;
            } else if ( pEmpPreference == 'Salary'){
                $scope.empPreferenceSalBonus = 10000;
                $scope.empPreferenceEquityMultiplier = 0.7;
            } else if ( pEmpPreference == 'Equity'){
                $scope.empPreferenceSalBonus = -10000;
                $scope.empPreferenceEquityMultiplier = 1.3;
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


            //Company Projected Valuation Slider
            $('#projected_valuation_slider')
                .ionRangeSlider({
                    min: 1,
                    max: 500,
                    type: 'single',
                    from: 0,
                    step: 1,
                    prefix: '$',
                    grid: true,
                    prettify_separator: ',',
                    prettify: function (num) {
                        num = num + 'M';
                        return num;
                    }
                })

                .on('change', function () {
                    var $this = $(this);
                    var value = $this.prop('value');

                    compScope.$apply(function(){
                        compScope.companyProjectedValuation = value;
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
                            compScope.riskLayerDenominator = 0.6;
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

            $('.additionalInputHeader').click(function () {

                var $header = $(this);
                //getting the next element
                var $content = $header.next();
                //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
                $content.slideToggle(500, function () {
                    //execute this after slideToggle is done
                    //change text of header based on visibility of content div
                    $header.text(function () {
                        //change text based on condition
                        return $content.is(":visible") ? "Collapse" : "Expand";
                    });
                });

            });

        });


    });
