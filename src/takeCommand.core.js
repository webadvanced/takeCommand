;( function( exports, Object, Array ) {
    "use strict";

    var addShims,
        takeCommand = {
            version: '0.9.9',
            init: function() {
              addShims();
            },
            groups: {},
            testMode: false
        };?

    addShims = function() {
        if( typeof Object.create !== 'function' ) {
            Object.create = function( obj ) {
                function F() {}
                F.prototype = obj;
                return new F();
            };
        }
    
        if( typeof Array.prototype.indexOf === "undefined" ) {
            Array.prototype.indexOf = function( value ) {
                var i = 0;
                for ( ; i < this.length; i++ ) {
                    if( this[ i ] === value ) {
                        return i;
                    }
                    return -1;
                }
            };
        }
    };

    if( !exports.takeCommand ) {
        exports.takeCommand = takeCommand;
    }

    takeCommand.init();
    
})( window, Object, Array );