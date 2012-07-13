/*global require:true */
var SocialCount = require('../lib/socialcount.js').SocialCount;

exports['SocialCountNormalizeCountTest'] = {
	setUp: function(done)
	{
		// setup here
		done();
	},
	normalizeCount: function(test)
	{
		test.equal(SocialCount.normalizeCount(null), '-');
		test.equal(SocialCount.normalizeCount(0), 0);
		test.equal(SocialCount.normalizeCount(999), 999);
		test.equal(SocialCount.normalizeCount(1001), '1K');
		test.equal(SocialCount.normalizeCount(1001), '1K');
		test.equal(SocialCount.normalizeCount(1900), '1.9K');
		test.equal(SocialCount.normalizeCount(1949), '1.9K');
		// bad rounding happens, this should be 2K
		test.equal(SocialCount.normalizeCount(1950), '1.9K');
		test.equal(SocialCount.normalizeCount(1999), '2K');
		test.equal(SocialCount.normalizeCount(2000), '2K');
		test.equal(SocialCount.normalizeCount(2049), '2K');
		// bad rounding happens, this should be 2.1K
		test.equal(SocialCount.normalizeCount(2050), '2K');
		test.done();
	},
	normalizeCountAbove100K: function(test)
	{
		// >= 100K
		test.equal(SocialCount.normalizeCount(100000), '100K');
		test.equal(SocialCount.normalizeCount(100999), '100K');
		test.equal(SocialCount.normalizeCount(101000), '101K');
		test.equal(SocialCount.normalizeCount(101999), '101K');
		test.done();
	}
};
