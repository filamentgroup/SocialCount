(function( exports ) {

	SocialCount = {
		cache: {},
		thousandCharacter: 'K',
		millionCharacter: 'M',
		missingResultText: '-',
		classes: {
			facebook: '.facebook',
			twitter: '.twitter',
			googleplus: '.googleplus'
		},
		isIeLte8: function() {
			// Props to https://gist.github.com/527683
			var div = document.createElement('div');
			div.innerHTML = '<!--[if lte IE 8]><i></i><![endif]-->';

			return div.getElementsByTagName('i').length > 0;
		},
		init: function( $el ) {
			var url = $el.attr('data-url') || window.location.href,
				orientation = $el.attr('data-orientation' ) || 'horizontal-inline';

			SocialCount.fetch( url, function complete( data ) {
				var map = SocialCount.classes;
				$el.addClass('js');

				for( var j in data ) {
					if( data.hasOwnProperty(j) ) {
						$el.find( map[j] + ' .count' ).html( SocialCount.normalizeCount( data[j] ) );
					}
				}
			});

			$el.addClass( orientation );

			// Since there isn't a safe CSS Hack for IE8 and below, we add a helper class here.
			// Needed because IE8 doesn't support filter rotation on pseudo elements.
			if( SocialCount.isIeLte8() ) {
				$el.addClass('ie-lte8');
			}

			SocialCount.bindEvents( $el, url );
		},
		fetch: function( url, callback ) {
			if( !SocialCount.cache[ url ] ) {
				$.ajax({
					url: '../service/index.php',
					data: {
						url: url
					},
					dataType: 'json'
				}).done( function( data ) {
					SocialCount.cache[ url ] = data;

					callback( data );
				});
			} else {
				callback( SocialCount.cache[ url ] );
			}
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
		bindEvents: function( $el, url )
		{
			function bind( $a, html, jsUrl )
			{
				$a.one( 'mouseover', function() {
						$( this ).replaceWith( html );

						var js;
						if( jsUrl ) {
							js = document.createElement( 'script' );
							js.src = jsUrl;

							document.body.appendChild( js );
						}
					});
			}

			bind( $el.find( SocialCount.classes.facebook + ' a' ),
				'<iframe src="//www.facebook.com/plugins/like.php?href=' + encodeURI( url ) + '&amp;send=false&amp;layout=button_count&amp;width=100&amp;show_faces=true&amp;action=recommend&amp;colorscheme=light&amp;font=arial&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden;" allowTransparency="true"></iframe>' );

			bind( $el.find( SocialCount.classes.twitter + ' a' ),
				'<a href="https://twitter.com/share" class="twitter-share-button" data-count="none">Tweet</a>',
				'//platform.twitter.com/widgets.js' );

			bind( $el.find( SocialCount.classes.googleplus + ' a' ),
				'<div class="g-plusone" data-size="medium" data-annotation="none"></div>',
				'//apis.google.com/js/plusone.js' );
		}
	};


	exports.SocialCount = SocialCount;

})( typeof exports === 'object' && exports || this );