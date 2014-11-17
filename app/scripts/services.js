'use strict';

/**
 * Created by thomasbreslin on 11/13/14.
 */


angular.module('equityCalcApp')

    .service('externalAPIs', function($http) {
        this.getAngelListData = function(url) {

            var result = $http.jsonp(url)
                .success(function(data){

                })
                .error(function (e) {

                });

            return result;


        };



    });