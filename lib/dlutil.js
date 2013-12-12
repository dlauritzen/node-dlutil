
var _ = require("underscore");
var fs = require("fs");
var async = require("async");
var path = require("path");
var util = require('util');

// setPath

function setPath(filenames, dir) {
	return _.map(filenames, function(filename) {
		return path.join(dir, filename);
	});
}
exports.setPath = setPath;

// filterByExt

function filterByExt(filenames, ext) {
	return _.filter(filenames, function(filename) {
		return path.extname(filename) == ext;
	});
}
exports.filterByExt = filterByExt;

// copyFile

function copyFileAsync(src, dest, done) {
	var read = fs.createReadStream(src);
	var write = fs.createWriteStream(dest);
	read.on('end', done);
	read.on('error', done);
	read.pipe(write);
}
exports.copyFileAsync = copyFileAsync;

// RmTree

function rmtree(dir) {
	// console.log('Removing tree %s', dir);
	var exists = fs.existsSync(dir);
	if (exists) {
		// console.log('File exists: %s', dir);
		var stats = fs.statSync(dir);
		if (stats.isDirectory()) {
			// console.log('%s is a directory', dir);
			var files = fs.readdirSync(dir);
			_.each(files, function(filename) {
				rmtree(path.join(dir, filename));
			});
			// folder is now empty. Delete
			// console.log('Deleting directory %s', dir);
			fs.rmdirSync(dir);
		}
		else {
			// console.log('Deleting file %s', dir);
			fs.unlinkSync(dir);
			exists = fs.existsSync(dir);
			// console.log('File still exists? %s', exists);
		}
	}
	else {
		// console.log('File does not exist: %s', dir);
	}
}
exports.rmtree = rmtree;

function rmtreeAsync(dir, done) {
	// console.log('Removing tree %s', dir);
	fs.exists(dir, function(exists) {
		if (!exists) {
			// console.log('File does not exist %s', dir);
			return done(null);
		}
		// console.log('File exists: %s', dir);
		fs.stat(dir, function(err, stats) {
			if (err) return done(err);
			// console.log('Stats: %s', util.inspect(stats, { depth: null }));
			if (stats.isDirectory()) {
				// console.log('%s is a directory', dir);
				fs.readdir(dir, function(err, filenames) {
					if (err) return done(err);

					// recurse down the tree, deleting all contents of a directory
					async.eachSeries(filenames, function(filename, next) { rmtreeAsync(path.join(dir, filename), next); }, function(err) {
						if (err) return done(err);

						// directory is now empty, delete it
						// console.log('Deleting directory %s', dir);
						fs.rmdir(dir, done);
					});
				});
			}
			else {
				// console.log('Deleting file %s', dir);
				fs.unlink(dir, done);
			}
		});
	});
}
exports.rmtreeAsync = rmtreeAsync;

// Partition

function partition(lst, iterator) {
	var data = {};
	_.each(lst, function(item) {
		var key = iterator(item);
		if (!data[key]) {
			data[key] = [];
		}
		data[key].push(item);
	});
	return data;
}
exports.partition = partition;

function partitionAsync(lst, iterator, done) {
	async.mapSeries(lst, function(item, next) {
		iterator(item, function(err, key) {
			if (err) return next(err);

			return next(null, { key: key, value: item });
		});
	}, function(err, mapping) {
		if (err) return done(err);
		
		var data = {};
		_.each(mapping, function(item) {
			if (!data[item.key]) {
				data[item.key] = [];
			}
			data[item.key].push(item.value);
		});
		return done(null, data);
	});
}
exports.partitionAsync = partitionAsync;
