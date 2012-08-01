window.takeCommand.CommandGroup = ( function( takeCommand, $ ) {
    "use strict";
    var CommandGroup = takeCommand.Module.base( takeCommand.Events );
    CommandGroup.include({
        testMode: false,
        init: function( key ) {
            this.key = key;
            takeCommand.groups[key] = this;
        },
        initialized: function() {
            this.publish( 'initialized' );
        },
        register: function( key, options ) {
            this.publish( key + ':beforeregister' );
            this.publish( 'beforeregister' );
            var command = takeCommand.Command.init( key, options, this );
            this[key] = command;
            this.publish( key + ':afterregister', command );
            this.publish( 'afterregister' );
            return command;
        }
    });
    
    return CommandGroup;
})( window.takeCommand, window.jQuery );