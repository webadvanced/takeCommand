window.takeCommand.Command = ( function( takeCommand, $ ) {
    "use strict";
    var Command = takeCommand.Module.base( null, takeCommand.Events ),
        _defaultOptions = { 
            type: 'GET',  
            dataType: 'JSON', 
            mock: { wasSuccess: true }
        },
        _utils = takeCommand.utils,
        _checkArg = _utils.chkArg;
    Command.extend({
        clearProcessing: function( $form ) {
            if( !$form ) {
                throw 'jQuery Object of form is required';
            }
            $form.find( 'input:submit' ).removeClass( 'processing-btn' ).attr( "disabled", false );
        }
    });
    Command.include({
        init: function( key, options, group ) {
            _checkArg.isNotFalsy( key, 'command key' );
            _checkArg.isNotFalsy( options, 'command options' );
            this.key = key;
            this.group = group;
            this.options = {};
            $.extend( this.options, _defaultOptions, options );
        },
        initialized: function() {
            this.subscribe( 'send', this.proxy( function( data ) {
                if( data && !data.currentTarget ) {
                    this.options.data = data;
                }
                this.publish( 'before' );
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
                        var args = _utils.makeArray( arguments );
                        args.unshift( 'success' );
                        this.publish.apply( this, args );
                        args.length = 0;
                    });
                    this.options.error =  this.proxy( function() {
                        var args = _utils.makeArray( arguments );
                        args.unshift( 'error' );
                        this.publish.apply( this, args );
                        args.length = 0;
                    });
                    this.options.complete = this.proxy( function() {
                        var args = _utils.makeArray( arguments );
                        args.unshift( 'always' );
                        this.publish.apply( this, args );
                        args.length = 0;
                    });
                    $.ajax( this.options );
                }
            }));
        },
        send: function( data ) {
            this.publish( 'send', data );
        },
        execute: function( data ) {
            this.publish( 'send', data );  
        },
        on: function( events, selectors, scope, func ) {
            var self = this,
                data = self.options.data,
                $form,
                shouldProcess = true;
            if( _utils.isFunction( scope ) ) {
                func = scope;
                scope = 'body';
            }
            scope = scope || 'body';
            $( scope ).delegate( selectors, events, function( evt ) {
                var $this = $( this );
                //prevent default event
                evt.preventDefault();
                //if the selected element is a form, wrap it with jQuery and set the $form variable
                if( $this.is( 'form' ) ) {
                    $form = $this;
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
                     $form.find( 'input:submit' ).attr( "disabled", true ).addClass( 'processing-btn' );
                     self.always( function() {
                         Command.clearProcessing( $form );
                     });
                }

                data = ( _utils.isFunction( func ) ) ? func.apply( this, arguments ) : data;
                self.options.ctx = this;

                //check if we need to get the url from the elements attribute
                if( self.options.urlSelector ) {
                    self.options.url = $( this ).attr( self.options.urlSelector );
                }
                _utils.pushToQueue( self, self.send, [ data ], 150 );
            });
            return this;
        },
        before: function( func ) {
            if( func && _utils.isFunction( func ) ) {
                this.wrap( func, 'before' );
            }
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
            this.subscribe( eventName, func );
        },
        subscribe: function( events, callback ) {
            this.parent.subscribe( events, callback, this.eventKey() );
        },
        publish: function() {            
            var args = _utils.makeArray( arguments ),
                i = 0,
                l = arguments.length,
                newArgs = [],
                n = 0,
                tmp;
            if( l === 1 ) {
                l++;
            }
            for( ; i < l; i++, n++ ) {
                tmp = args[ i ];
                if( i === 0 ) {
                    tmp = this.parent.keyEvent( args[ 0 ], this.eventKey() );        
                }
                if( i === 1) {
                    newArgs[ n ] = this.options.ctx || this;
                    n++;
                }
                newArgs[ n ] = tmp;
            }
            this.parent.publish.apply( this.parent, newArgs );
            args.length = 0;
        },
        clear: function( event ) {
            this.parent.forget( this.parent.keyEvent( event, this.eventKey() ) );
            return this;
        },
        eventKey: function() {
            return this.key + ':' + this.group.key;
        }
    });

    return Command;
})( window.takeCommand, window.jQuery );