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

