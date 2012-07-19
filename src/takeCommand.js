var commands = ( function( $ ) {
    if( !$ ) { 
        throw 'jQuery is required.';
    }

    var commands = { execute: {} },
        _defaultOptions = { type: 'GET',  dataType: 'JSON' },
        _isFunction;

    commands.register = function( key, options ) {
        if( !( this instanceof commands.register )) {
            return new commands.register( key, options );
        }
        
        var self = this;
        $.extend( options, _defaultOptions );
        
        commands.execute[key] = function( data ) {
            if( data && !data.currentTarget ) options.data = data;
            $.ajax( options ).success( self.success ).always( self.always ).error( self.error );
        };

        return this;
    };

    commands.register.fn = commands.register.prototype;

    commands.register.fn.setCallback = function( func, pointer ) {
        this[pointer] = func;
    };
        
    commands.register.fn.success = function( func ) {
        if( func && _isFunction( func ) ) {
            this.setCallback( func, 'success' );
        }
        return this;
    };
    
    commands.register.fn.always = function( func ) {
        if( func && _isFunction( func ) ) {
            this.setCallback( func, 'always' );
        }
        return this;
    };
    
    commands.register.fn.error = function( func ) {
        if( func && _isFunction( func ) ) {
            this.setCallback( func, 'error' );
        }
        return this;
    };

    _isFunction = function( obj ) {
        return Object.prototype.toString.call( obj ) === "[object Function]";
    }
    
    commands.send = commands.execute;
    return commands;

})( jQuery );