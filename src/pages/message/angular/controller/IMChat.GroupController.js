angular.module("IMChat.Group.Controller", [])


.controller("groupController", ["$scope", "$state", function($scope, $state) {

	$scope.goToMessage_group = function(item, e) {
		e.preventDefault();
		e.stopPropagation();
		$state.go("imhome.message", {
			personId: item.id.toLowerCase(),
			personName: item.name,
			chatType: 'groupchat'
		});
	};

}])
