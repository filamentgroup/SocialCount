<?php
require_once('SocialCount.php');

try {
	$social = new SocialCount($_GET['url']);

	$social->addNetwork(new Twitter());
	$social->addNetwork(new Facebook());
	$social->addNetwork(new GooglePlus());
	// $social->addNetwork(new ShareThis());

	echo $social->toJSON();
} catch(Exception $e) {
	echo '{"error": "' . $e->getMessage() . '"}';
}