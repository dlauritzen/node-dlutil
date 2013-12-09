# dlutil

Node.js utility functions.

Most functions have synchronous and asynchronous versions. All asynchronous versions of methods have _Async_ appended to the function name.

## partition

Partition a list according to keys returned from an iterator function.

``` javascript
var l = [1, 2, 3, 4, 5];
function evenOdd(n) {
	return (n % 2 == 0) ? 'even' : 'odd';
}
var partitioned = dlutil.partition(l, evenOdd);
/*
partitioned = {
	even: [2, 4],
	odd: [1, 3, 5]
}
*/
```

And the async version

``` javascript
var l = [1, 2, 3, 4, 5];
function evenOdd(n, next) {
	return next(null, (n % 2 == 0) ? 'even' : 'odd');
}
dlutil.partitionAsync(l, evenOdd, function(err, partitioned) {
	/*
	partitioned = {
		even: [2, 4],
		odd: [1, 3, 5]
	}
	*/
});
```
