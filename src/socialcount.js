/*! SocialCount - v0.1.0 - 2012-07-24
* https://github.com/filamentgroup/SocialCount
* Copyright (c) 2012 zachleat; Licensed MIT */

(function( win, doc, $ ) {

	var $loadingIndicator,
		$count;

	function featureTest( prop, unprefixedProp ) {
		var style = doc.createElement('social').style,
			prefixes = 'webkit Moz o ms'.split(' ');

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

	var SocialCount = {
		showCounts: true,
		// For A-grade experience, require querySelector (IE8+) or if Blackberry require OS >= 6
		isGradeA: 'querySelectorAll' in doc && !( win.blackberry && !win.WebKitPoint ),
		minCount: 50,
		serviceUrl: '../service/index.php',
		initSelector: '.socialcount',
		gradeAClass: 'grade-a',
		activeClass: 'active',
		noTransformsClass: 'no-transforms',
		showCountsClass: 'counts',
		countContentClass: 'count',
		minCountClass: 'minimum',
		thousandCharacter: 'K',
		millionCharacter: 'M',
		missingResultText: '-',
		classes: {
			facebook: '.facebook',
			twitter: '.twitter',
			googleplus: '.googleplus'
		},
		plugins: {
			init: [],
			bind: []
		},

		// private, but for testing
		cache: {},

		isCssAnimations: function() {
			return featureTest( 'AnimationName', 'animationName' );
		},
		isCssTransforms: function() {
			return featureTest( 'Transform', 'transform' );
		},
		getUrl: function( $el ) {
			return $el.attr('data-url') || location.href;
		},
		getFacebookAction: function( $el ) {
			return ( $el.attr('data-facebook-action' ) || 'like' ).toLowerCase();
		},
		isSmallSize: function( $el ) {
			return $el.is( '.socialcount-small' );
		},
		getCounts: function( $el, url ) {
			var map = SocialCount.classes,
				cache = SocialCount.cache,
				counts = {},
				$networkNode,
				$countNode,
				j;

			for( j in map ) {
				$networkNode = $el.find( map[ j ] );
				$countNode = $networkNode.find( '.' + SocialCount.countContentClass );

				if( $countNode.length ) {
					counts[ j ] = $countNode;
				} else {
					counts[ j ] = $count.clone();
					$networkNode.append( counts[ j ] );
				}
			}

			if( !cache[ url ] ) {
				cache[ url ] = $.ajax({
					url: SocialCount.serviceUrl,
					data: {
						url: url
					},
					dataType: 'json'
				});
			}

			cache[ url ].done( function complete( data ) {
				for( var j in data ) {
					if( data.hasOwnProperty( j ) ) {
						if( counts[ j ] && data[ j ] > SocialCount.minCount ) {
							counts[ j ].addClass( SocialCount.minCountClass )
								.html( SocialCount.normalizeCount( data[ j ] ) );
						}
					}
				}
			});

			return cache[ url ];
		},
		init: function( $el ) {
			var facebookAction = SocialCount.getFacebookAction( $el ),
				classes = [ facebookAction ],
				isSmall = SocialCount.isSmallSize( $el ),
				url = SocialCount.getUrl( $el ),
				initPlugins = SocialCount.plugins.init;

			if( SocialCount.isGradeA ) {
				classes.push( SocialCount.gradeAClass );
			}
			if( !SocialCount.isCssTransforms() ) {
				classes.push( SocialCount.noTransformsClass );
			}
			if( SocialCount.showCounts ) {
				classes.push( SocialCount.showCountsClass );
			}
			$el.addClass( classes.join(' ') );

			for( var j = 0, k = initPlugins.length; j < k; j++ ) {
				initPlugins[ j ].call( $el );
			}

			if( SocialCount.isGradeA ) {
				SocialCount.bindEvents( $el, url, facebookAction, isSmall );
			}

			if( SocialCount.showCounts && !isSmall ) {
				SocialCount.getCounts( $el, url );
			}
		},
		normalizeCount: function( count ) {
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
		bindEvents: function( $el, url, facebookAction, isSmall ) {
			function bind( $a, html, jsUrl ) {
				// IE bug (tested up to version 9) with :hover rules and iframes.
				$a.closest('li').bind('mouseenter', function() {
					$( this ).closest( 'li' ).addClass( 'hover' );
				}).bind('mouseleave', function() {
					$( this ).closest( 'li' ).removeClass( 'hover' );
				});

				$a.one( 'click', function( event ) {
						$( this ).trigger( 'mouseover' );
						event.preventDefault();
					}).one( 'mouseover', function() {
						var $self = $( this ),
							$parent = $self.closest( 'li' ),
							$loading = $loadingIndicator.clone(),
							$content = $( html ),
							$button = $( '<div class="button"/>' ).append( $content ),
							js,
							$iframe,
							deferred = $.Deferred();

						deferred.promise().always(function() {
							// Remove Loader
							var $iframe = $parent.find('iframe');

							if( $iframe.length ) {
								$iframe.bind( 'load', function() {
									$loading.remove();
								});
							} else {
								$loading.remove();
							}
						});

						$parent
							.addClass( SocialCount.activeClass )
							.append( $loading )
							.append( $button );

						if( jsUrl ) {
							js = doc.createElement( 'script' );
							js.src = jsUrl;

							// IE8 doesn't do script onload.
							if( js.attachEvent ) {
								js.attachEvent( 'onreadystatechange', function() {
									if( js.readyState === 'complete' ) {
										deferred.resolve();
									}
								});
							} else {
								$(js).bind( 'load', deferred.resolve );
							}

							doc.body.appendChild( js );
						} else if( $content.is( 'iframe' ) ) {
							deferred.resolve();
						}
					});
			}

			if( !isSmall ) {
				bind( $el.find( SocialCount.classes.facebook + ' a' ),
					'<iframe src="//www.facebook.com/plugins/like.php?href=' + encodeURI( url ) + '&amp;send=false&amp;layout=button_count&amp;width=100&amp;show_faces=true&amp;action=' + facebookAction + '&amp;colorscheme=light&amp;font=arial&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden;" allowTransparency="true"></iframe>' );

				bind( $el.find( SocialCount.classes.twitter + ' a' ),
					'<a href="https://twitter.com/share" class="twitter-share-button" data-count="none">Tweet</a>',
					'//platform.twitter.com/widgets.js' );

				bind( $el.find( SocialCount.classes.googleplus + ' a' ),
					'<div class="g-plusone" data-size="medium" data-annotation="none"></div>',
					'//apis.google.com/js/plusone.js' );
			}

			var bindPlugins = SocialCount.plugins.bind;
			for( var j = 0, k = bindPlugins.length; j < k; j++ ) {
				bindPlugins[ j ].call( $el, bind, url, isSmall );
			}
		}
	};

	$(function() {
		// Thanks to http://codepen.io/ericmatthys/pen/FfcEL
		$loadingIndicator = $('<div>')
			.addClass('loading')
			.html( SocialCount.isCssAnimations() ? new Array(4).join('<div class="dot"></div>') : 'Loading' );

		if( SocialCount.showCounts ) {
			$count = $('<span>')
				.addClass( SocialCount.countContentClass )
				.html('&#160;');
		}

		$( SocialCount.initSelector ).each(function() {
			var $el = $(this);
			SocialCount.init($el);
		});
	});

	window.SocialCount = SocialCount;

}( window, window.document, jQuery ));