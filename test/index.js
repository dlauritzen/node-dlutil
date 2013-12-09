#!/usr/bin/env node

try {
	var reporter = require('nodeunit').reporters.default;
}
catch (e) {
	console.log('Cannot find nodeunit module.');
	process.exit();
}

reporter.run(['test']);