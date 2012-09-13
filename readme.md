#Take Command - jQuery Ajax Commands#

##What and Why##
Take Command is a wrapper for jQuery v1.4.3+ Ajax that allows you to easily define all your server side calls into one easy to manage object. Commands do not execute immediately, helping to organize your applications, Ajax calls, and their callback functions (success, error and always). When testing your JavaScript, you may not want to fire actual Ajax calls. takeCommand allows you to put your commands in test mode. You can set a flag to identify whether the Ajax call was a success or fail as well as provide mock response data.

#Using it ...#

##Create a command group##
The first thing you will need is a `CommandGroup`. `CommandGroup`s are what commands are assigned to and help structure your application code. You can have just one or many `CommandGroup`s, it all depends on your applications needs.

```javascript
var userCommands = takeCommand.CommandGroup.init('userCommands');
```

All CommandGroups registered with takeCommand will be stored in a hash located at `takeCommand.groups`.

```javascript
takeCommand.groups.userCommands
```

##Register a command##
Registering a command is simple. It takes a key (string) and a settings object that must contain a property for `url`. By default, the `type` will be set to `GET` and `dataType` will be set to `JSON`. For more information on available settings, checkout the jQuery docs here: http://api.jquery.com/jQuery.ajax/

```javascript
var createUserCommand = takeCommand.groups.userCommands.register( 'create', { url: '/users/create' } ); //creating a variable
userCommands.register( 'update', { url: '/users/update'} );
//If you only want to define the url or url and type, you can simply pass them as string literals as the second and third argument.
//userCommands.register( 'update', '/users/update' );
//userCommands.register( 'update', '/users/update', 'POST' );
```

If you are also using takeCommand to bind commands to dom elements (https://github.com/webadvanced/takeCommand#using-commands), you can pass the attribute name prefixed with a colon ( : ).

```html
<a href="/user/delete/5" class="userDelete">delete</a>
```

```javascript
//register
var command = userCommand.register( 'delete', ':href', 'POST' );

//bind
command.on( 'click', '.userDelete' );
//This will post the command to '/user/delete/5'
```

After you have created a command, it will accessible on the `commands` hash.

##Setting up callbacks for the command##
Once you have created a command, you can easily define the callback functions for it. The options are `.success`, `.error` and `.always`. You can also remove a callback binding at anytime by using the `.clear` function. You can register as many callback functions for each callback type as your like.

```javascript
//using the variable
createUserCommand.success( function() {
    alert( 'success 1!' );
}).success( function() {
    alert( 'success 2!' );
}).error( function() {
    alert('there was a problem');
}).always(function() {
    alert('this is always called after success or error is complete!');
});

//getting the reference to a specific command from the commands hash
userCommands.update.success( function() {
    alert( 'success!' );
});

//remove the error callback from the createUserCommand
createUserCommand.clear('error'); // will clear all callbacks for the `error` key
//reateUserCommand.clear(key, func) // will clear the specific callback function
```

##Using commands##
You can use the `.send` method of each command to send the Ajax request. Optionally pass an object that will be set as the data property of the jQuery Ajax settings object.
```javascript
//Manualy execute
createUserCommand.send( {name: 'Sarah Smith'} );

//Use as a callback
$('#addUserForm').submit(createUserCommand.send);

//Bind events to DOM elements from the object
userCommands.update.on('submit', '#formUpdate', function() {
    return $( this ).serialize(); //return the data to be passed into the Ajax call
});
//this will use (.delegate) and will call .preventDefault
```
If the selected element is a `form`, takeCommand will automaticly serialize the form and pass it as the settings.data. If you are using jQuery validation, it will also ensure the form is valid before sending the request. takeCommand will also disable/re-enable and add a class of `processing-btn` to the submit button. So the above code could be simplifed to:

```javascript
userCommands.update.on('submit', '#formUpdate');
//.on(event(s), selector [, parentSelector],[, dataHandler])
```

##How Take Command work with tests##
When testing your JavaScript, you may not want to fire actual Ajax calls. takeCommand allows you to put your all your commands in test mode or just specific CommandGroups. You can set a flag to identify whether the Ajax call was a success or fail as well as provide mock response data.
```javascript
//simulating a Jasmine test
when('Ajax call was successfull', function() {
	commands.testMode = true; //putting all commands into test mode
	//userCommands.testMode = true; //putting just commands registerd with userCommand in testMode
	createUserCommand.options.mock.wasSuccess = true; //signifying a successful Ajax request
	createUserCommand.options.mock.responseData = {message: 'User created successfully', userId: 7}; //the fake response data that would have come from the server

	...

	createUserCommand.send(); //will be a success and fire the success and always functions. It will also pass in the defined mock.responseData object to the callbacks
	
});
```