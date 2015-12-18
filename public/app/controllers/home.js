angular.module('eureka.home', [])

.controller('HomeController', ['$scope', '$http', '$window', '$location', 'Data', 'Auth' ,function($scope, $http, $window, $location, Data, Auth) {
	// Checking If User Has Cookie
	if (!Auth.isAuth()) $location.path('/login')

	// Enables user to signout
	$scope.signout = function () { Auth.signout() };

	// For the add link pop-up modal
	$scope.modalShow = false;
	$scope.changeModal = function() {
		console.log('changing modal...')
		if ($scope.modalShow === false) {
			$scope.modalShow = true;
		} else {
			$scope.modalShow = false;
		}
	}

	// data being temporarily stored
	$scope.username = JSON.parse($window.localStorage.getItem('eureka')).username;
	$scope.token = JSON.parse($window.localStorage.getItem('eureka')).token;
	$scope.links = undefined; // will be defined once 'getLinks' is run
	$scope.allLinks = undefined; // will be defined once 'getLinks' is run
	$scope.searchValue = Data.searchValue; // defined when 'search' is run


	$scope.getLinks = function () {
		console.log('getting links...');
		$http({
			method: 'GET',
			url: '/api/links'
		}).then(function (res) {
			for (var prop in res.data.links) {
				var array = res.data.links[prop].date.split('T');
				date = array[0].split('-');
				res.data.links[prop].date = date;
			}
			$scope.links = res.data.links;
			var results = [];
			for (var prop in $scope.links) {
				results = results.concat($scope.links[prop].links)
			}
			$scope.allLinks = results;
			console.log($scope.links)
			return res.data;
		}).catch(function (error) {
			console.log(error);
		})
	}

	$scope.submitLink = function(link) {
		console.log('submitting link...', link)
		var data = {};
		data.url = link;
		data.username = Data.username;
		console.log(data)
		$http({
			method: 'POST',
			url: '/api/links',
			headers: {'Authorization': Data.token },
			data: data
		}).then(function (res) {
			console.log('success...link added')
			$scope.getLinks();
			return res.data;
		}).catch(function (error) {
			console.log(error);
		})
		$scope.addLink.$setPristine();
		$scope.newLink = "";
		$scope.changeModal();
	}

	$scope.search = function(searchText) {
		Data.searchValue = searchText;
		$location.path('/search')
	}

	// Get Link Information When Controller Loads
	$scope.getLinks()

}]);





