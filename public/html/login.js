/**
 * Created by dantegg on 16-9-1.
 */

var app = angular.module('loginApp',[]);
app.controller('loginControl',function ($scope,$http) {
    $scope.login = function () {
        //console.log($scope.user.userName)
        //console.log($scope.user.password)
        $http({
            method:'post',
            url:'/login/user',
            data:{
                username:$scope.user.userName,
                userpass:$scope.user.password
            }
        }).success(function (res) {
            if(res.success === true){
                console.log(res)
                window.location.href="./email"
            }
        })
    }
})