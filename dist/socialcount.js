/*! SocialCount - v0.1.10 - 2015-01-29
* https://github.com/filamentgroup/SocialCount
* Copyright (c) 2015 zachleat; Licensed MIT */

;(function( win, doc, $ ) {

	var $loadingIndicator,
		$count,
		addedScripts = {};

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

	function removeFileName( src ) {
		var split = src.split( '/' );
		split.pop();
		return split.join( '/' ) + '/';
	}

	function resolveServiceDir() {
		var baseUrl;

		$( 'script' ).each(function() {
			var src = this.src || '';
			if( src.match( SocialCount.scriptSrcRegex ) ) {
				baseUrl = removeFileName( src );
				return false;
			}
		});

		return baseUrl;
	}

	var SocialCount = {
		// For A-grade experience, require querySelector (IE8+) and not BlackBerry or touchscreen
		isGradeA: 'querySelectorAll' in doc && !win.blackberry && !('ontouchstart' in window) &&
			// Note that this feature test does not account for the Windows Phone version that includes IE9
			// IE 10 desktop (non-touch) returns 0 for msMaxTouchPoints
			( typeof window.navigator.msMaxTouchPoints === 'undefined' || window.navigator.msMaxTouchPoints === 0 ),
		minCount: 1,
		serviceUrl: 'service/index.php',
		initSelector: '.socialcount',
		classes: {
			js: 'js',
			gradeA: 'grade-a',
			loaded: 'loaded',
			hover: 'hover',
			noTransforms: 'no-transforms',
			showCounts: 'counts',
			countContent: 'count',
			minCount: 'minimum',
			activateOnHover: 'activate-on-hover',
			activateOnClick: 'activate-on-click'
		},
		thousandCharacter: 'K',
		millionCharacter: 'M',
		missingResultText: '-',
		activateOnClick: false, // default is hover
		hoverDelay: 200, // in milliseconds
		selectors: {},
		locale: (function() {
			var locale = doc.documentElement ? ( doc.documentElement.lang || '' ) : '';
			locale = locale.replace(/\-/, '_');
			return locale.match(/\w{2}_\w{2}/) ? locale : '';
		})(),
		extraHoverTargets: 'table.gc-bubbleDefault', // google plus share bubble
		scriptSrcRegex: /socialcount[\w.]*.js/i,
		plugins: {
			init: [],
			bind: []
		},

		// private, but for testing
		cache: {},

		removeFileName: removeFileName,
		resolveServiceDir: resolveServiceDir,

		isCssAnimations: function() {
			return featureTest( 'AnimationName', 'animationName' );
		},
		isCssTransforms: function() {
			return featureTest( 'Transform', 'transform' );
		},
		getUrl: function( $el ) {
			return $el.attr('data-url') || location.href;
		},
		// Currently only available on Twitter
		getShareText: function( $el ) {
			return $el.attr('data-share-text' ) || '';
		},
		isCountsEnabled: function( $el ) {
			return $el.attr('data-counts') === 'true';
		},
		isSmallSize: function( $el ) {
			return $el.is( '.socialcount-small' );
		},
		getCounts: function( $el, url ) {
			var map = SocialCount.selectors,
				cache = SocialCount.cache,
				counts = {},
				$networkNode,
				$countNode,
				j;

			for( j in map ) {
				$networkNode = $el.find( map[ j ] );
				$countNode = $networkNode.find( '.' + SocialCount.classes.countContent );

				if( $countNode.length ) {
					counts[ j ] = $countNode;
				} else {
					counts[ j ] = $count.clone();
					$networkNode.append( counts[ j ] );
				}
			}

			if( !cache[ url ] ) {
				cache[ url ] = $.ajax({
					url: resolveServiceDir() + SocialCount.serviceUrl,
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
							counts[ j ].addClass( SocialCount.classes.minCount )
								.html( SocialCount.normalizeCount( data[ j ] ) );
						}
					}
				}
			});

			return cache[ url ];
		},
		load: function( $el ) {
			$el.find( "a" )
				.filter( ".socialcount li a" )
				.trigger( SocialCount.activateOnClick ? 'click' : 'mouseover' )
				.trigger( "mouseleave" );
		},
		init: function( $el ) {
			var classes = [],
				isSmall = SocialCount.isSmallSize( $el ),
				url = SocialCount.getUrl( $el ),
				initPlugins = SocialCount.plugins.init,
				countsEnabled = SocialCount.isCountsEnabled( $el );

			classes.push( SocialCount.classes.js );

			if( SocialCount.isGradeA ) {
				classes.push( SocialCount.classes.gradeA );
			}
			if( !SocialCount.isCssTransforms() ) {
				classes.push( SocialCount.classes.noTransforms );
			}
			if( countsEnabled ) {
				classes.push( SocialCount.classes.showCounts );
			}
			if( SocialCount.activateOnClick ) {
				classes.push( SocialCount.classes.activateOnClick );
			} else {
				classes.push( SocialCount.classes.activateOnHover );
			}
			if( SocialCount.locale ) {
				classes.push( SocialCount.locale );
			}
			$el.addClass( classes.join(' ') );

			for( var j = 0, k = initPlugins.length; j < k; j++ ) {
				initPlugins[ j ].call( $el );
			}

			if( SocialCount.isGradeA ) {
				SocialCount.bindEvents( $el, url, isSmall );
			}

			if( countsEnabled && !isSmall ) {
				SocialCount.getCounts( $el, url );
			}
		},
		normalizeCount: function( count ) {
			if( !count && count !== 0 ) {
				return SocialCount.missingResultText;
			}
			function getRounded( num ) {
				return ( num ).toFixed( 1 ).replace( /\.0/, '' );
			}
			// > 1M
			if( count >= 1000000 ) {
				return getRounded( count / 1000000 ) + SocialCount.millionCharacter;
			} else if( count >= 100000 ) { // > 100K
				return Math.floor( count / 1000 ) + SocialCount.thousandCharacter;
			} else if( count > 1000 ) {
				return getRounded( count / 1000 ) + SocialCount.thousandCharacter;
			}
			return count;
		},
		bindEvents: function( $el, url, isSmall ) {
			function bind( $a, html, jsUrl, subsequentInitCallback ) {
				// IE bug (tested up to version 9) with :hover rules and iframes.
				var isTooltipActive = false,
					isHoverActive = false,
					delayHoverTimer;

				$a.closest( 'li' ).bind( 'mouseenter', function() {
					var $li = $( this ).closest( 'li' );

					$li.addClass( SocialCount.classes.hover );

					if( SocialCount.activateOnClick ) {
						return;
					}
					isHoverActive = true;

					$( document ).on( 'mouseenter.socialcount mouseleave.socialcount', SocialCount.extraHoverTargets, function( event ) {
						isTooltipActive = event.type === 'mouseenter';

						if( !isTooltipActive && !isHoverActive ) {
							$li.removeClass( SocialCount.classes.hover );
						}
					});
				}).bind( 'mouseleave', function() {
					var self = this;
					window.clearTimeout( delayHoverTimer );

					if( SocialCount.activateOnClick ) {
						return;
					}

					window.setTimeout(function() {
						isHoverActive = false;

						if( !isTooltipActive && !isHoverActive ) {
							$( document ).off( '.socialcount' );
							$( self ).closest( 'li' ).removeClass( SocialCount.classes.hover );
						}
					}, 0);
				});

				function loadInitialJavaScript( $self ) {
					$a.unbind( ".socialcount" );

					var $parent = $self.closest( 'li' ),
						$loading = $loadingIndicator.clone(),
						$content = $( html ),
						$button = $( '<div class="button"/>' ).append( $content ),
						js,
						deferred = $.Deferred();

					deferred.promise().always(function() {
						$loading.remove();
					});

					$parent
						.addClass( SocialCount.classes.loaded ) // only for click to activate
						.append( $loading )
						.append( $button );

					if( jsUrl && addedScripts[ jsUrl ] && subsequentInitCallback ) {
						subsequentInitCallback( $button[ 0 ] );
						deferred.resolve();
					} else if( jsUrl ) {
						addedScripts[ jsUrl ] = true;
						js = doc.createElement( 'script' );
						js.src = jsUrl;

						// IE8 doesn't do script onload.
						if( js.attachEvent ) {
							js.attachEvent( 'onreadystatechange', function() {
								if( js.readyState === 'loaded' || js.readyState === 'complete' ) {
									deferred.resolve();
								}
							});
						} else {
							$( js ).bind( 'load', deferred.resolve );
						}

						doc.body.appendChild( js );
					}
				}

				$a.bind( SocialCount.activateOnClick ? 'click.socialcount' : 'mouseover.socialcount', function( event ) {
					var $self = $( this ),
						jsAlreadyLoaded = jsUrl && addedScripts[ jsUrl ] && subsequentInitCallback;
					window.clearTimeout( delayHoverTimer );
					if( !jsAlreadyLoaded && event.type === "mouseover" ) {
						delayHoverTimer = window.setTimeout(function() {
							loadInitialJavaScript( $self );
						}, SocialCount.hoverDelay );
					} else {
						if( event.type === "click" ) {
							event.preventDefault();
							event.stopPropagation();
						}
						loadInitialJavaScript( $self );
					}
				});
			} // end bind()

			if( !isSmall ) {
				var bindPlugins = SocialCount.plugins.bind;
				for( var j = 0, k = bindPlugins.length; j < k; j++ ) {
					bindPlugins[ j ].call( $el, bind, url, isSmall );
				}
			}
		} // end bindEvents()
	};

	$(function() {
		// Thanks to http://codepen.io/ericmatthys/pen/FfcEL
		$loadingIndicator = $('<div>')
			.addClass('loading')
			.html( SocialCount.isCssAnimations() ? new Array(4).join('<div class="dot"></div>') : 'Loading' );

		$count = $('<span>')
			.addClass( SocialCount.classes.countContent )
			.html('&#160;');

		$( SocialCount.initSelector ).each(function() {
			var $el = $(this);
			SocialCount.init($el);
		});
	});

	window.SocialCount = SocialCount;

}( window, window.document, jQuery ));

(function( $, SocialCount ) {

  SocialCount.selectors.facebook = '.facebook';

  SocialCount.getFacebookAction = function( $el ) {
    return ( $el.attr('data-facebook-action' ) || 'like' ).toLowerCase();
  };

  SocialCount.plugins.init.push(function() {
    var $el = this;
    $el.addClass( SocialCount.getFacebookAction( $el ) );
  });

  SocialCount.plugins.bind.push(function(bind, url) {
    var $el = this,
      facebookAction = SocialCount.getFacebookAction( $el );

    bind( $el.find( SocialCount.selectors.facebook + ' a' ),
      '<div class="fb-like" data-href="' + url + '" data-layout="button"' + 
        ' data-action="' + facebookAction + '" data-show-faces="false"' + 
        ' data-share="false"></div>',
      '//connect.facebook.net/' + ( SocialCount.locale || 'en_US' ) + '/sdk.js#xfbml=1&version=v2.0',
      function( el ) {
        FB.XFBML.parse( el );
      });
  });

})( jQuery, window.SocialCount );



(function( $, SocialCount ) {

  SocialCount.selectors.twitter = '.twitter';

  SocialCount.plugins.bind.push(function(bind, url) {
    var $el = this,
      shareText = SocialCount.getShareText( $el );

    bind( $el.find( SocialCount.selectors.twitter + ' a' ),
      '<a href="https://twitter.com/share" class="twitter-share-button"' +
        ' data-url="' + url + '"' +
        ( shareText ? ' data-text="' + shareText + '"': '' ) +
        ' data-count="none" data-dnt="true">Tweet</a>',
      '//platform.twitter.com/widgets.js',
      function( el ) {
        twttr.widgets.load( el );
      });
  });

})( jQuery, window.SocialCount );



(function( $, SocialCount ) {

  SocialCount.selectors.googleplus = '.googleplus';

  SocialCount.plugins.bind.push(function(bind, url) {
    var $el = this;

    bind( $el.find( SocialCount.selectors.googleplus + ' a' ),
      '<div class="g-plusone" data-size="medium" data-annotation="none" data-href="' + url + '"></div>',
      '//apis.google.com/js/plusone.js',
      function( el ) {
        gapi.plusone.go( el );
      });
  });

})( jQuery, window.SocialCount );



(function( $, SocialCount ) {

  SocialCount.selectors.pinterest = '.pinterest';

  SocialCount.plugins.bind.push(function(bind, url) {
    var $el = this;

    var desc = $el.data('description');
    var media = $el.data('media');

    bind( $el.find( SocialCount.selectors.pinterest ),
      '<a href="http://pinterest.com/pin/create/button/?url=' + url + '&media=' + media + '&description=' + desc + '" class="pin-it-button" count-layout="none"><img border="0" src="//assets.pinterest.com/images/PinExt.png" title="Pin It" /></a>',
      '//assets.pinterest.com/js/pinit.js',
      function( el ) {
        // Thanks http://sourcey.com/dynamically-rendering-ajax-pinterest-buttons/
        // See also https://github.com/pinterest/widgets/blob/master/pinit_main.js
        for( var i in window ) {
          if( i.indexOf( 'PIN_' ) === 0 && typeof window[i] === 'object' ) {
            window[ i ].f.render.buttonPin( $( el ).find( "a" )[ 0 ] );
            return;
          }
        }
      });
  });

})( jQuery, window.SocialCount );


