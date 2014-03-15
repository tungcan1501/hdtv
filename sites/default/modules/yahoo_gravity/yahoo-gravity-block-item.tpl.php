<div class="yahoo-support">
    <?php
    $yahoo = $node;
    //dsm($node);
    $title = $yahoo->yahoo_name;
    $nick = $yahoo->yahoo_nick;
    $skyper = $yahoo->yahoo_skype;
    $phone = $yahoo->yahoo_phone;

    $skyper_chat = "skype:" . $skyper . "?chat";
    $skyper_call = "skype:" . $skyper . "?call";
    $skyper_status = yahoo_gravity_skype_status($skyper);
    $skyper_img = "images/skype_" . $skyper_status . ".png";
    $skyper_img_call = "images/skype_call_" . $skyper_status . ".png";

    $title = '<small>' . $title . '</small>';
    ?>
    <div class="yahoo-contact-name"><?php echo $title; ?></div>
    <div class="yahoo-contact-support">
        <a href="ymsgr:sendim?<?php echo $nick; ?>&m=" class="yahoo_chat"><img src="<?php echo $path . 'images/yahoo.png'; ?>" class="ym" /></a>
        <a href="<?php echo $skyper_chat ?>" class="skype_chat yahoo"><img src="<?php echo $path . 'images/skype.png'; ?>" class="skype" /></a>
        <a href="<?php echo $yahoo->yahoo_gmail; ?>" alt="<?php echo $yahoo->yahoo_gmail; ?>" class="gmail yahoo"
           onclick="javascript:window.open('https://mail.google.com/mail/?view=cm&fs=1&to=<?php echo $yahoo->yahoo_gmail ?>&=1&su=&body=', 'popUpWindow', 'height=500,width=800,left=200,top=200,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
                   return false;"
           ><img src="<?php echo $path . 'images/google.png'; ?>"  /></a></br>
        <div class="contact-call"><span><?php echo 'hotline: ' . $phone; ?> </span></div>
    </div>
</div>