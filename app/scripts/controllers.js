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

        var empLocationAndLocationID =
        {
            'Atlanta': 1616,
            'Austin': 1617,
            'Boston': 1620,
            'Chicago': 1626,
            'Cleveland': 1630,
            'Houston': 1645,
            'London': 1695,
            'Los Angeles': 1653,
            'New York': 1664,
            'Paris': 1842,
            'San Francisco': 1692,
            'San Jose': 1693,
            'Seattle': 1680,
            'Toronto': 1702,
            'Vancouver': 1698,
            'Washington, DC':1691

        };

        var empPreferences = [
            'No Preference',
            'Salary',
            'Equity'
        ];

        var employeeCountList = [
            '1-3',
            '4-8',
            '9-15',
            '16-30',
            '30-50',
            '50-100',
            '100+'

        ];

        var empLocations = Object.keys(empLocationAndLocationID).map(function(k) { return k; });

        //DEFAULT VALUES
        $scope.startupSalaryMultiplier = 0.75;
        $scope.empPreferenceSalBonus = 0;
        $scope.empPreferenceEquityMultiplier = 1;
        $scope.empLocations = empLocations;
        $scope.empLocation = empLocations[0];
        $scope.empPreferences = empPreferences;
        $scope.empPreference = empPreferences[0];
        $scope.angellistDataJobs = [];
        $scope.angellistDataJobsFiltered = [];
        $scope.currentValuation = 1000000;
        $scope.projectedValuation = 10000000;
        $scope.riskLayerDenominator = 0.8;
        $scope.employeeCountList = employeeCountList;
        $scope.employeeCount = employeeCountList[0];


        //function used for loading angellist data
        var loadAngelListData = function(pEmpLocation){
            var loc = empLocationAndLocationID[pEmpLocation];
            var url = 'https://api.angel.co/1/tags/' + loc + '/jobs' + '?callback=JSON_CALLBACK';
            $scope.angellistDataStatus = 'Loading Jobs...';
            $scope.empRoles = [];
            $scope.empRole = 'Loading...';
            $scope.angellistDataJobs = [];

            externalAPIs.getAngelListData(url)
                .then(function(response){

                    $scope.angellistDataLastPage = response.data.last_page;
                    $scope.angellistDataTotal = response.data.total;
                    $scope.angellistDataPage = response.data.page;
                    $scope.angellistDataJobs = $scope.angellistDataJobs.concat(response.data.jobs);


                    //Loop through additional pages of job data from AngelList API
                    for (var i = 2; i <= $scope.angellistDataLastPage; i++){
                        //console.log('total pages more than 1: ' + response.data.last_page);
                        url = 'https://api.angel.co/1/tags/' + loc + '/jobs?page=' + i + '&callback=JSON_CALLBACK';
                        externalAPIs.getAngelListData(url)
                            .then(function(response){
                                $scope.angellistDataPage = response.data.page;
                                $scope.angellistDataJobs = $scope.angellistDataJobs.concat(response.data.jobs);

                                if(response.data.page == response.data.last_page){
                                    $scope.angellistDataStatus = '';

                                    for (var job in $scope.angellistDataJobs){
                                        for(var tag in $scope.angellistDataJobs[job].tags){
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
                        $scope.angellistDataStatus = '';

                        for (var job in $scope.angellistDataJobs){
                            for(var tag in $scope.angellistDataJobs[job].tags){
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
            if(salaryCount < 20){
                $scope.warningMsg = ' (Warning: Sample size is less than 10 jobs)';
            } else {
                $scope.warningMsg = '';
            }

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

        $scope.setEmployeeCount = function(pEmployeeCount) {
            $scope.employeeCount = pEmployeeCount;

            if ( pEmployeeCount == '1-3'){
                $scope.riskLayerDenominator = 0.8;
            } else if ( pEmployeeCount == '4-8'){
                $scope.riskLayerDenominator = 1;
            } else if ( pEmployeeCount == '9-15'){
                $scope.riskLayerDenominator = 1.5;
            } else if ( pEmployeeCount == '16-29'){
                $scope.riskLayerDenominator = 4;
            } else if ( pEmployeeCount == '30-49'){
                $scope.riskLayerDenominator = 10;
            } else if ( pEmployeeCount == '50-99'){
                $scope.riskLayerDenominator = 20;
            } else if ( pEmployeeCount == '100+'){
                $scope.riskLayerDenominator = 40;
            }
        };


        ////////////////////
        //JQUERY COMPONENTS
        ////////////////////
        $(document).ready(function(){
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
