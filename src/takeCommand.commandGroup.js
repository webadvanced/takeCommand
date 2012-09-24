window.takeCommand.CommandGroup = ( function( takeCommand, $ ) {
    "use strict";

    var CommandGroup = takeCommand.Module.base( takeCommand.Events ),
        parseUrl;

    CommandGroup.include({
        testMode: false,
        
        init: function( key ) {
            this.key = key;
            takeCommand.groups[ key ] = this;
        },
        
        initialized: function() {
            this.publish( 'initialized' );
        },
        
        register: function( key, options, type ) {
            this.publish( 'beforeRegister' );
            
            if( typeof options === 'string' ) {
                var url = options;
                options = { url: url };
            }

            if( type ) {
                options.type = type;
            }

            parseUrl( options );
            
            var command = takeCommand.Command.init( key, options, this );
            
            this[ key ] = command;
            this.publish( key + ':afterRegister', command );
            this.publish( 'afterRegister' );
            
            return command;
        }
    });

    parseUrl = function( options ) {
        if( options.url.charAt( 0 ) === ':' ) {
            options.urlSelector = options.url.substring( 1 );
            options.url = '';
        }
    };

    return CommandGroup;
    
})( window.takeCommand, window.jQuery );