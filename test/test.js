
var dlutil = require('../lib/dlutil');

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
