var commands = ( function( $ ) {
    if( !$ ) { 
        throw 'jQuery is required.';
    }

    var commands = { },
        _defaultOptions = { type: 'GET',  dataType: 'JSON' },
        _isFunction,
        Commad,
        checkArg = {};

    checkArg.required = function( obj, message ) {
        if( !obj ) {
            throw message;
        }
    };

    Command = function( key, options ) {
        var self = this;
        this.key = key;
        this.options = options;
        this.send = this.execute = function( data ) {
            if( data && !data.currentTarget ) self.options.data = data;
            $.ajax( self.options ).success( self.success ).always( self.always ).error( self.error );
        };
    };

    commands.register = function( key, options ) {
        checkArg.required( key, 'Please provide a key to register' );
        checkArg.required( options, 'You must provide an options object with a URL property' );
        
        var command = new Command( key, $.extend( options, _defaultOptions ) );
        commands[key] = command;
        return command;
    };

    Command.fn = Command.prototype;

    Command.fn.bind = function( selector, events, func ) {
        var self = this,
            data;
        data = ( _isFunction( func ) ? func() : data;
        $( window ).on( events, selector, function( evt ) {
            evt.preventDefault();
            self.send( data );
            return this;
        });
    };
        
    Command.fn.success = function( func ) {
        if( func && _isFunction( func ) ) {
            this.success = $.proxy(func, this);
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
    }

    return commands;

})( jQuery );