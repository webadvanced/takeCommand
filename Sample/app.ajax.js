/*
	please note this is just sample code that DOES NOT WORK. It is just to demo using takeCommand.
*/

//register command groups and commands
(function( takeCommand ) {

	//user commands
	var userCommands = takeCommand.CommandGroup.init( 'userCommands' );
	userCommands.register( 'create', '/uesrs/create', 'Post' );
	userCommands.register( 'update', '/uesrs/update', 'Post' );
	userCommands.register( 'delete', '/uesrs/delete', 'Post' );

	//task commands
	var taskCommands = takeCommand.CommandGroup.init( 'taskCommands' );
	taskCommands.register( 'create', '/tasks/create', 'Post' );
	taskCommands.register( 'update', '/tasks/update', 'Post' );
	taskCommands.register( 'delete', '/tasks/delete', 'Post' );

})( window.takeCommand );