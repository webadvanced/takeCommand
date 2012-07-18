#jQuery Ajax Wrapper#

```javascript

var addUserCommand = commands.register( 'addUserCommand', { url: '/users/add' } );

addUserCommand.success( function() {
    alert('success!');
}).error( function() {
    alert('there was a problem');
}).always(function() {
    //clear form fields
});

//Manualy execute
commands.execute.addUserCommand();

//Use as a callback
$('#addUserForm').submit(commands.execute.addUserCommand);

```