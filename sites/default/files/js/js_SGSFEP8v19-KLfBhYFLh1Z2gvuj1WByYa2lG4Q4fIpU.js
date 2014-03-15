/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function($) {
    Drupal.behaviors.monkey = {
        attach: function(context, settings)
        {//start code
            $(".block-views-product-block .node-add-to-cart").val("Đặt mua");
            $("#block-system-main .node-add-to-cart").val("Đặt mua");
            //$("#search-block-form .form-submit").val("");
            
            $("#block-system-main .model .product-info-label").text("Mã sản phẩm:");
            $("#block-system-main .weight .product-info-label").text("Trọng lượng:");
            $("#block-system-main .dimensions .product-info-label").text("Kích thước:");
            $("#block-system-main .list-price .uc-price-label").text("Giá niêm yết:");
            $("#block-system-main .sell-price .uc-price-label").text("Giá bán:");
            $("#block-system-main .field-name-field-product-order-type .field-label").text("Đặt mua:");
            
            
            
            $("body.node-type-product .region-inner > #page-title").text("Chi tiết sản phẩm");
            
        }//code ends
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
