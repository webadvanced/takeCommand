takeCommand.CommandGroup = ( function( takeCommand, $ ) {
    "use strict";
    var CommandGroup = takeCommand.Module.base( takeCommand.Events );
    CommandGroup.include({
        testMode: false,
        useSignals: false,
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
            if( this.useSignals || takeCommand.useSignals ) {
                command.success(signals.proxy(key + ':success'));
                command.error(signals.proxy(key + ':error'));
                command.always(signals.proxy(key + ':always'));
            }
            return command;
        }
    });

    return CommandGroup;
})( takeCommand, jQuery );