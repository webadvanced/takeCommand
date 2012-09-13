/*
	please note this is just sample code that DOES NOT WORK. It is just to demo using takeCommand.
*/

(function ( $, userCommands ) {

	var add,
		remove,
		update,
		notify,
		buildListItemText,
		$userList = $( '#users' );

	add = function( data ) {
		var $li = $( '<li />', { 
				text: buildListItemText( data.user ),
				id = data.user.id
			});
		$userList.append( $li );
	};

	remove = function() {
		$( this ).closest( 'li' ).remove();
	};

	update = function( data ) {
		$( '#' + data.user.id ).text( buildListItemText( data.user ) );
	};

	notify = function( data ) {
		alter( data.message );
	};

	buildListItemText = function( user ) {
		return user.fullName + ' <a href="#delete" class="delete" data-id="' + user.id + '">delete</a>';
	};

	//bind callbacks to commands
	userCommands.create.success( add ).success( notify );
	userCommands.update.success( update ).success( notify );
	userCommands.delete.success( remove ).success( notify );

	$(function() {
		//bind commands to dom elements
		userCommands.create.on( 'submit', '#createForm' );
		userCommands.update.on( 'submit', '#updateForm' );
		userCommands.delete.on( 'click', '.delete', function() {
			//json send to server
			return { id: $( this ).data( 'id' ) };
		});
	});


})( window.jQuery, window.takeCommand.groups.userCommands );