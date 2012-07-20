#jQuery Ajax Commands#


##Register a command##
Registering a command is simple, it takes a key (string) and a settings object that must contain a property for `url`. By default, the `type` will be set to `GET` and `dataType` will be set to `JSON`. For more information on available settings, checkout the jQuery docs here: http://api.jquery.com/jQuery.ajax/

```javascript
var addUserCommand = commands.register( 'addUserCommand', { url: '/users/add' } ); //creating a variable
commands.register(  'updateUserCommand', { url: '/users/update '} );
```
After you have created a command, it will accessible on the `commands` hash.

##Setting up callbacks for the command##
Once you have created a command, you can easily define the callback functions for it. The options are `.success`, `.error` and `.always`. You can also at anytime remove a callback binding by using the `.clearCallback` function

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
after a callback has been cleared, you can re-bind a different callback.

##Using commands##
You can use the `.send` or `.execute` methods off each command and optionally pass a data object that will be set as the data property on the jQuery Ajax settings object
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
When testing your JavaScript you may not want to fire actual Ajax calls. takeCommand allows you to put your commands in test mode and supply a bool identifying if the Ajax call was a success or fail as well as provide mock response data.
```javascript
//simulating a Jasmine test
when('Ajax call was successfull', function() {
	commands.testMode = true; //putting commands into test mode
	addUserCommand.options.mock.wasSuccess = true;
	addUserCommand.options.mock.data = {message: 'User created successfully', userId: 7};

	...
	
});
```
