angular.module('microAzureBlog', [])
	.controller('blogpostController', function ($scope, $http) {
		
		$scope.model = {
			// posts: [
			// 	{
			// 	title: "Sample Title",
			// 	text: "Sample Text"
			// 	},
			// 	{
			// 	title: "Sample Title 2",
			// 	text: "Sample Text 2"
			// 	}
			// ]
		};

		$http.get('https://yourmobileservice.azure-mobile.net/tables/posts').success(function(data) {
			$scope.model.posts = data;
		});
	});