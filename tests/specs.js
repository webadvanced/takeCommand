//factory function for command
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

		it('should throw when options object does not contain a url property', function() {
			expect(function() {commands.register('mockCommand', {})}).toThrow();
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
		var command = buildCommand(),
			s = function() { },
			e = function() { },
			a = function() { };
		it('should set s as the success function', function() {
			command.success( s );
			expect( command.success ).toEqual( s );
		});

		it('should set e as the error function', function() {
			command.error( e );
			expect( command.error ).toEqual( e );
		});

		it('should set a as the always function', function() {
			command.always( a );
			expect( command.always ).toEqual( a );
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

	describe('when calling send/execute', function() {
		var command = buildCommand()
		commands.testMode = true;
		describe('when the call is successfull', function() {
			command.options.mock = {
				success: true
			};
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
	});

});