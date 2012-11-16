# SocialCount

The problems with social networking widgets are [well documented][zurb]. They're heavy and slow to load especially on high-latency mobile connections.

[zurb]: http://www.zurb.com/article/883/small-painful-buttons-why-social-media-bu

SocialCount is a small mobile-friendly jQuery plugin to show share counts from various social networks.

 * Currently supports Facebook, Twitter, and Google Plus.
 * **2.84KB** (after Min+GZip) or 4.09KB/4.63KB with SD/HD icons (_compared to 309KB up front empty-cache pageload cost for Facebook, Twitter, and Google Plus widgets_)
 * 1 JS request, 1 CSS request, 1 optional request for icons, 1 optional AJAX request for counts (_compared to 25 total requests for Facebook, Twitter, and Google Plus widgets_)
 * Easier to fit in with page designs
 * Ability to share works without dependency on JavaScript.
 * Works with mouse, touchscreen, or keyboard.
   * Mouse: On hover, loads a social network's native widget so that the user can Like/Recommend/+1 without leaving the current page.
   * Touch screen: simple redirects to dedicated network share pages.
   * Keyboard: Concise tab order.
 * Option to conditionally display count if it's above a minimum threshold. Avoid goose egg ghost-town.
 * Intelligent client-side caching so that two or more widgets with the same share URL only make one AJAX request.

## [SocialCount Demo][demourl]

[demourl]: http://fgte.st/SocialCount/examples/

## Getting Started

Download the unminified ( [JS][maxjs] + [CSS][maxcss] ) or minified ( [JS][minjs] + [CSS][mincss] ) version and add the appropriate link and script tags into your HTML.

If you want the social icons included, download the unminified ( [CSS][maxcssicons] ) or minified ( [CSS][mincssicons] ) and [SD][sdsprite] / [HD][hdsprite] icon sprites.

[maxjs]: https://raw.github.com/filamentgroup/SocialCount/master/dist/socialcount.js
[maxcss]: https://raw.github.com/filamentgroup/SocialCount/master/dist/socialcount.css
[maxcssicons]: https://raw.github.com/filamentgroup/SocialCount/master/dist/socialcount-with-icons.css
[minjs]: https://raw.github.com/filamentgroup/SocialCount/master/dist/socialcount.min.js
[mincss]: https://raw.github.com/filamentgroup/SocialCount/master/dist/socialcount.min.css
[mincssicons]: https://raw.github.com/filamentgroup/SocialCount/master/dist/socialcount-with-icons.min.css
[sdsprite]: https://raw.github.com/filamentgroup/SocialCount/master/dist/icon-s8df06ae4f6.png
[hdsprite]: https://raw.github.com/filamentgroup/SocialCount/master/dist/icon-hd-s9293bc9986.png

### Markup with icons:

    <!-- Replace YOUR_CUSTOM_URL with the URL you're sharing -->

    <ul class="socialcount" data-url="YOUR_CUSTOM_URL">

	  <li class="facebook"><a href="https://www.facebook.com/sharer/sharer.php?u=YOUR_CUSTOM_URL" title="Share on Facebook"><span class="icon icon-facebook"></span><span class="count">Like</span></a></li>

	  <li class="twitter"><a href="https://twitter.com/intent/tweet?text=YOUR_CUSTOM_URL" title="Share on Twitter"><span class="icon icon-twitter"></span><span class="count">Tweet</span></a></li>

      <li class="googleplus"><a href="https://plusone.google.com/_/+1/confirm?url=YOUR_CUSTOM_URL" title="Share on Google Plus"><span class="icon icon-googleplus"></span><span class="count">+1</span></a></li>

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

## Service Requirements

* PHP 5 supporting curl

## Contributing
Add unit tests for any new or changed functionality. Lint and test your JavaScript code using [grunt](https://github.com/cowboy/grunt) and the `grunt qunit` command.

To test the PHP code, navigate to the `service` directory and run `phpunit socialcount_service_test.php`


## Release History
* `v0.1.0` Initial release
* `v0.1.1` Fix for IE (tested up to 9) issue with iframes and :hover rules

## License
Copyright (c) 2012 Filament Group
Licensed under the MIT license.
