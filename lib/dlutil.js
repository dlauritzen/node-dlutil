
var _ = require("underscore");
var async = require("async");

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
