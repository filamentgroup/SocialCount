/*global jQuery console */
;(function( win, doc, $ ) {

	var Modernizr = window.Modernizr;

	$.socialCount = function( options, el ){

		this.$el = $(el);

		// Thanks to http://codepen.io/ericmatthys/pen/FfcEL
		this.$loadingIndicator = $('<div>').addClass('loading')
				.html( Modernizr.cssanimations ? new Array(4).join('<div class="dot"></div>') : 'Loading' );

		this._init( options );
	};

	$.socialCount.prototype = {
	
		_init: function( options ) {

			this.options = $.extend( {}, $.socialCount.defaults, options);

			// if( SocialCount.locale ) {
			// 	classes.push( SocialCount.locale );
			// }

			// required API ID for vk.com
			if ( $.inArray( 'vk', this.options.socialSites ) >= 0 )
				this.options.vkApiID = this.$el.data('vk-api');

			// create markup and append it to the element
			this._constructButtons();

			// ~= if desktop
			//if( this._isGradeA )
				this._initEvents();
		},

		// create markup
		_constructButtons: function(){
			this.socialButtons = {};

			for (var i = 0; i < this.options.socialSites.length; i++) {
				var site = this.options.socialSites[i];

				var $li = $('<li>')
					.addClass( site )
					.data( 'site', site )
					.append( 
						$('<a />').attr({
							href: this.options.sitesConfig[site].url,
							title: 'Share on ' + site
						})
						.text( this.options.sitesConfig[site].label )
						.append( $('<div />').addClass('button') )
					);

				this.socialButtons[site] = $li;
				this.$el.append( $li );
			};
		},

		// For A-grade experience, require querySelector (IE8+) and not BlackBerry or touchscreen
		// _isGradeA: function() {
		// 	return 'querySelectorAll' in doc && !win.blackberry && !('ontouchstart' in window) && !('onmsgesturechange' in window);
		// },

		_initEvents: function() {

			function bind( $li, jsUrl, jsInline ) {
				// IE bug (tested up to version 9) with :hover rules and iframes.
				var isTooltipActive = false,
					isHoverActive = false,
					self = this;

				$li.on( 'mouseenter', function( event ) {
					var $li = $( this );

					$li.addClass( self.options.classes.hover );

					isHoverActive = true;

					$( document ).on( 'mouseenter.socialcount mouseleave.socialcount', self.options.googleplusTooltip, function( event ) {
						isTooltipActive = event.type === 'mouseenter';

						if( !isTooltipActive && !isHoverActive ) {
							$li.removeClass( self.options.classes.hover );
						}
					});
				}).on( 'mouseleave', function( event ) {
					var that = this;
					window.setTimeout(function() {
						isHoverActive = false;

						if( !isTooltipActive && !isHoverActive ) {
							$( document ).off( '.socialcount' );
							$( that ).closest( 'li' ).removeClass( self.options.classes.hover );
						}
					}, 0);
				});

				$li.on( self.options.activateOnClick ? 'click' : 'mouseover', function( event ) {
					if( self.options.activateOnClick ) {
						event.preventDefault();
						event.stopPropagation();
					}

					var $li = $(this),
						$el = $li.closest('ul'),
						url = encodeURI( $el.data('url') || location.href ),
						shareText = $el.data('share-text' ) || document.title;

					// url and shareText didn't change -> no need to reload the buttons
					if ( $li.data('cached') && 
						 url == $el.data('cached-url') && 
						 shareText == $el.data('cached-share-text') )
						return false;

				
					var	site = $li.data('site'),
						content,
						js,
						deferred = $.Deferred(),
						$loading = self.$loadingIndicator.clone(),
						$iframe;

					switch (site) {
						case "facebook":
							content = '<iframe src="//www.facebook.com/plugins/like.php?href=' + url +
								'&send=false&layout=button_count&width=100&show_faces=true&action=like&colorscheme=light&font=arial&height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden;" allowTransparency="true"></iframe>';
							break;
						case "twitter":
							content = '<a href="https://twitter.com/share" class="twitter-share-button" data-url="' + url + '"' +
									  ( shareText ? ' data-text="' + shareText + '"': '' ) + ' data-count="none" data-dnt="true">Tweet</a>';
							break;
						case "googleplus":
							content = '<div class="g-plusone" data-size="medium" data-annotation="none" data-href="' + url + '"></div>';
							break;
						case "vk":
							content = '<div id="' + self.options.vkElementID + '"></div>';
							break;
						case "odnoklassniki":
							content = '<a target="_blank" class="mrc__plugin_uber_like_button" href="http://connect.mail.ru/share?url=' + url + '" data-mrc-config="{\'cm\' : \'1\', \'ck\' : \'1\', \'sz\' : \'20\', \'st\' : \'2\', \'tp\' : \'ok\', \'width\' : \'100%\'}">Нравится</a>'
							break;
					}

					var $content = $(content);
				
					deferred.promise().always(function() {
						//Execute optional init js
						if ( jsInline && typeof jsInline === 'function' )
								jsInline( url, shareText );

						// Remove Loader
						var $iframe = $li.find('iframe');

						if( $iframe.length ) {
							$iframe.on( 'load', function() {
								$loading.remove();
							});
						} else {
							$loading.remove();
						}
					});

					$li.addClass( self.options.classes.active ).append( $loading ).find('.button').html( $content );
					
					// add cached attributes
					$el.data({
						'cached-url': url,
						'cached-share-text': shareText
					});
					$li.data( 'cached', true )

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
			}

			if ( 'facebook' in this.socialButtons ) 
				bind.call(this, this.socialButtons['facebook'] );
			
			if ( 'twitter' in this.socialButtons ) 
				bind.call(this, this.socialButtons['twitter'],
				  '//platform.twitter.com/widgets.js' );
			
			if ( 'googleplus' in this.socialButtons ) 
				bind.call(this, this.socialButtons['googleplus'],
				  '//apis.google.com/js/plusone.js' );
			
			if ( 'odnoklassniki' in this.socialButtons ) 
				bind.call(this, this.socialButtons['odnoklassniki'],
				  '//cdn.connect.mail.ru/js/loader.js' );

			if ( 'vk' in this.socialButtons ) {
				bind.call(this, this.socialButtons['vk'],
					'//vk.com/js/api/openapi.js',
					$.proxy( function( url, shareText ){
						if (!VK._apiId) //Init only the first time
							VK.init( { 
								apiId: this.options.vkApiID, 
								onlyWidgets: true
							});
						VK.Widgets.Like( this.options.vkElementID, { type: 'button', pageUrl: url, pageTitle: shareText } );
					}, this )
				);
			}

		},

		// change share text/url and remove all cache
		changeInfo: function( url, shareText ){
			if ( url )
				this.$el.data('url', url);
			if ( shareText )
				this.$el.data('share-text', shareText);
			
			if ( url || shareText )
				this.removeCached();
		},
		// remove cached booleans
		removeCached: function(){
			this.$el.children().removeData('cached');
		}
	};


	$.socialCount.defaults = {
		// css classes that would be added on specific actions
		classes: {
			active: 'active',
			touch: 'touch',
			hover: 'hover',
			activateOnHover: 'activate-on-hover',
			activateOnClick: 'activate-on-click',
		},
		activateOnClick: false, // default is hover
		// list of social sites, which buttons would be added to the page
		socialSites: [ 'facebook', 'twitter', 'googleplus', 'vk', 'odnoklassniki' ],
		// config for social sites
		sitesConfig: {
			facebook: {
				label: 'Like',
				url: 'https://www.facebook.com/sharer/sharer.php'
			},
			twitter: {
				label: 'Tweet',
				url: 'https://twitter.com/intent/tweet'
			},
			googleplus: {
				label: '+1',
				url: 'https://plus.google.com/share'
			},
			vk: {
				label: 'Like',
				url: 'https://vk.com/share.php'
			},
			odnoklassniki: {
				label: 'Класс',
				url: 'http://connect.mail.ru/share'
			}
		},
		//locale: doc.documentElement ? ( doc.documentElement.lang || '' ) : '',
		googleplusTooltip: 'table.gc-bubbleDefault', // selector for g+ popup
		vkElementID: 'vk_like' // ID of vk.com element
	};


	//socialCount: Plugin Function
	$.fn.socialCount = function(options) {
		if ( typeof options === 'string' ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			this.each(function() {
				var instance = $.data( this, 'socialCount' );
				if ( !instance ) {
					logError( "cannot call methods on socialCount prior to initialization; " +
					"attempted to call method '" + options + "'" );
					return;
				}
				if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
					logError( "no such method '" + options + "' for socialCount instance" );
					return;
				}
				instance[ options ].apply( instance, args );
			});
		} else {
			this.each(function() {	
				var instance = $.data( this, 'socialCount' );
				if ( instance ) {
					instance._init();
				} else {
					instance = $.data( this, 'socialCount', new $.socialCount( options, this ) );
				}
			});
		}
		return this;
  }


}( window, window.document, jQuery ));