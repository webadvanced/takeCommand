window.takeCommand.Command = ( function( takeCommand, $ ) {
    "use strict";
    var Command = takeCommand.Module.base(),
        _defaultOptions = { 
            type: 'GET',  
            dataType: 'JSON', 
            mock: { wasSuccess: true }
        },
        _utils = takeCommand.utils,
        _checkArg = _utils.chkArg;
    Command.extend(takeCommand.Events);
    Command.include({
        init: function( key, options, group ) {
            _checkArg.isNotFalsy( key, 'command key' );
            _checkArg.isNotFalsy( options, 'command options' );
            if( typeof options === 'string' ) {
                options = { url: options };
            }
            this.key = key;
            this.options =  $.extend( options, _defaultOptions );
            this.group = group;
        },
        initialized: function() {
            this.subscribe( 'send', this.proxy(function( data ) {
                if( data && !data.currentTarget ) {
                    this.options.data = data;
                }
                if( this.group.testMode || takeCommand.testMode ) {
                    var mock = this.options.mock;
                    if( mock.wasSuccess ) {
                        this.publish( 'success',  mock.responseData );
                    } else {
                        this.publish( 'error',  mock.responseData );
                    }
                    this.publish( 'always',  mock.responseData );
                } else {
                    this.options.success = this.proxy( function() {
                        this.publish( 'success' );
                    });
                    this.options.error =  this.proxy( function() {
                        this.publish( 'error' );
                    });
                    this.complete = this.proxy( function() {
                        this.publish( 'always' );
                    });
                    $.ajax( this.options );
                }
            }));
            
        },
        send: function( data ) {
            this.publish( 'send', data);
        },
        on: function( events, selectors, func ) {
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
                if( !shouldProcess ) { 
                    return;
                }
    
                //if the selected element is a form, serialize it and set to the Ajax requests data
                if( $form ) {
                     data = $form.serialize();
                }

                data = ( _utils.isFunction( func ) ) ? func.apply(this, arguments) : data;

                self.publish( 'send', data );
            });
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
        },
        subscribe: function( events, callback ) {
            this.parent.subscribe( events, callback, this.eventKey() );
        },
        publish: function( event, args ) {
            this.parent.publish( this.parent.keyEvent( event, this.eventKey() ), args );
        },
        clearCallback: function( event ) {
            this.parent.forget( this.parent.keyEvent( event, this.eventKey() ) );
            return this;
        },
        eventKey: function() {
            return this.key + ':' + this.group.key;
        }
    });

    return Command;
})( window.takeCommand, window.jQuery );