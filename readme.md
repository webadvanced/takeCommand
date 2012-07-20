#jQuery Ajax Commands#


##Register a command##
Registering a command is simple. It takes a key (string) and a settings object that must contain a property for `url`. By default, the `type` will be set to `GET` and `dataType` will be set to `JSON`. For more information on available settings, checkout the jQuery docs here: http://api.jquery.com/jQuery.ajax/

```javascript
var addUserCommand = commands.register( 'addUserCommand', { url: '/users/add' } ); //creating a variable
commands.register(  'updateUserCommand', { url: '/users/update '} );
```
After you have created a command, it will accessible on the `commands` hash.

##Setting up callbacks for the command##
Once you have created a command, you can easily define the callback functions for it. The options are `.success`, `.error` and `.always`. You can also remove a callback binding at anytime by using the `.clearCallback` function.

```javascript
//using the variable
addUserCommand.success( function() {
    alert( 'success!' );
}).error( function() {
    alert('there was a problem');
}).always(function() {
    //clear form fields
});

//getting the reference to the commands from the commands hash
commands.updateUserCommand.success( function() {
    alert( 'success!' );
});

//remove the error callback from the addUserCommand
addUserCommand.clearCallback('error');
```
After a callback has been cleared, you can re-bind a different callback.

##Using commands##
You can use the `.send` or `.execute` methods of each command to send the Ajax request. Optionally pass an object that will be set as the data property of the jQuery Ajax settings object.
```javascript
//Manualy execute
addUserCommand.send( {name: 'Sarah Smith'} );

//Use as a callback
$('#addUserForm').submit(addUserCommand.execute);

//Bind events to DOM elements from the object
commands.updateUserCommand.bind('#formUpdate', 'submit', function() {
    return $( this ).serialize(); //return the data to be passed into the Ajax call
});
//this will use .on (.delegate) and will call .preventDefault
```

##How commands work with tests##
When testing your JavaScript, you may not want to fire actual Ajax calls. takeCommand allows you to put your commands in test mode. You can set a flag to identify whether the Ajax call was a success or fail as well as provide mock response data.
```javascript
//simulating a Jasmine test
when('Ajax call was successfull', function() {
	commands.testMode = true; //putting commands into test mode
	addUserCommand.options.mock.wasSuccess = true; //signifying a successful Ajax request
	addUserCommand.options.mock.data = {message: 'User created successfully', userId: 7}; //the fake response data that would have come from the server

	...
	
});
```
##Using takeCommand with signals##
takeCommand can be used with signals to automatically enable pubsub event binding and triggering. This requires signals.js (https://github.com/webadvanced/signals.js) but will keep apps more loosely coupled.

```javascript
//tell takeCommand you want to use signals
commands.useSignals = true;

//setup your user functions
var user = (function( $ ) {
	var _user = {};
	_user.addToList = function( user ) {
		var $li = $('<li />', {
			text: user.fullName + ' (' + user.age + ')')
			id: user.id
		});
		$('#userList').append($li);
	};
	_user.remove = function( user ) {
		$('#' + user.id).fadeOut('fast', function() {
			$(this).remove();
		});
	};
	signals.subscribe('userCreateCommand:success', user.addToList);
	return _user;
})( jQuery, signals );

//setup your commands
(function( commands ) {
	commands.register('userCreateCommand', { url: '/users/add' });
	//success => signals.broadcast('userCreateCommand:success')
	//error => signals.broadcast('userCreateCommand:error')
	//always => signals.broadcast('userCreateCommand:always')
})( commands );


$(function() {
	$('#userCreateForm').submit(commands.userCreateComand.send);
});
```