#jQuery Ajax Wrapper#

```javascript

var addUserCommand = commands.register( 'addUserCommand', { url: '/users/add' } );
//or
commands.register('updateUserCommand', { url: '/users/update '});

addUserCommand.success( function() {
    alert( 'success!' );
}).error( function() {
    alert('there was a problem');
}).always(function() {
    //clear form fields
});

commands.updateUserCommand.success( function() {
    alert( 'success!' );
});

//Manualy execute
commands.addUserCommand.execute();

//Use as a callback
$('#addUserForm').submit(commands.execute.addUserCommand);
commands.updateUserCommand.bind('#formUpdate', 'submit', function() {
    return $( this ).serialize(); //return the data to be passed into the Ajax call
});

```