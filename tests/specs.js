//factory function for command
var commands = takeCommand.CommandGroup.init('commands');
var buildCommand = function(key, options) {
	key = key || 'mockCommand';
	options = options || {url: '/mock/add'};
	return commands.register(key, options)
};

describe('using takeCommand', function() {

	describe('when registering a new command', function() {
		it('should throw when not command is provided', function() {
			expect(function() { commands.register(undefined, {url: '/foo'})}).toThrow();
			expect(function() { commands.register('', {url: '/foo'})}).toThrow();
		});

		it('should throw when no options are provided', function() {
			expect(function() {commands.register('mockCommand')}).toThrow();
		});

		it('should convert the options string into an option and set the url property', function() {
			var command = buildCommand(null, '/mock/update');
			expect(command.options.url).toEqual( '/mock/update' );
		});

		it('should set default jQuery Ajax options for type to GET', function() {
			var command = buildCommand();
			expect(command.options.type).toBe('GET');
		});

		it('should set default jQuery Ajax options for dataType to JSON', function() {
			var command = buildCommand();
			expect(command.options.dataType).toBe('JSON');
		});

		it('should create a new property on window.commands for given key', function() {
			buildCommand('_test_key_');
			expect(commands._test_key_).not.toBeUndefined();
		});
	});

	describe('when binding success, error and always function to a command', function() {
		var command = buildCommand();
		
		it('should set s as the success function', function() {
			var functionName;
			command.success( function() { functionName = 's'; } );
			command.publish( 'success' );
			expect( functionName ).toEqual( 's' );
		});

		it('should set e as the error function', function() {
			var functionName;
			command.error( function() { functionName = 'e'; } );
			command.publish( 'error' );
			expect( functionName ).toEqual( 'e' );
		});

		it('should set a as the always function', function() {
			var functionName;
			command.always( function() { functionName = 'a'; } );
			command.publish( 'always' );
			expect( functionName ).toEqual( 'a' );
		});
	});

	describe('when using clearCallback', function() {
		var command = buildCommand(),
			s = function() { };
		command.success(s);
		command.clearCallback('success');

		it('should unbind success function', function() {
			expect(command.success).not.toEqual(s);
		});

		it('should reset to the prototype success function', function() {
			expect(command.success).toEqual(commands.Command.prototype.success);
		});
	});

	describe('when using command.bind', function() {
		var command = buildCommand(),
			_temp,
			s = function(response) { _temp = response || 'called by success'; },
			d = function() { return 'from the callback' },
			ds = function() { return this.id; };
		command.success(s);
		
		it('should bind Ajax call to provided el and event', function() {
			_temp = '';
			command.bind('#theLink', 'click');
			$('#theLink').trigger('click');
			expect(_temp).toEqual('called by success');
		});

		it('should use the hash from callback as options.data', function() {
			command.bind('#theOtherLink', 'click', d);
			$('#theOtherLink').trigger('click');
			expect(command.options.data).toEqual('from the callback');
		});

		it('should set the scope of the callback to the elemet', function() {
			command = buildCommand();
			command.bind('#theOtherOtherLink', 'click', ds);
			$('#theOtherOtherLink').trigger('click');
			expect(command.options.data).toEqual('theOtherOtherLink');
		});
		
		describe('when the el is a form and jQuery validation is included', function() {
			it('should serialize the form and set it as options.data', function() {
				var command = buildCommand('noValForm');
				command.bind('#mockFormNoVal', 'submit');
				$('#mockFormNoVal').trigger('submit');
				expect(command.options.data).toEqual('mockInput=MockText');
			});

			it('should not send the Ajax request if the form is not valid', function() {
				console.log($("#mockFormVal").valid());
				var command = buildCommand('valForm');
				command.bind('#mockFormVal', 'submit');
				command.always(function() {});
				spyOn(command, 'always');
				$('#mockFormVal').trigger('submit');
				expect(command.always).not.toHaveBeenCalled();
			});
		});
	});

	describe('when calling send/execute', function() {
		var command = buildCommand()
		commands.testMode = true;
		describe('when the call is successfull', function() {
			it('should call the success funtion', function() {
				spyOn(command, 'success');
				command.send();
				expect(command.success).toHaveBeenCalled();
			});
		
			it('should call the always funtion', function() {
				spyOn(command, 'always');
				command.send();
				expect(command.always).toHaveBeenCalled();	
			});
		});
		describe('when the call is not successfull', function() {
			it('should call the error funtion', function() {
				command.options.mock.wasSuccess = false;
				spyOn(command, 'error');
				command.send();
				expect(command.error).toHaveBeenCalled();
			});
		
			it('should call the always funtion', function() {
				spyOn(command, 'always');
				command.send();
				expect(command.always).toHaveBeenCalled();	
			});
		});
	});

	describe('when comands.testMode is true', function() {
		commands.testMode = true;
		var command = buildCommand(),
			s = function() { },
			e = function() { },
			a = function() { };
		command.success(s).error(e).always(a);
		
		it('should not send an Ajax request', function() {
			command.options.mock.wasSuccess = true;
			spyOn(command, 'success');
			command.send();
			expect(command.success).toHaveBeenCalled();
		});
		
		it('should pass mock.data to callbacks', function() {
			var mockData = { message: 'this is a success message' };
			command.options.mock.wasSuccess = true;
			command.options.mock.responseData = mockData;
			spyOn(command, 'success');
			command.send();
			expect(command.success).toHaveBeenCalledWith( mockData );
		});
	});

	describe('when commands.useSignals is true', function() {
		it('should wire up signal broadcasts for all callbacks', function() {
			commands.useSignals = true;
			var command = buildCommand();
			expect(command.success.toString()).toContain('broadcast');
			expect(command.error.toString()).toContain('broadcast');
			expect(command.always.toString()).toContain('broadcast');
		});
	});

});