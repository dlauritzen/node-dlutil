# dlutil

Node.js utility functions.

Most functions have synchronous and asynchronous versions. All asynchronous versions of methods have _Async_ appended to the function name.

Run tests using `npm test`.

## rmtree (0.0.2)

Remove a file or a directory and its contents. Absolute paths are recommended.

``` javascript
dlutil.rmtree(directory);
```

``` javascript
dlutil.rmtreeAsync(directory, callback);
```

## copyFile (0.0.2)

Copy a file. This is a convenience method.

``` javascript
dlutil.copyFileAsync(src, dest, callback);
```

## setPath (0.0.3)

Prepend a directory to a list of file names. This method is synchronous.

``` javascript
dlutil.setPath(filenames, dir);
```

## filterByExt (0.0.3)

Filter a list of filenames by extension. The `ext` parameter should include the `.`. This method is synchronous.

``` javascript
dlutil.filterByExt(filenames, ext);

// e.g. dlutil.filterByExt(l, '.png')
```

## partition (0.0.1)

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
