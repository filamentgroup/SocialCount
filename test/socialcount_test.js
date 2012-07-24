/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global SocialCount*/
(function($) {

	/*
		======== A Handy Little QUnit Reference ========
		http://docs.jquery.com/QUnit

		Test methods:
			expect(numAssertions)
			stop(increment)
			start(decrement)
		Test assertions:
			ok(value, [message])
			equal(actual, expected, [message])
			notEqual(actual, expected, [message])
			deepEqual(actual, expected, [message])
			notDeepEqual(actual, expected, [message])
			strictEqual(actual, expected, [message])
			notStrictEqual(actual, expected, [message])
			raises(block, [expected], [message])
	*/

	module('testNormalizeCount', {
		setup: function() {

		}
	});

	test( 'less than 1000', function() {
		equal(SocialCount.normalizeCount(null), '-');
		equal(SocialCount.normalizeCount(0), 0);
		equal(SocialCount.normalizeCount(999), 999);
		equal(SocialCount.normalizeCount(1001), '1K');
		equal(SocialCount.normalizeCount(1001), '1K');
		equal(SocialCount.normalizeCount(1900), '1.9K');
		equal(SocialCount.normalizeCount(1949), '1.9K');
		// bad rounding happens, this should be 2K
		equal(SocialCount.normalizeCount(1950), '1.9K');
		equal(SocialCount.normalizeCount(1999), '2K');
		equal(SocialCount.normalizeCount(2000), '2K');
		equal(SocialCount.normalizeCount(2049), '2K');
		// bad rounding happens, this should be 2.1K
		equal(SocialCount.normalizeCount(2050), '2K');
		start();
	});

	test( 'around 100,000', function() {
		equal(SocialCount.normalizeCount(99499), '99.5K');
		equal(SocialCount.normalizeCount(99501), '99.5K');
		// if >= 100K, uses Math.floor
		equal(SocialCount.normalizeCount(100000), '100K');
		equal(SocialCount.normalizeCount(100999), '100K');
		equal(SocialCount.normalizeCount(101000), '101K');
		equal(SocialCount.normalizeCount(101999), '101K');
	});

	test( 'around one million', function() {
		// uses Math.floor
		equal(SocialCount.normalizeCount(999499), '999K');
		equal(SocialCount.normalizeCount(999999), '999K');
		equal(SocialCount.normalizeCount(1000000), '1M');
	});

}( jQuery ));
