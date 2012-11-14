# SocialCount

Simple barebones project to show share counts from various social networks.

## Getting Started

Download the unminified ( [JS][maxjs] + [CSS][maxcss] ) or minified ( [JS][minjs] + [CSS][mincss] ) version and add the appropriate link and script tags into your HTML.

[maxjs]: https://raw.github.com/filamentgroup/SocialCount/master/dist/socialcount.js
[maxcss]: https://raw.github.com/filamentgroup/SocialCount/master/dist/socialcount.css
[minjs]: https://raw.github.com/filamentgroup/SocialCount/master/dist/socialcount.min.js
[mincss]: https://raw.github.com/filamentgroup/SocialCount/master/dist/socialcount.min.css

In your web page, add:

    <!-- Replace YOUR_CUSTOM_URL with the URL you're sharing -->

    <ul class="socialcount" data-url="YOUR_CUSTOM_URL">

	  <li class="facebook"><a href="https://www.facebook.com/sharer/sharer.php?u=YOUR_CUSTOM_URL" title="Share on Facebook"><span class="icon icon-facebook"></span><span class="count">Like</span></a></li>

	  <li class="twitter"><a href="https://twitter.com/intent/tweet?text=YOUR_CUSTOM_URL" title="Share on Twitter"><span class="icon icon-twitter"></span><span class="count">Tweet</span></a></li>

      <li class="googleplus"><a href="https://plusone.google.com/_/+1/confirm?url=YOUR_CUSTOM_URL" title="Share on Google Plus"><span class="icon icon-googleplus"></span><span class="count">+1</span></a></li>

    </ul>

## Documentation

Options

## Examples
_(Coming soon)_

## Contributing
Add unit tests for any new or changed functionality. Lint and test your JavaScript code using [grunt](https://github.com/cowboy/grunt) and the `grunt test` command.

To test the PHP code, navigate to the `service` directory and run `phpunit socialcount_service_test.php`

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Filament Group
Licensed under the MIT license.
