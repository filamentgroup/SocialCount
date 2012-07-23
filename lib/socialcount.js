(function( exports ) {

	// TODO: get running with wrap
	// TODO: make document global portable through exports

	var $loadingIndicator,
		$count,
		cache = {};

	function featureTest( prop, unprefixedProp )
	{
		var style = document.createElement('social').style;
			prefixes = 'webkit moz o ms'.split(' ');

		if( unprefixedProp in style ) {
			return true;
		}
		for( var j = 0, k = prefixes.length; j < k; j++ ) {
			if( ( prefixes[ j ] + prop ) in style ) {
				return true;
			}
		}
		return false;
	}

	SocialCount = {
		showCounts: true,
		serviceUrl: '../service/index.php',
		initSelector: '.socialcount',
		activeClass: 'active',
		noTransformsClass: 'no-transforms',
		countsClass: 'counts',
		thousandCharacter: 'K',
		millionCharacter: 'M',
		missingResultText: '-',
		classes: {
			facebook: '.facebook',
			twitter: '.twitter',
			googleplus: '.googleplus'
		},
		isCssAnimations: function()
		{
			return featureTest( 'AnimationName', 'animationName' );
		},
		isCssTransforms: function()
		{
			return featureTest( 'Transform', 'transform' );
		},
		init: function( $el ) {
			var map = SocialCount.classes,
				counts = {},
				url = $el.attr('data-url') || location.href,
				orientation = $el.attr('data-orientation' ) || 'horizontal-inline',
				facebookAction = ( $el.attr('data-facebook-action' ) || 'like' ).toLowerCase(),
				classes = [ orientation, facebookAction ];

			if( !SocialCount.isCssTransforms() ) {
				classes.push( SocialCount.noTransformsClass );
			}
			if( SocialCount.showCounts ) {
				classes.push( SocialCount.countsClass );
			}
			$el.addClass( classes.join(' ') );

			if( SocialCount.showCounts ) {
				for( var j in map ) {
					counts[ j ] = $count.clone();
					$el.find( map[ j ] ).append( counts[ j ] );
				}

				if( !cache[ url ] ) {
					cache[ url ] = SocialCount.fetch( url );
				}

				cache[ url ].done( function complete( data )
				{
					for( var j in data ) {
						if( data.hasOwnProperty( j ) ) {
							counts[ j ].html( SocialCount.normalizeCount( data[ j ] ) );
						}
					}
				});
			}

			if('querySelectorAll' in document && !( exports.blackberry && !exports.WebKitPoint )) {
				SocialCount.bindEvents( $el, url, facebookAction );
			}
		},
		fetch: function( url ) {
			return $.ajax({
				url: SocialCount.serviceUrl,
				data: {
					url: url
				},
				dataType: 'json'
			});
		},
		normalizeCount: function( count )
		{
			if( !count && count !== 0 ) {
				return SocialCount.missingResultText;
			}
			// > 1M
			if( count >= 1000000 ) {
				return Math.floor( count / 1000000 ) + SocialCount.millionCharacter;
			}
			// > 100K
			if( count >= 100000 ) {
				return Math.floor( count / 1000 ) + SocialCount.thousandCharacter;
			}
			if( count > 1000 ) {
				return ( count / 1000 ).toFixed(1).replace( /\.0/, '' ) + SocialCount.thousandCharacter;
			}
			return count;
		},
		initLoadingIndicator: function()
		{
			// Thanks to http://codepen.io/ericmatthys/pen/FfcEL
			var $div = $(document.createElement('div')),
				dot = '<div class="dot"></div>';

			$div.addClass('loading');

			$div.html( SocialCount.isCssAnimations() ? dot + dot + dot : 'Loading' );

			return $div;
		},
		bindEvents: function( $el, url, facebookAction )
		{
			function bind( $a, html, jsUrl )
			{
				$a.one( 'click', function( event ) {
						$( this ).trigger( 'mouseover' );
						event.preventDefault();
					}).one( 'mouseover', function() {
						var $self = $( this ),
							$parent = $self.parent(),
							$loading = $loadingIndicator.clone(),
							$content = $(html);

						$parent.addClass( SocialCount.activeClass );
						$parent.append( $loading ).append( $content );

						if( jsUrl ) {
							js = document.createElement( 'script' );
							js.src = jsUrl;

							// IE8 doesn't do script onload.
							if( js.attachEvent ) {
								js.attachEvent( 'onreadystatechange', function()
								{
									if( js.readyState == 'complete' ) {
										$parent.find('iframe').bind( 'load', function() {
											$loading.remove();
										});
									}
								});
							} else {
								$(js).bind( 'load', function() {
									$parent.find('iframe').bind( 'load', function() {
										$loading.remove();
									});
								});
							}

							document.body.appendChild( js );
						} else if( $content.is( 'iframe' ) ) {
							$content.bind( 'load', function() {
								$loading.remove();
							});
						}
					});
			}

			bind( $el.find( SocialCount.classes.facebook + ' a' ),
				'<iframe src="//www.facebook.com/plugins/like.php?href=' + encodeURI( url ) + '&amp;send=false&amp;layout=button_count&amp;width=100&amp;show_faces=true&amp;action=' + facebookAction + '&amp;colorscheme=light&amp;font=arial&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden;" allowTransparency="true"></iframe>' );

			bind( $el.find( SocialCount.classes.twitter + ' a' ),
				'<a href="https://twitter.com/share" class="twitter-share-button" data-count="none">Tweet</a>',
				'//platform.twitter.com/widgets.js' );

			bind( $el.find( SocialCount.classes.googleplus + ' a' ),
				'<div class="g-plusone" data-size="medium" data-annotation="none"></div>',
				'//apis.google.com/js/plusone.js' );
		}
	};

	$(function() {
		$loadingIndicator = SocialCount.initLoadingIndicator();

		if( SocialCount.showCounts ) {
			$count = $('<span>').addClass('count').html('&#160;');
		}

		$( SocialCount.initSelector ).each(function()
		{
			var $el = $(this);
			SocialCount.init($el);
		});
	});

	exports.SocialCount = SocialCount;

})( typeof exports === 'object' && exports || this );