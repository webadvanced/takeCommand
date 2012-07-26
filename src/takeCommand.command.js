takeCommand.Command = ( function( takeCommand, $ ) {
    "use strict";
    var Command = takeCommand.Module.base( takeCommand.Events ),
        _defaultOptions = { 
            type: 'GET',  
            dataType: 'JSON', 
            mock: { wasSuccess: true }
        },
        _utils = takeCommand.utils,
        _checkArg = _utils.chkArg;
    Command.include({
        init: function( key, options ) {
            _checkArg.isNotUndefined( key, 'Please provide a key to register' );
            _checkArg.isNotUndefined( options, 'You must provide an options object with a URL property' );
            if( typeof options === 'string' ) {
                options = { url: options };
            }
            this.key = key;
            this.options =  $.extend( options, _defaultOptions );
        },
        initialized: function() {
            this.subscribe('send', this.proxy(function( data ) {
                console.log(this);
                if( data && !data.currentTarget ) {
                    this.options.data = data;
                }
                if( !this.group.testMode ) {
                    $.ajax( this.options ).success( this.success ).always( this.always ).error( this.error );    
                } else {
                    if( this.options.mock.wasSuccess ) {
                        this.success( this.options.mock.responseData );
                    } else {
                        this.error( this.options.mock.responseData );
                    }
                    this.always( this.options.responseData );
                }
            }));
            
        },
        send: function( data ) {
            this.publish( 'send', data);
        },
        bind: function( selectors, events, func ) {
            var self = this,
                data = self.options.data,
                $form,
                shouldProcess = true;
            $( 'body' ).on( events, selectors, function( evt ) {
                evt.preventDefault();
            
                //if the selected element is a form, wrap it with jQuery and set the $form variable
                if( this.action && this.method ) {
                    $form = $( this );
                }
                //if the form is using jQuery validation, ensure the form is valid
                if( $form && $form.valid ) {
                    shouldProcess = $form.valid();
                }

                //if the form is not valid, we should return
                if( !shouldProcess ) return;
    
                //if the selected element is a form, serialize it and set to the Ajax requests data
                if( $form ) {
                     data = $form.serialize();
                }

                data = ( _utils.isFunction( func ) ) ? func.apply(this, arguments) : data;

                self.send( data );
            });
            return this;
        },
        clearCallback: function( name ) {
            delete this[name];
            return this;
        },
        success: function( func ) {
            if( func && _utils.isFunction( func ) ) {
                this.wrap( func, 'success' );
            }
            return this;
        },    
        always: function( func ) {
            if( func && _utils.isFunction( func ) ) {
                this.wrap( func, 'always' );
            }
            return this;
        },
        error: function( func ) {
            if( func && _utils.isFunction( func ) ) {
                this.wrap( func, 'error' );
            }
            return this;
        },
        wrap: function( func, eventName ) {
            this.subscribe( eventName, this.proxy( func ) );
            this[eventName] = this.proxy( function() {
                this.publish( eventName );
            });
        }
    });

    return Command;
})( takeCommand, jQuery );