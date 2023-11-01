$(document).ready(function() {
  $.getScript("//cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.js").done(function() {
    quickView();
  });
});


function quickView() {
  $(document.body).on('click', '.quick-view', function() {
    if ($('#quick-view').length == 0) {
      $(document.body).append('<div id="quick-view"></div>');
    }
    var product_handle = $(this).data('handle');
    $('#quick-view').addClass(product_handle);
    jQuery.getJSON('/products/' + product_handle + '.js', function(product) {
      var title = product.title;
      var type = product.type;
      var vendor = product.vendor;
      var price = 0;
      var sku = product.sku;
      var original_price = 0;
      var desc = product.description;
      var images = product.images;
      var variants = product.variants;
      var options = product.options;
      var url = '/products/' + product_handle;
      $('.qv-product-title').text(title);
      $('.qv-product-type').text(type);
      if ((product.type).length == 0) {
        $('.qv-product-type-title').hide();
      }
      $('.qv-view-vendor').text(vendor);
      if ((product.vendor).length == 0) {
        $('.qv-view-vendor-title').hide();
      }
      $('.qv-product-description').html(desc);
      $(product.variants).each(function(i, variants) {
        if (variants.sku != null) {
          $('.qv-sku').addClass("show").removeClass("hide");
          $('.qv-view-sku').text(product.variants[0].sku);
        } else {
          $('.qv-sku').addClass("hide").removeClass("show");
        }
      });
      $('.view-product').attr('href', url);
      var imageCount = $(images).length;
      $(images).each(function(i, image) {

        var image_embed = '<div><img src="' + image + '"></div>';
        image_embed = image_embed.replace('.jpg', '_1000x.jpg').replace('.png', '_1000x.png');
        $('.qv-product-images').append(image_embed);

        var image_embed = '<div class="images-variant" style="display:inline-block;"><img src="' + image + '" fid="'+ i +'"></div>';
        image_embed = image_embed.replace('.jpg', '_1000x.jpg').replace('.png', '_1000x.png');
        $('.qv-product-images-variant').append(image_embed);

      });
      $('.qv-product-images').slick({
        'dots': false,
        'arrows': true,
        'respondTo': 'min'
      }).css('opacity', '1');

      $('.qv-product-images-variant').slick({
        'slidesToShow': 3,
        'slidesToScroll': 1,
        'infinite':true,
        'dots': false,
        'arrows': true
      }).css('opacity', '1');

      $(options).each(function(i, option) {
        var opt = option.name;
        var selectClass = '.option.' + opt.toLowerCase();
        $('.qv-product-options').append('<div class="option-selection-' + opt.toLowerCase() + '"><span class="option">' + opt + '</span><select class="field__input option-' + i + ' option ' + opt.toLowerCase() + '"></select></div>');
        $(option.values).each(function(i, value) {
          $('.option.' + opt.toLowerCase()).append('<option value="' + value + '">' + value + '</option>');
        });
      });
      $(document).on("click", "#quick-view .images-variant img", function() {
        var fimgid = $(this).attr('fid');
        jQuery.getJSON('/products/' + product_handle + '.js', function(product) {
          $(images).each(function(i, image) { 
            if (i == fimgid) {                                            
              $('.qv-product-images').slick('slickGoTo', i);                       
            } 
          });
        });
      });
      $(product.variants).each(function(i, v) {
        if (v.available == false) {
          $('.qv-add-button').prop('disabled', true).val(window.variantStrings.soldOut);
          price = parseFloat(v.price / 100).toFixed(2);
          original_price = parseFloat(v.compare_at_price / 100).toFixed(2);
          $('.qv-product-price').text(price);
          if (original_price > 0) {
            $('.qv-product-original-price').text(original_price).show();
          } else {
            $('.original-price').hide();
          }
          return true
        } 
        else {
          $('.qv-add-button').prop('disabled', false).val(window.variantStrings.addToCart);
          price = parseFloat(v.price / 100).toFixed(2);
          original_price = parseFloat(v.compare_at_price / 100).toFixed(2);
          $('.qv-product-price').text(price);
          if (original_price > 0) {
            $('.qv-product-original-price').text(original_price).show();
          } else {
            $('.original-price').hide();
          }
          $('select.option-0').val(v.option1);
          $('select.option-1').val(v.option2);
          $('select.option-2').val(v.option3);
          return false
        }
      });
    });
    $(document).on("change", "#quick-view select", function() {
      var selectedOptions = '';
      $('#quick-view select').each(function(i) {
        if (selectedOptions == '') {
          selectedOptions = $(this).val();
        } else {
          selectedOptions = selectedOptions + ' / ' + $(this).val();
        }
      });
      jQuery.getJSON('/products/' + product_handle + '.js', function(product) {
        $(product.variants).each(function(i, v) {
          if (v.title == selectedOptions) {

            if (v.featured_image !== null) {
              var iSlick = v.featured_image.position - 1;
              $('.qv-product-images').slick('slickGoTo', iSlick);
            }
            var price = parseFloat(v.price / 100).toFixed(2);
            var original_price = parseFloat(v.compare_at_price / 100).toFixed(2);
            var v_qty = v.inventory_quantity;
            var v_inv = v.inventory_management;
            $('.qv-product-price').text(price);
            $('.qv-product-original-price').text(original_price);
            if (v.sku != null) {
              $('.qv-sku').addClass("show").removeClass("hide");
              $('.qv-view-sku').text(v.sku);
            } else {
              $('.qv-sku').addClass("hide").removeClass("show");
            }
            if (v.available == false) {
              $('.qv-add-button').prop('disabled', true).val(window.variantStrings.soldOut);
            } else {
              $('.qv-add-button').prop('disabled', false).val(window.variantStrings.addToCart);
            }
          }
        });
      });
    });
    $.fancybox({
      href: '#quick-view',
      maxWidth: 1000,
      maxHeight: 680,
      fitToView: true,
      width: '80%',
      height: '88%',
      autoSize: false,
      openEffect: 'none',
      closeEffect: 'none',
      'beforeLoad': function() {
        var product_handle = $('#quick-view').attr('class');
        $(document).on("click", ".qv-add-button", function() {
          var qty = $('.qv-quantity').val();
          var v_title = '';
          var selectedOptions = '';
          var var_id = '';
          $('#quick-view select').each(function(i) {
            if (selectedOptions == '') {
              selectedOptions = $(this).val();
            } else {
              selectedOptions = selectedOptions + ' / ' + $(this).val();
            }
          });
          $.getJSON('/products/' + product_handle + '.js', function(product) {
            $(product.variants).each(function(i, v) {
              if (v.title == selectedOptions) {
                var_id = v.id;
                v_title = v.title;
                processCart();
              }
            });
          });

          function processCart() {
            $.post('/cart/add.js', {
              quantity: qty,
              id: var_id
            }, null, "json")
            .done(function() {                          	 
              $(".cart-content").addClass('active');
              $(".overlay").addClass('overlay_active');                                
              $("#loader").addClass('loader');                             
              setTimeout(function(){
                $("#loader").removeClass("loader");    
              },1000);
              $("#cart_reload").load("#cart_reload .cart_content > *");
              $(".cart-count-bubble").load(" .cart-count-bubble > *");
              $(".qv-add-to-cart-response").removeClass('error'); 
              $('.qv-add-to-cart-response').addClass('success');
              $('.qv-add-to-cart-response .msg').delay(3000).fadeTo(1000, 0);
              $('.qv-add-to-cart-response .msg').removeAttr("style");                          
              $.fancybox.close();

            })
          }

        });
        $('.fancybox-wrap').css('overflow', 'hidden !important');
      },
      'afterShow': function() {
        $('#quick-view').hide().html(content).css('opacity', '1').fadeIn(function() {
          $('.qv-product-images').addClass('loaded');
        });
      },
      'afterClose': function() {
        $('#quick-view').removeClass().empty();
      }
    });
  });
};
$(window).resize(function() {
  if ($('#quick-view').is(':visible')) {
    $('.qv-product-images').slick('setPosition');
  }
});