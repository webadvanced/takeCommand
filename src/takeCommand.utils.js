window.takeCommand.utils = ( function( Array, Object ) {
    "use strict";
    
    var utils = {
            chkArg: { }
        },
        _undefined,
        throwError = function( msg ) {
            throw msg;
        };

    utils.chkArg.isNotFalsy = function( obj, msg ) {
        if( !obj ) {
            throwError( ( msg ) ? 'Argument cannot be falsy : ' + msg : 'Argument cannot be falsy' );
        }
    };

    utils.chkArg.isNotUndefined = function( obj, msg ) {
        if( obj === _undefined ) {
            throwError( ( msg ) ? 'Argument cannot be undefined : ' + msg : 'Argument cannot be undefined' );
        }
    };

    utils.chkArg.isNotEmpty = function( obj, msg ) {
        if( obj === '' ) {
            throwError( ( msg ) ? 'Argument cannot be empty : ' + msg : 'Argument cannot be empty' );
        }
    };

    utils.chkArg.isNotUndefinedOrEmpty = function( obj, msg ) {
        this.isNotUndefined( obj,msg );
        this.isNotEmpty( obj, msg );
    };

    utils.chkArg.isFunction = function( obj, msg ) {
        if( typeof obj !== 'function' ) {
            throwError( ( msg ) ? 'Argument must be a function : ' + msg : 'Argument must be a function');
        }
    };

    utils.makeArray = function( args ) {
        return Array.prototype.slice.call( args, 0 );
    };

    utils.pushToQueue = function( scope, callback, args, delay ) {
        delay = delay || 50;
        scope = scope || this;
        args = args || [];
        
        window.setTimeout( function() {
            callback.apply( scope, args );
        }, delay );
    };

    utils.each = function( collection, func ) {
        this.chkArg.isNotUndefined( collection );
        this.chkArg.isNotUndefined( func );
        this.chkArg.isFunction( func );
        
        var i = 0, l = collection.length;
        
        for( ; i < l; i++ ) {
            if( func( collection[ i ], i ) === false ) {
                break;
            }
        }
    };

    utils.isFunction = function( obj ) {
         return Object.prototype.toString.call( obj ) === "[object Function]";
    };

    return utils;
    
})( Array, Object );