
var dlutil = require('../lib/dlutil');

var fs = require('fs');
var path = require('path');
var fstream = require('fstream');

exports.partition = function(test) {
	test.expect(2);
	
	var l = [1, 2, 3, 4, 5];
	function evenOdd(n) {
		return (n % 2 == 0) ? 'even' : 'odd';
	}
	function evenOddAsync(n, next) {
		return next(null, evenOdd(n));
	}
	var partitioned = dlutil.partition(l, evenOdd);
	test.deepEqual(partitioned, {
		even: [2, 4],
		odd: [1, 3, 5]
	});

	dlutil.partitionAsync(l, evenOddAsync, function(err, partitioned) {
		test.deepEqual(partitioned, {
			even: [2, 4],
			odd: [1, 3, 5]
		});

		test.done();
	});
}

exports.rmtree = {
	setUp: function(next) {
		var dir1 = path.join(__dirname, 'rmtree_test_dir');
		var dir2 = path.join(dir1, 'rmtree_2');
		var file1 = path.join(dir1, 'file1.txt');
		var file2 = path.join(dir2, 'file2.txt');

		var w = fstream.Writer({ path: file2, size: 5});
		w.on('close', next);
		w.write('test\n');
		w.end();
	},

	sync: function(test) {
		var dir = path.join(__dirname, 'rmtree_test_dir');
		test.expect(3);
		test.ok(fs.existsSync(dir), 'Directory should exist.');
		test.doesNotThrow(function() {
			dlutil.rmtree(dir);
		});
		fs.exists(dir, function(exists) {
			test.equal(exists, false, dir + ' should not exist');
			test.done();
		});
	},

	async: function(test) {
		var dir = path.join(__dirname, 'rmtree_test_dir');
		test.expect(3);
		test.ok(fs.existsSync(dir), 'Directory should exist.');
		dlutil.rmtreeAsync(dir, function(err) {
			test.ok(!err, 'Got error: ' + err);
			fs.exists(dir, function(exists) {
				test.equal(exists, false, dir + ' should not exist');
				test.done();
			});
		});
	}
}

exports.copyfile = {
	tearDown: function(next) {
		fs.unlink(path.join(__dirname, 'index2.js'), function(err) { next(); });
	},

	async: function(test) {
		var src = path.join(__dirname, 'index.js');
		var dest = path.join(__dirname, 'index2.js');
		dlutil.copyFileAsync(src, dest, function(err) {
			test.ok(!err, 'Should not error.');

			var srcContents = fs.readFileSync(src);
			var destContents = fs.readFileSync(dest);
			test.deepEqual(srcContents, destContents, 'Files should be equal.');

			test.done();
		});
	}
}
