var app = angular.module('app', ['LocalStorageModule', 'ngAnimate', 'ui.bootstrap']);

app.config(['localStorageServiceProvider', function (localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('ls');
  }]);

app.controller('contactsCtrl', function ($scope, localStorageService, $uibModal){

	$scope.contacts = [
		{
		"Type" : "Executive",
		"Name" : "Ann Brown",
		"Title" : "CEO",
		"Phone" : "(512) 465-5555",
		"Ext." : "",
		"Fax" : "(512) 465-5555",
		"Email" : "Executive"
		},
		{
		"Type" : "Inmar AR",
		"Name" : "Mary Brown",
		"Title" : "CFO",
		"Phone" : "(512) 465-5555",
		"Ext." : "",
		"Fax" : "(512) 465-5555",
		"Email" : "Inmar AR"
		},
		{
		"Type" : "Executive",
		"Name" : "John Doe",
		"Title" : "CTO",
		"Phone" : "(512) 465-5555",
		"Ext." : "",
		"Fax" : "(512) 465-5555",
		"Email" : "Executive"
		},
		{
		"Type" : "Daily",
		"Name" : "James Frank",
		"Title" : "President",
		"Phone" : "(512) 465-5555",
		"Ext." : "",
		"Fax" : "(512) 465-5555",
		"Email" : "Daily"
		},
		{
		"Type" : "Other",
		"Name" : "Frank Lemon",
		"Title" : "Senior Vice President",
		"Phone" : "(512) 465-5555",
		"Ext." : "",
		"Fax" : "(512) 465-5555",
		"Email" : "Other"
		}
	];

  var storedContacts = localStorageService.get('contacts');

	$scope.contacts = storedContacts || [];

	$scope.$watch('contacts', function () {
	  localStorageService.set('contacts', $scope.contacts);
	}, true);

  $scope.deleteContact = function(contacts){
  	$scope.contacts = contacts.filter(function(contact){
  		if(!contact.selected) return contact;
  	});
  };

  $scope.isContactSelected = function(contacts){
  	return contacts.some(function(contact){
  		return contact.selected;
  	});
  };

  $scope.showForm = false;

  $scope.animationsEnabled = true;

  $scope.open = function (size) {

	    var modalInstance = $uibModal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'myModalContent.html',
	      controller: 'contactsCtrl',
	      size: size,
	      resolve: {
	        items: function () {
	          return $scope.items;
	        }
	      }
	    });
	};

	$scope.addContact = function(contact, $uibModal, $uibModalInstance){
	  	$scope.contacts.push(angular.copy(contact));
	  	delete $scope.contact;
	  	$modalInstance.close();
	};
});

app.filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + " (" + city + ") " + number).trim();
    };
});