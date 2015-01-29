/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false, start:false, stop:false, ok:false, equal:false, notEqual:false, deepEqual:false, notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false, SocialCount:true */
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

	module('testNormalizeCount');

	test( 'less than 1000', function() {
		equal(SocialCount.normalizeCount(null), '-');
		equal(SocialCount.normalizeCount(0), 0);
		equal(SocialCount.normalizeCount(999), 999);
		equal(SocialCount.normalizeCount(1001), '1K');
		equal(SocialCount.normalizeCount(1001), '1K');
		equal(SocialCount.normalizeCount(1900), '1.9K');
		equal(SocialCount.normalizeCount(1949), '1.9K');
		// a lot of browsers report 1.9K here (bad rounding)
		//equal(SocialCount.normalizeCount(1950), '2K');
		equal(SocialCount.normalizeCount(1999), '2K');
		equal(SocialCount.normalizeCount(2000), '2K');
		equal(SocialCount.normalizeCount(2049), '2K');
		// a lot of browsers report 2K here (bad rounding)
		//equal(SocialCount.normalizeCount(2050), '2.1K');
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

	module( 'testServiceNormalization' );
	test( 'filenameRemoval', function() {
		// uses Math.floor
		equal( SocialCount.removeFileName( 'http://localhost/SocialCount/src/socialcount.js' ), 'http://localhost/SocialCount/src/' );
		equal( SocialCount.removeFileName( 'http://localhost/SocialCount/dist/socialcount.min.js' ), 'http://localhost/SocialCount/dist/' );
		equal( SocialCount.removeFileName( 'http://fgte.st/SocialCount/src/socialcount.js' ), 'http://fgte.st/SocialCount/src/' );
		equal( SocialCount.removeFileName( 'http://fgte.st/SocialCount/dist/socialcount.min.js' ), 'http://fgte.st/SocialCount/dist/' );
	});

	module('testInitialize', {
		setup: function() {
			var $fixture = $('#qunit-fixture'),
				$test;

			$fixture.append( '<ul id="test" class="socialcount" data-url="http://www.google.com/"></ul>' );

			$test = $( '#test' );
			SocialCount.init( $test );
		}
	});

	test( 'Default activate on hover', function() {
		equal( SocialCount.activateOnClick, false );
	});

	test( 'Retrieve URL', function() {
		equal( SocialCount.getUrl( $('#test') ), 'http://www.google.com/' );
	});

	test( 'Retrieve Facebook Action', function() {
		equal( SocialCount.getFacebookAction( $('#test') ), 'like' );
	});

	test( 'Test if Small', function() {
		equal( SocialCount.isSmallSize( $('#test') ), false );
	});

	test( 'Test top level classes', function() {
		ok( SocialCount.isCssTransforms() ?
			!$('#test').hasClass( SocialCount.classes.noTransforms ) :
			$('#test').hasClass( SocialCount.classes.noTransforms ) );

		ok( SocialCount.isCountsEnabled( $( '#test' ) ) ?
			$('#test').hasClass( SocialCount.classes.showCounts ) :
			!$('#test').hasClass( SocialCount.classes.showCounts ) );
	});

	module('testAjax', {
		setup: function() {
			var $fixture = $('#qunit-fixture');

			$fixture.append( '<ul id="test" class="socialcount" data-url="http://www.google.com/"><li class="facebook"><a href="https://www.facebook.com/sharer/sharer.php?u=http://www.google.com/" title="Share on Facebook"><span class="icon icon-facebook"></span><span class="count">Like</span></a></li><li class="twitter"><a href="https://twitter.com/intent/tweet?text=http://www.google.com/" title="Share on Twitter"><span class="icon icon-twitter"></span><span class="count">Tweet</span></a></li><li class="googleplus"><a href="https://plus.google.com/share?url=http://www.google.com/" title="Share on Google Plus"><span class="icon icon-googleplus"></span><span class="count">+1</span></a></li></ul>' );
		}
	});

	asyncTest( 'Test Mock Request to Service', 3, function() {
		var dfd = $.Deferred(),
			$test = $( '#test' ),
			gplusLabel = $test.find( '.googleplus .count' ).html();

		SocialCount.cache['http://www.google.com/'] = dfd.promise();

		SocialCount.getCounts( $test, 'http://www.google.com/' ).done(function() {
			strictEqual( $test.find( '.twitter .count' ).html(), '11.5M' );
			strictEqual( $test.find( '.facebook .count' ).html(), '5.2M' );
			strictEqual( $test.find( '.googleplus .count' ).html(), '1.6M' );

			start();
		});

		window.setTimeout(function() {
			dfd.resolve({
				'twitter': 11464062,
				'facebook': 5189703,
				'googleplus': 1570539
			});
		}, 50 );
	});

	asyncTest( 'Test Mock Request to Service, Less than Min Count', 3, function() {
		var dfd = $.Deferred(),
			$test = $( '#test' ),
			gplusLabel = $test.find( '.googleplus .count' ).html();

		SocialCount.cache['http://www.google.com/'] = dfd.promise();

		SocialCount.getCounts( $test, 'http://www.google.com/' ).done(function() {
			strictEqual( $test.find( '.twitter .count' ).html(), '11.5M' );
			strictEqual( $test.find( '.facebook .count' ).html(), '5.2M' );
			strictEqual( $test.find( '.googleplus .count' ).html(), gplusLabel );

			start();
		});

		window.setTimeout(function() {
			dfd.resolve({
				'twitter': 11464062,
				'facebook': 5189703,
				'googleplus': SocialCount.minCount - 1
			});
		}, 50 );
	});

	module('testInitializeNoUrl', {
		setup: function() {
			var $fixture = $('#qunit-fixture'),
				$test;

			$fixture.append( '<ul id="test" class="socialcount"></ul>' );

			$test = $( '#test' );
			SocialCount.init( $test );
		}
	});

	test( 'Fall back to document URL', function() {
		equal( SocialCount.getUrl( $('#test') ), location.href );
	});

	module('testInitializeFacebookRecommend', {
		setup: function() {
			var $fixture = $('#qunit-fixture'),
				$test;

			$fixture.append( '<ul id="test" class="socialcount" data-facebook-action="recommend"></ul>' );

			$test = $( '#test' );
			SocialCount.init( $test );
		}
	});

	test( 'Retrieve Facebook Action', function() {
		equal( SocialCount.getFacebookAction( $('#test') ), 'recommend' );
	});

	module('testInitializeSmall', {
		setup: function() {
			var $fixture = $('#qunit-fixture'),
				$test;

			$fixture.append( '<ul id="test" class="socialcount socialcount-small"></ul>' );

			$test = $( '#test' );
			SocialCount.init( $test );
		}
	});

	test( 'Test if Small', function() {
		equal( SocialCount.isSmallSize( $('#test') ), true );
	});

		// $fixture.append( '<ul id="test" class="socialcount"><li class="facebook"><a href="https://www.facebook.com/sharer/sharer.php?u=http://www.google.com/" title="Share on Facebook"><span class="icon icon-facebook"></span><span class="count">Like</span></a></li><li class="twitter"><a href="https://twitter.com/intent/tweet?text=http://www.google.com/" title="Share on Twitter"><span class="icon icon-twitter"></span><span class="count">Tweet</span></a></li><li class="googleplus"><a href="https://plus.google.com/share?url=http://www.google.com/" title="Share on Google Plus"><span class="icon icon-googleplus"></span><span class="count">+1</span></a></li></ul>' );
}( jQuery ));
