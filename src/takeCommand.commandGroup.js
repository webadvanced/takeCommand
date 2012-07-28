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
            //send event
        },
        register: function( key, options ) {
            //send event before
            var command = takeCommand.Command.init( key, options, this );
            this[key] = command;
            //send event after
            return command;
        }
    });

    return CommandGroup;
})( window.takeCommand, window.jQuery );