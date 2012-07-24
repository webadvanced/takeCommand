( function( $, Object, window, signals ) {
    "use strict";
    var _commands = { 
            testMode: false,
            useSignals: false
        },
        _defaultOptions = { 
            type: 'GET',  
            dataType: 'JSON', 
            mock: { wasSuccess: true }
        },
        _isFunction,
        _checkArg = {},
        _bindCommandToSignals,
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
                    self.success( self.options.mock.responseData );
                } else {
                    self.error( self.options.mock.responseData );
                }
                self.always( self.options.responseData );
            }
        };
    };

    _commands.register = function( key, options ) {
        _checkArg.required( key, 'Please provide a key to register' );
        _checkArg.required( options, 'You must provide an options object with a URL property' );
        if( typeof options === 'string' ) {
            options = { url: options };
        }
        
        var command = new Command( key, $.extend( options, _defaultOptions ) );
        _commands[key] = command;
        if( _commands.useSignals ) { 
            _bindCommandToSignals( key, command );
        }
        return command;
    };

    Command.fn = Command.prototype;

    Command.fn.bind = function( selectors, events, func ) {
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
                shouldProcess = !$form.valid();
            }
            
            //if the form is not valid, we should return
            if( !shouldProcess ) return;

            //if the selected element is a form, serialize it and set to the Ajax requests data
            if( $form ) {
                data = $form.serialize();
            }

            data = ( _isFunction( func ) ) ? func.apply(this, arguments) : data;
            self.send( data );
        });
        return this;
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

    _bindCommandToSignals = function( key, command ) {
        _checkArg.required( signals, 'signals is required, please add a reference to signals' );
        command.success(signals.proxy(key + ':success'));
        command.error(signals.proxy(key + ':error'));
        command.always(signals.proxy(key + ':always'));
    };

    _isFunction = function( obj ) {
        return Object.prototype.toString.call( obj ) === "[object Function]";
    };
    _commands.Command = Command;
    window.commands = _commands;

})( window.jQuery, Object, window, window.signals );