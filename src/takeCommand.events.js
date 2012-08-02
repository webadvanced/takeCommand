window.takeCommand.Events = ( function( utils ) {
    "use strict";
    return {
        subscribers: {},
        subscribe: function( evt, callback, key ) {
            var evts = evt.split( ' ' );
            utils.each( evts, this.proxy( function( ev, i ) {
                if( key ) {
                    ev = this.keyEvent( ev, key );
                }
                ( this.subscribers[ev] || ( this.subscribers[ev] = [] ) ).push( callback );
            }));
        },
        publish: function() {
            var args = utils.makeArray( arguments ),
                evt = args.shift(),
                calls = this.subscribers,
                list = calls[evt],
                ctx = args['ctx'];
            if( !calls ) {
                return false;
            }
            if( !list ) {
                return false;
            }
            utils.each( list, this.proxy( function( func, i ) {
                if( func.apply( ctx || this, args ) === false ) {
                    return false;
                }
            }));
            return true;
        },
        forget: function( evt, callback, key ) {
            if( !evt ) {
                this.subscribers = {};
                return this;
            }
            if( key ) {
                evt = this.keyEvent( evt, key );
            }
            var calls = this.subscribers,
                list = calls[evt];
            if( !calls ) {
                return false;
            }
            if( !list ) {
                return false;
            }

            if( !callback ) {
                delete this.subscribers[evt];
                return this;
            }
            utils.each( list, this.proxy( function( func, i ) {
                if( callback === func ) {
                    list.splice(i, 1);
                    return false;
                }
            }));
            return this;
        },
        keyEvent: function( evt, key ) {
            return evt + ':' + key;
        }
    };
})( window.takeCommand.utils );