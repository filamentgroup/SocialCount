/*global jQuery console */
;(function( win, doc, $ ) {

	var $loadingIndicator,
			Modernizr = window.Modernizr;

	var SocialCount = {
		// For A-grade experience, require querySelector (IE8+) and not BlackBerry or touchscreen
		isGradeA: 'querySelectorAll' in doc && !win.blackberry && !('ontouchstart' in window) && !('onmsgesturechange' in window),
		initSelector: '.socialcount',
		classes: {
			gradeA: 'grade-a',
			active: 'active',
			touch: 'touch',
			hover: 'hover',
			activateOnHover: 'activate-on-hover',
			activateOnClick: 'activate-on-click',
		},
		activateOnClick: false, // default is hover
		selectors: {
			facebook: '.facebook',
			twitter: '.twitter',
			googleplus: '.googleplus',
			vk: '.vk',
			odnoklassniki: '.odnoklassniki'
		},
		locale: doc.documentElement ? ( doc.documentElement.lang || '' ) : '',
		googleplusTooltip: 'table.gc-bubbleDefault',
		vkElementID: 'vk_like',
		vkType: "button", 

		getUrl: function( $el ) {
			return $el.attr('data-url') || location.href;
		},
		// Currently only available on Twitter
		getShareText: function( $el ) {
			return $el.attr('data-share-text' ) || '';
		},
		getVKOptions: function($el) {
			return {
				vkElementID: $el.attr('data-vk-id') || SocialCount.vkElementID,
				vkApiID: $el.attr('data-vk-api'),
				vkType: $el.attr('data-vk-type') || SocialCount.vkType
			};
		},
		init: function( $el ) {
			var options = {},
					classes = [],
					url = SocialCount.getUrl( $el );

			if( SocialCount.isGradeA ) {
				classes.push( SocialCount.classes.gradeA );
			}
			if( SocialCount.activateOnClick ) {
				classes.push( SocialCount.classes.activateOnClick );
			} else {
				classes.push( SocialCount.classes.activateOnHover );
			}
			if( SocialCount.locale ) {
				classes.push( SocialCount.locale );
			}
			if ( $el.children('.vk').length > 0 ) {
				options.vk = SocialCount.getVKOptions( $el );
				classes.push( 'vk-' + options.vk.vkType );
			}
			
			$el.addClass( classes.join(' ') );

			if( SocialCount.isGradeA ) {
				SocialCount.bindEvents( $el, url, options );
			}
		},
		bindEvents: function( $el, url, options ) {
			function bind( $a, html, jsUrl, jsInline ) {
				// IE bug (tested up to version 9) with :hover rules and iframes.
				var isTooltipActive = false,
					isHoverActive = false;

				$li = $a.closest( 'li' );
				$li.on( 'mouseenter', function( event ) {
					var $li = $( this ).closest( 'li' );

					$li.addClass( SocialCount.classes.hover );

					isHoverActive = true;

					$( document ).on( 'mouseenter.socialcount mouseleave.socialcount', SocialCount.googleplusTooltip, function( event ) {
						isTooltipActive = event.type === 'mouseenter';

						if( !isTooltipActive && !isHoverActive ) {
							$li.removeClass( SocialCount.classes.hover );
						}
					});
				}).on( 'mouseleave', function( event ) {
					var self = this;
					window.setTimeout(function() {
						isHoverActive = false;

						if( !isTooltipActive && !isHoverActive ) {
							$( document ).off( '.socialcount' );
							$( self ).closest( 'li' ).removeClass( SocialCount.classes.hover );
						}
					}, 0);
				});

				$li.one( SocialCount.activateOnClick ? 'click' : 'mouseover', function( event ) {
					if( SocialCount.activateOnClick ) {
						event.preventDefault();
						event.stopPropagation();
					}

					var $self = $( this ),
						$loading = $loadingIndicator.clone(),
						$content = $( html ),
						$button = $( '<div class="button"/>' ).append( $content ),
						js,
						$iframe,
						deferred = $.Deferred();

					deferred.promise().always(function() {
						//Execute optional init js
						if ( jsInline && typeof jsInline === 'function' )
								jsInline();

						// Remove Loader
						var $iframe = $self.find('iframe');

						if( $iframe.length ) {
							$iframe.on( 'load', function() {
								$loading.remove();
							});
						} else {
							$loading.remove();
						}
					});

					$self
						.addClass( SocialCount.classes.active )
						.append( $loading )
						.append( $button );

					if( jsUrl ) {
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
							$( js ).on( 'load', deferred.resolve );
						}

						doc.body.appendChild( js );
					} else if( $content.is( 'iframe' ) ) {
						deferred.resolve();
					}
				});
			} // end bind()

			var shareText = SocialCount.getShareText( $el );

			bind( $el.find( SocialCount.selectors.facebook + ' a' ),
				'<iframe src="//www.facebook.com/plugins/like.php?href=' + encodeURI( url ) +
					( SocialCount.locale ? '&locale=' + SocialCount.locale : '' ) +
					'&send=false&layout=button_count&width=100&show_faces=true&action=like&colorscheme=light&font=arial&height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden;" allowTransparency="true"></iframe>' );

			bind( $el.find( SocialCount.selectors.twitter + ' a' ),
				'<a href="https://twitter.com/share" class="twitter-share-button"' +
					' data-url="' + encodeURI( url ) + '"' +
					( shareText ? ' data-text="' + shareText + '"': '' ) +
					' data-count="none" data-dnt="true">Tweet</a>',
				'//platform.twitter.com/widgets.js' );

			bind( $el.find( SocialCount.selectors.googleplus + ' a' ),
				'<div class="g-plusone" data-size="medium" data-annotation="none"></div>',
				'//apis.google.com/js/plusone.js' );		

			bind( $el.find( SocialCount.selectors.odnoklassniki + ' a' ),
				'<a target="_blank" class="mrc__plugin_uber_like_button" href="http://connect.mail.ru/share" data-mrc-config="{\'cm\' : \'1\', \'ck\' : \'1\', \'sz\' : \'20\', \'st\' : \'2\', \'tp\' : \'ok\', \'width\' : \'91%\'}">Нравится</a>',
				'//cdn.connect.mail.ru/js/loader.js' );		

			if ( options.vk ) {
				bind( $el.find( SocialCount.selectors.vk + ' a' ),
					'<div id="' + options.vk.vkElementID + '"></div>',
					'//vk.com/js/api/openapi.js',
					function(){
						if (!VK._apiId) //Init only the first time
							VK.init({apiId: options.vk.vkApiID, onlyWidgets: true});
						VK.Widgets.Like(options.vk.vkElementID, {type: options.vk.vkType});
					});
			}
		} // end bindEvents()
	};

	$(function() {
		// Thanks to http://codepen.io/ericmatthys/pen/FfcEL
		$loadingIndicator = $('<div>')
			.addClass('loading')
			.html( Modernizr.cssanimations ? new Array(4).join('<div class="dot"></div>') : 'Loading' );

		$( SocialCount.initSelector ).each(function() {
			var $el = $(this);
			SocialCount.init($el);
		});
	});

	window.SocialCount = SocialCount;

}( window, window.document, jQuery ));