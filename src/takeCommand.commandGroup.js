takeCommand.CommandGroup = ( function( takeCommand, $ ) {
    "use strict";
    var CommandGroup = takeCommand.Module.base( takeCommand.Events );
    CommandGroup.include({
        init: function( key ) {
            this.key = key;
            takeCommand.groups[key] = this;
        },
        initialized: function() {
            //send event
        },
        register: function( key, options ) {
            //send event before
            var command = takeCommand.Command.init( key, options );
            this[key] = command;
            command.group = this;
            //send event after
            return command;
        }
    });

    CommandGroup.extend({
        testMode: false
    });

    return CommandGroup;
})( takeCommand, jQuery );