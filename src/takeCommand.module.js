window.takeCommand.Module = ( function( takeCommand, $ ) {
    "use strict";
    var Module, 
        moduleKeywords = ['included', 'extended'],
        _utils = takeCommand.utils,
        _checkArg = _utils.chkArg;
    Module = {
        inherited: function() {},
        created: function() {},
        prototype: {
            init: function() {},
            initialized: function() {}
        },
        extend: function( obj ) {
            for( var key in obj ) {
                if ( moduleKeywords.indexOf( key ) === -1 ) {
                    this[key] = obj[key];
                }
            }
            var extended = obj.extended;
            if ( extended ) {
                extended.apply( this );
            }
            return this;
        },
        include: function( obj ) {
            for( var key in obj ) {
                if( moduleKeywords.indexOf( key ) === -1 ) {
                    this.prototype[key] = obj[key];
                }
            }
            var included = obj.included;
            if ( included ) {
                included.apply( this );
            }
            return this;
        },
        proxy: function( func ) {
            _checkArg.isNotUndefined( func );
            var localScope = this;
            return ( function() {
                func.apply( localScope, arguments );
            });
        },
        proxyAll: function(){
                var functions = _utils.makeArray( arguments );
                for ( var i=0; i < functions.length; i++ ) {
                    this[functions[i]] = this.proxy( this[functions[i]] );
                }
            },
        create: function( include, extend ) {
            var obj = Object.create( this );
            obj.parent = this;
            obj.prototype = obj.fn = Object.create( this.prototype );
            if( include ) {
                obj.include( include );
            }
            if( extend )    {
                obj.extend( extend );
            }
            obj.created();
            this.inherited( obj );
            return obj;
        },
        init: function() {
            var initance = Object.create( this.prototype );
            initance.parent = this;
            initance.init.apply( initance, arguments );
            initance.initialized.apply( initance, arguments );
            return initance;
        }
    };
    Module.prototype.proxy = Module.proxy;
    Module.prototype.proxyAll = Module.proxyAll;
    Module.base = Module.create;
    return Module;
})( window.takeCommand, window.jQuery );