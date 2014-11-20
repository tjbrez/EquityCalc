"use strict";angular.module("equityCalcApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",service:"externalAPIs"}).when("/about",{templateUrl:"views/about.html"}).otherwise({redirectTo:"/"})}]),angular.module("equityCalcApp").service("externalAPIs",["$http",function(a){this.getAngelListData=function(b){var c=a.jsonp(b).success(function(){}).error(function(){});return c}}]),angular.module("equityCalcApp").controller("MainCtrl",["$scope","$location","externalAPIs",function(a,b,c){a.isActive=function(a){return a===b.path()};var d={Atlanta:1616,Austin:1617,Boston:1620,Chicago:1626,Cleveland:1630,Houston:1645,London:1695,"Los Angeles":1653,"New York":1664,Paris:1842,"San Francisco":1692,"San Jose":1693,Seattle:1680,Toronto:1702,Vancouver:1698,"Washington, DC":1691},e=["No Preference","Salary","Equity"],f=["1-3","4-8","9-15","16-30","31-50","51-100","101+"],g=Object.keys(d).map(function(a){return a});a.startupSalaryMultiplier=.75,a.empPreferenceSalBonus=0,a.empPreferenceEquityMultiplier=1,a.empLocations=g,a.empLocation=g[0],a.empPreferences=e,a.empPreference=e[0],a.angellistDataJobs=[],a.angellistDataJobsFiltered=[],a.currentValuation=1e6,a.projectedValuation=1e7,a.riskLayerDenominator=.8,a.employeeCountList=f,a.employeeCount=f[0];var h=function(b){var e=d[b],f="https://api.angel.co/1/tags/"+e+"/jobs?callback=JSON_CALLBACK";a.angellistDataStatus="Loading Jobs...",a.empRoles=[],a.empRole="Loading...",a.angellistDataJobs=[],c.getAngelListData(f).then(function(b){a.angellistDataLastPage=b.data.last_page,a.angellistDataTotal=b.data.total,a.angellistDataPage=b.data.page,a.angellistDataJobs=a.angellistDataJobs.concat(b.data.jobs);for(var d=2;d<=a.angellistDataLastPage;d++)f="https://api.angel.co/1/tags/"+e+"/jobs?page="+d+"&callback=JSON_CALLBACK",c.getAngelListData(f).then(function(b){if(a.angellistDataPage=b.data.page,a.angellistDataJobs=a.angellistDataJobs.concat(b.data.jobs),b.data.page==b.data.last_page){a.angellistDataStatus="";for(var c in a.angellistDataJobs)for(var d in a.angellistDataJobs[c].tags)"RoleTag"==a.angellistDataJobs[c].tags[d].tag_type&&(-1==a.empRoles.indexOf(a.angellistDataJobs[c].tags[d].display_name)&&a.empRoles.push(a.angellistDataJobs[c].tags[d].display_name),a.empRole=a.empRoles[0]);a.setJobRole(a.empRole)}});if(1==a.angellistDataLastPage){a.angellistDataStatus="";for(var g in a.angellistDataJobs)for(var h in a.angellistDataJobs[g].tags)"RoleTag"==a.angellistDataJobs[g].tags[h].tag_type&&(-1==a.empRoles.indexOf(a.angellistDataJobs[g].tags[h].display_name)&&a.empRoles.push(a.angellistDataJobs[g].tags[h].display_name),a.empRole=a.empRoles[0]);a.setJobRole(a.empRole)}})};a.setJobRole=function(b){a.empRole=b,a.angellistDataJobsFiltered=[];for(var c in a.angellistDataJobs)for(var d in a.angellistDataJobs[c].tags)"RoleTag"==a.angellistDataJobs[c].tags[d].tag_type&&a.angellistDataJobs[c].tags[d].display_name==b&&a.angellistDataJobsFiltered.push(a.angellistDataJobs[c]);var e=0,f=0;for(var c in a.angellistDataJobsFiltered)a.angellistDataJobsFiltered[c].salary_min>0&&a.angellistDataJobsFiltered[c].salary_max>0&&(f=f+a.angellistDataJobsFiltered[c].salary_min+a.angellistDataJobsFiltered[c].salary_max,e+=2);a.empRoleSalary=f/e,a.warningMsg=20>e?" (Warning: Sample size is less than 10 jobs)":"";var g=0,h=0;for(var c in a.angellistDataJobsFiltered)a.angellistDataJobsFiltered[c].salary_min>0&&a.angellistDataJobsFiltered[c].salary_max>0&&null!=a.angellistDataJobsFiltered[c].equity_min&&null!=a.angellistDataJobsFiltered[c].equity_max&&(h=h+parseFloat(a.angellistDataJobsFiltered[c].equity_min)+parseFloat(a.angellistDataJobsFiltered[c].equity_max),g+=2);a.empRoleEquity=h/g},a.setLocation=function(b){a.empLocation=b,h(b)},a.setLocation(a.empLocation),a.setEmpPreference=function(b){a.empPreference=b,"No Preference"==b?(a.empPreferenceSalBonus=0,a.empPreferenceEquityMultiplier=1):"Salary"==b?(a.empPreferenceSalBonus=1e4,a.empPreferenceEquityMultiplier=.7):"Equity"==b&&(a.empPreferenceSalBonus=-1e4,a.empPreferenceEquityMultiplier=1.3)},a.setEmployeeCount=function(b){a.employeeCount=b,"1-3"==b?a.riskLayerDenominator=.8:"4-8"==b?a.riskLayerDenominator=1:"9-15"==b?a.riskLayerDenominator=1.5:"16-30"==b?a.riskLayerDenominator=4:"31-50"==b?a.riskLayerDenominator=10:"51-100"==b?a.riskLayerDenominator=20:"101+"==b&&(a.riskLayerDenominator=40)},$(document).ready(function(){$(".additionalInputHeader").click(function(){var a=$(this),b=a.next();b.slideToggle(500,function(){a.text(function(){return b.is(":visible")?"Collapse":"Expand"})})})})}]);