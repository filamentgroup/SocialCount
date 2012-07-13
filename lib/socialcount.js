(function( exports ) {

	SocialCount = {
		cache: {},
		thousandCharacter: 'K',
		missingResultText: '-',
		dataKeyToSelectorsMap: {
			facebook: '.facebook .count',
			twitter: '.twitter .count',
			googleplus: '.googleplus .count'
		},
		isIeLte8: function() {
			// Props to https://gist.github.com/527683
			var div = document.createElement('div');
			div.innerHTML = '<!--[if lte IE 8]><i></i><![endif]-->';

			return div.getElementsByTagName('i').length > 0;
		},
		init: function( $el ) {
			var url = $el.attr('data-url') || window.location.href,
				orientation = $el.attr('data-orientation' );

			SocialCount.fetch( url, function complete( data ) {
				var map = SocialCount.dataKeyToSelectorsMap;
				$el.addClass('js');

				for( var j in data ) {
					if( data.hasOwnProperty(j) ) {
						$el.find( map[j] ).html( SocialCount.normalizeCount( data[j] ) );
					}
				}
			});

			if( orientation ) {
				$el.addClass( orientation );
			}

			// Since there isn't a safe CSS Hack for IE8 and below, we add a helper class here.
			// Needed because IE8 doesn't support filter rotation on pseudo elements.
			if( SocialCount.isIeLte8() ) {
				$el.addClass('ie-lte8');
			}
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
			// TODO add commas for >= 1M
			if( count > 100000 ) {
				return Math.floor( count / 1000 ) + SocialCount.thousandCharacter;
			}
			if( count > 1000 ) {
				return ( count / 1000 ).toFixed(1).replace( /\.0/, '' ) + SocialCount.thousandCharacter;
			}
			return count;
		}
	};


	exports.SocialCount = SocialCount;

})( typeof exports === 'object' && exports || this );