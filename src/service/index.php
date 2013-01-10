<?php
if (preg_match('/^http(s?):\/\/'.$_SERVER['HTTP_HOST'].'(:\d+)?\//',$_GET['url'])) {

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
} else {
        echo '{"error": "URL not authorized"}';
}
