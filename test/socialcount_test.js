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
