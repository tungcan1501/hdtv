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
(function ($) {

  Drupal.behaviors.fontyourfaceBrowse = {

    attach:function(context, settings) {

      $('.fontyourface-footer a.enable-link').click(fontyourfaceEnableClick);
      $('.fontyourface-footer a.disable-link').click(fontyourfaceDisableClick);

    } // attach

  } // Drupal.behaviors.fontyourfaceAddForm

  function fontyourfaceEnableClick() {
  
    var link = $(this);
    var fid = link.parent().attr('data-fid');
    var enableUrl = Drupal.settings.basePath + '?q=admin/appearance/fontyourface/ajax/enable/' + fid;

    $('<span class="fontyourface-indicator"></span>').appendTo(this);

    $.post(enableUrl, {fid: fid}, function(json) {

      var font = link.parents('.font');
            
      if (json.complete == '1') {

        font.find('.enabled-no')
          .addClass('enabled-yes')
          .removeClass('enabled-no');
        link
          .text(Drupal.t('Disable'))
          .addClass('disable-link')
          .removeClass('enable-link')
          .unbind('click')
          .click(fontyourfaceDisableClick);

      } // if

      font.find('.fontyourface-indicator').remove();
      $('.view-header div').html(json.status);

    }, 'json');

    return false;
  
  } // fontyourfaceEnableClick
  
  function fontyourfaceDisableClick() {
  
    var link = $(this);
    var fid = link.parent().attr('data-fid');
    var disableUrl = Drupal.settings.basePath + '?q=admin/appearance/fontyourface/ajax/disable/';

    $('<span class="fontyourface-indicator"></span>').appendTo(this);
    
    $.post(disableUrl, {fid: fid}, function(json) {

      var font = link.parents('.font');

      if (json.complete == '1') {

        font.find('.enabled-yes')
          .addClass('enabled-no')
          .removeClass('enabled-yes');
        link
          .text(Drupal.t('Enable'))
          .addClass('enable-link')
          .removeClass('disable-link')
          .unbind('click')
          .click(fontyourfaceEnableClick);

      } // if
      
      font.find('.fontyourface-indicator').remove();
      $('.view-header div').html(json.status);

    }, 'json');

    return false;
  
  } // fontyourfaceDisableClick

})(jQuery);
;
(function ($) {

/**
 * A progressbar object. Initialized with the given id. Must be inserted into
 * the DOM afterwards through progressBar.element.
 *
 * method is the function which will perform the HTTP request to get the
 * progress bar state. Either "GET" or "POST".
 *
 * e.g. pb = new progressBar('myProgressBar');
 *      some_element.appendChild(pb.element);
 */
Drupal.progressBar = function (id, updateCallback, method, errorCallback) {
  var pb = this;
  this.id = id;
  this.method = method || 'GET';
  this.updateCallback = updateCallback;
  this.errorCallback = errorCallback;

  // The WAI-ARIA setting aria-live="polite" will announce changes after users
  // have completed their current activity and not interrupt the screen reader.
  this.element = $('<div class="progress" aria-live="polite"></div>').attr('id', id);
  this.element.html('<div class="bar"><div class="filled"></div></div>' +
                    '<div class="percentage"></div>' +
                    '<div class="message">&nbsp;</div>');
};

/**
 * Set the percentage and status message for the progressbar.
 */
Drupal.progressBar.prototype.setProgress = function (percentage, message) {
  if (percentage >= 0 && percentage <= 100) {
    $('div.filled', this.element).css('width', percentage + '%');
    $('div.percentage', this.element).html(percentage + '%');
  }
  $('div.message', this.element).html(message);
  if (this.updateCallback) {
    this.updateCallback(percentage, message, this);
  }
};

/**
 * Start monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.startMonitoring = function (uri, delay) {
  this.delay = delay;
  this.uri = uri;
  this.sendPing();
};

/**
 * Stop monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.stopMonitoring = function () {
  clearTimeout(this.timer);
  // This allows monitoring to be stopped from within the callback.
  this.uri = null;
};

/**
 * Request progress data from server.
 */
Drupal.progressBar.prototype.sendPing = function () {
  if (this.timer) {
    clearTimeout(this.timer);
  }
  if (this.uri) {
    var pb = this;
    // When doing a post request, you need non-null data. Otherwise a
    // HTTP 411 or HTTP 406 (with Apache mod_security) error may result.
    $.ajax({
      type: this.method,
      url: this.uri,
      data: '',
      dataType: 'json',
      success: function (progress) {
        // Display errors.
        if (progress.status == 0) {
          pb.displayError(progress.data);
          return;
        }
        // Update display.
        pb.setProgress(progress.percentage, progress.message);
        // Schedule next timer.
        pb.timer = setTimeout(function () { pb.sendPing(); }, pb.delay);
      },
      error: function (xmlhttp) {
        pb.displayError(Drupal.ajaxError(xmlhttp, pb.uri));
      }
    });
  }
};

/**
 * Display errors on the page.
 */
Drupal.progressBar.prototype.displayError = function (string) {
  var error = $('<div class="messages error"></div>').html(string);
  $(this.element).before(error).hide();

  if (this.errorCallback) {
    this.errorCallback(this);
  }
};

})(jQuery);
;
;(function ($) {

  Drupal.behaviors.less = {
    attach: function (context, settings) {
      
      var watched_files = [],
          $watched_links;
      
      $watched_links = $('head link[src$=".less"]', context).each(function () {
        
        // Only grab the portion of the url up to, but not including, the '?'.
        watched_files.push($(this).attr('href').match(/^([^\?]+)/)[1]);
      });
      
      if (watched_files.length > 0) {
        
        // Modeled after example @ http://www.erichynds.com/javascript/a-recursive-settimeout-pattern/
        var poller = {
         
          failed_requests: 0,
        
          // starting interval in milliseconds
          interval: 500,
        
          // kicks off the setTimeout
          init: function(){
            setTimeout(
              $.proxy(this.getData, this), // ensures 'this' is the poller obj inside getData, not the window object
              this.interval
            );
          },
         
          // get AJAX data + respond to it
          getData: function() {
            var self = this;
       
            $.ajax({
              type: 'POST',
              url: settings.basePath + 'ajax/less/watch',
              data: {
                less_files: watched_files
              },
              timeout: self.interval,
              
              // On success, reset failed request counter and update style links.
              success: function ( response ) {
                
                self.failed_requests = 0;
                
                for (i in response) {
                  
                  var old_file = response[i].old_file,
                      new_file = response[i].new_file;
                  
                  // Math.random() at the end forces a reload of the file.
                  $('head link[href^="' + old_file + '"]', context).replaceWith($('<link type="text/css" rel="stylesheet" media="all" />').attr('href', new_file + '?' + Math.random()));
                  
                  watched_files[watched_files.indexOf(old_file)] = new_file;
                }
              },
              
              // On failure, count failed request and increase interval.
              error: function () {
                
                ++self.failed_requests;
         
                self.interval += 500;
              },
              
              // On success or failure, restart
              complete: function () {
                
                if( ++self.failed_requests < 10 ){
                  self.init();
                }
              }
            });
          }
        };
         
        poller.init();
        
      }
      
    }
  };

})(jQuery);;
