# SocialCount

Related: [Filament Group Lab Post][blogpost]

[blogpost]: http://filamentgroup.com/lab/socialcount/

The problems with social networking widgets are [well documented][zurb]. They're heavy and slow to load especially on high-latency mobile connections.

[zurb]: http://www.zurb.com/article/883/small-painful-buttons-why-social-media-bu

SocialCount is a small jQuery plugin for progressively enhanced, lazy loaded, mobile friendly social networking widgets.

 * Currently supports Facebook, Twitter, VK.com and Google Plus.
 * **2.98KB** (without icons, after Min+GZip—compared to 309KB up front empty-cache pageload cost for Facebook, Twitter, and Google Plus widgets)
 * 1 JS request, 1 CSS request, 1 optional request for icons, 1 optional AJAX request for counts (compared to 25 total requests for Facebook, Twitter, and Google Plus widgets)
 * Easy to fit in with existing page design
 * Ability to share without JavaScript or before JavaScript has loaded.
 * Works with mouse, touchscreen, or keyboard.
	 * Mouse: On hover, loads a social network's native widget so that the user can Like/Recommend/+1 without leaving the current page.
	 * Touch screen: simple redirects to dedicated network share pages.
	 * Keyboard: Concise tab order.
 * Option to conditionally display count if it's above a minimum threshold. Avoid goose egg ghost-town.
 * Intelligent client-side caching so that two or more widgets with the same share URL only make one AJAX request.
 * Requires jQuery 1.6+

## [SocialCount Demo][demourl]

[demourl]: http://fgte.st/SocialCount/examples/index.html

## Getting Started

The following archive contains both minified (`socialcount.min.js`+`socialcount.min.css`) and unminified (`socialcount.js`+`socialcount.css`) versions of the JS and CSS required to use SocialCount.

By default, the social networking icons are not included. However, SocialCount publishes a version that does include the social networking icons: Use the regular `socialcount.js` with `socialcount-with-icons.css` or `socialcount-with-icons.min.css` and the included SD and HD image sprites.

The archive also contains the **optional** PHP service files for the AJAX request to retrieve the share counts (requires PHP 5 with curl). To enable this feature for your widget, use `<ul class="socialcount" data-counts="true">`.

Vk.com examples work only on localhost.com because it depends on the domain. (you can create this alias for localhost in your hosts file). You'll need to add `data-vp-api="YOUR_SITE_API_ID"` to ul for vk.com likes to work.

### Download [socialcount.zip][zipfile]

[zipfile]: https://raw.github.com/filamentgroup/SocialCount/master/dist/socialcount.zip

### Markup with icons:

Customize the sample markup below or use the provided  [markup generator][generator].

[generator]: http://fgte.st/SocialCount/examples/index.html#generator

    <!-- Replace YOUR_CUSTOM_URL with the URL you're sharing -->

	<ul class="socialcount" data-url="YOUR_CUSTOM_URL">

	<li class="facebook"><a href="https://www.facebook.com/sharer/sharer.php?u=YOUR_CUSTOM_URL" title="Share on Facebook"><span class="icon icon-facebook"></span><span class="count">Like</span></a></li>

	<li class="twitter"><a href="https://twitter.com/intent/tweet?text=YOUR_CUSTOM_URL" title="Share on Twitter"><span class="icon icon-twitter"></span><span class="count">Tweet</span></a></li>

	<li class="googleplus"><a href="https://plus.google.com/share?url=YOUR_CUSTOM_URL" title="Share on Google Plus"><span class="icon icon-googleplus"></span><span class="count">+1</span></a></li>

	<li class="vk"><a href="https://vk.com/share.php?url=http://www.google.com/" title="Share on vk.com"><span class="social-icon icon-vk"></span><span class="count">Like</span></a></li>

	</ul>

## Tested with
* Chrome Desktop 23
* Firefox 16
* Opera 12
* Safari 6
* Internet Explorer 7 (Links Only)
* Internet Explorer 8
* Internet Explorer 9

Touchscreens (Links Only)

* BlackBerry 5
* BlackBerry 6.1
* BlackBerry 7
* iOS 6
* Chrome for iOS 21
* Android 2.3
* Windows Phone 7.5

## Contributing
Add unit tests for any new or changed functionality. Lint and test your JavaScript code using [grunt](https://github.com/cowboy/grunt) and the `grunt qunit` command.

To test the PHP code, navigate to the `service` directory and run `phpunit socialcount_service_test.php`


## Release History
* `v0.1.0` Initial release
* `v0.1.1` Fix for IE (tested up to 9) issue with iframes and :hover rules
* `v0.1.2` Default AJAX request for counts to false, added zip download, better documentation for counts service.
* `v0.1.3` Added code to normalize service url directory (easier configuration).
* `v0.1.4` Fix for twitter widget share of non-current page URL. Added data-share-text.
* `v0.1.5` Option for activate on click, instead of hover. i18n Code, adds de_DE support. Fix for Google+ issue with disappearing tooltip.

## License
Copyright (c) 2012 Filament Group, developed by @zachleat. MIT licensed.

## Advanced Options

* `SocialCount.activateOnClick = false;` Global option to switch from load triggering on hover to a manual click.
* `SocialCount.thousandCharacter = 'K';` `SocialCount.millionCharacter = 'M';` i18n Strings.