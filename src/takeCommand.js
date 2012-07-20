( function( $, Object, window ) {
    "use strict";
    var _commands = {
            testMode: false,
            useSignals: false,
            mock: {}
        },
        _defaultOptions = { type: 'GET',  dataType: 'JSON', mock: {} },
        _isFunction,
        _checkArg = {},
        Command;

    _checkArg.required = function( obj, message ) {
        if( !obj ) {
            throw message;
        }
    };
    
    _checkArg.required( $, 'jQuery is required' );

    Command = function( key, options ) {
        var self = this;
        this.key = key;
        this.options = options;
        this.send = this.execute = function( data ) {
            if( data && !data.currentTarget ) {
                options.data = data;
            }
            if( !_commands.testMode ) {
                $.ajax( self.options ).success( self.success ).always( self.always ).error( self.error );    
            } else {
                if( self.options.mock.wasSuccess ) {
                    self.success( self.options.mock.response );
                } else {
                    self.error( self.options.mock.response );
                }
                self.always( self.options.mockResponse );
            }
        };
    };

    _commands.register = function( key, options ) {
        _checkArg.required( key, 'Please provide a key to register' );
        _checkArg.required( options, 'You must provide an options object with a URL property' );
        _checkArg.required( options.url, 'You must provide an options object with a URL property' );
        
        var command = new Command( key, $.extend( options, _defaultOptions ) );
        _commands[key] = command;
        return command;
    };

    Command.fn = Command.prototype;

    Command.fn.bind = function( selector, events, func ) {
        var self = this,
            data;
        data = ( _isFunction( func ) ) ? func() : data;
        $( window ).on( events, selector, function( evt ) {
            evt.preventDefault();
            self.send( data );
            return this;
        });
    };
    
    Command.fn.clearCallback = function( name ) {
        delete this[name];
        return this;
    };

    Command.fn.success = function( func ) {
        if( func && _isFunction( func ) ) {
            this.success = func;
        }
        return this;
    };
    
    Command.fn.always = function( func ) {
        if( func && _isFunction( func ) ) {
            this.always = func;
        }
        return this;
    };
    
    Command.fn.error = function( func ) {
        if( func && _isFunction( func ) ) {
            this.error = func;
        }
        return this;
    };

    _isFunction = function( obj ) {
        return Object.prototype.toString.call( obj ) === "[object Function]";
    };
    _commands.Command = Command;
    window.commands = _commands;

})( window.jQuery, Object, window );