Drupal.locale = { 'strings': {"":{"Configure":"C\u1ea5u h\u00ecnh","The changes to these blocks will not be saved until the \u003Cem\u003ESave blocks\u003C\/em\u003E button is clicked.":"C\u00e1c thay \u0111\u1ed5i \u0111\u1ed1i v\u1edbi c\u00e1c kh\u1ed1i n\u1ed9i dung n\u00e0y s\u1ebd ch\u01b0a \u0111\u01b0\u1ee3c l\u01b0u cho \u0111\u1ebfn khi n\u00fat \u003Cem\u003EL\u01b0u c\u00e1c kh\u1ed1i n\u1ed9i dung\u003C\/em\u003E \u0111\u01b0\u1ee3c nh\u1ea5p.","Not restricted":"Kh\u00f4ng h\u1ea1n ch\u1ebf","Not customizable":"Ng\u01b0\u1eddi d\u00f9ng kh\u00f4ng \u0111\u01b0\u1ee3c ph\u00e9p t\u00f9y ch\u1ec9nh","Restricted to certain pages":"H\u1ea1n ch\u1ebf \u0111\u1ed1i v\u1edbi m\u1ed9t s\u1ed1 trang","The block cannot be placed in this region.":"Kh\u00f4ng th\u1ec3 \u0111\u01b0a kh\u1ed1i n\u00e0y v\u00e0o v\u00f9ng n\u00e0y."}} };;
(function($) {
  $.authcache_cookie = function(name, value, lifetime) {
    lifetime = (typeof lifetime === 'undefined') ? Drupal.settings.authcache.cl : lifetime;
    $.cookie(name, value, $.extend(Drupal.settings.authcache.cp, {expires: lifetime}));
  };
}(jQuery));
;
(function ($) {

/**
 * Attaches double-click behavior to toggle full path of Krumo elements.
 */
Drupal.behaviors.devel = {
  attach: function (context, settings) {

    // Add hint to footnote
    $('.krumo-footnote .krumo-call').before('<img style="vertical-align: middle;" title="Click to expand. Double-click to show path." src="' + Drupal.settings.basePath + 'misc/help.png"/>');

    var krumo_name = [];
    var krumo_type = [];

    function krumo_traverse(el) {
      krumo_name.push($(el).html());
      krumo_type.push($(el).siblings('em').html().match(/\w*/)[0]);

      if ($(el).closest('.krumo-nest').length > 0) {
        krumo_traverse($(el).closest('.krumo-nest').prev().find('.krumo-name'));
      }
    }

    $('.krumo-child > div:first-child', context).dblclick(
      function(e) {
        if ($(this).find('> .krumo-php-path').length > 0) {
          // Remove path if shown.
          $(this).find('> .krumo-php-path').remove();
        }
        else {
          // Get elements.
          krumo_traverse($(this).find('> a.krumo-name'));

          // Create path.
          var krumo_path_string = '';
          for (var i = krumo_name.length - 1; i >= 0; --i) {
            // Start element.
            if ((krumo_name.length - 1) == i)
              krumo_path_string += '$' + krumo_name[i];

            if (typeof krumo_name[(i-1)] !== 'undefined') {
              if (krumo_type[i] == 'Array') {
                krumo_path_string += "[";
                if (!/^\d*$/.test(krumo_name[(i-1)]))
                  krumo_path_string += "'";
                krumo_path_string += krumo_name[(i-1)];
                if (!/^\d*$/.test(krumo_name[(i-1)]))
                  krumo_path_string += "'";
                krumo_path_string += "]";
              }
              if (krumo_type[i] == 'Object')
                krumo_path_string += '->' + krumo_name[(i-1)];
            }
          }
          $(this).append('<div class="krumo-php-path" style="font-family: Courier, monospace; font-weight: bold;">' + krumo_path_string + '</div>');

          // Reset arrays.
          krumo_name = [];
          krumo_type = [];
        }
      }
    );
  }
};

})(jQuery);
;
