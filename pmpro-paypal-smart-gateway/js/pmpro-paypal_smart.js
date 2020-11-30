window.addEventListener("load", function(){
  paypal.Buttons({
    env: (pmproPayPalSmart.gateway_environment != 'sandbox') ? 'production' : 'sandbox',
    onClick: function(data, actions) {

        jQuery('#pmpro_message_bottom, #pmpro_message').html('').removeClass('pmpro_error').fadeOut();
        jQuery('#pmpro_processing_message').css('visibility', 'visible');

        var submitProcess = true;
        jQuery(".pmpro_required").each(function(){
            if(jQuery(this).val() == ''){
                submitProcess = false;
                jQuery(this).addClass('pmpro_error');
            }else{
                jQuery(this).removeClass('pmpro_error');
            }
        });

        if(submitProcess){
            let formData = new FormData();
            formData.append('action', 'pmpro_check_user');
            formData.append('username', document.getElementById('username').value);
            formData.append('bemail', document.getElementById('bemail').value);
            return fetch(pmproPayPalSmart.ajax_url, {
                mode: "no-cors",
                method: "POST",
                body: formData
            }).then(function(res) {
                return res.json();
            }).then(function(data) {
                if (data.validationError) {
                    jQuery('#pmpro_message_bottom, #pmpro_message').html(data.validationError).addClass('pmpro_error').fadeIn();
                    jQuery('#pmpro_processing_message').css('visibility', 'hidden');
                  return actions.reject();
                } else {
                    jQuery('#pmpro_message_bottom, #pmpro_message').html('');
                    jQuery('#pmpro_processing_message').css('visibility', 'visible');
                  return actions.resolve();
                }
            });
        }else{
            jQuery('#pmpro_message_bottom, #pmpro_message').html('Please complete all required fields.').addClass('pmpro_error').fadeIn();
            jQuery('#pmpro_processing_message').css('visibility', 'hidden');
            return actions.reject();
        }
      },

        createOrder: async function(data, actions) {
            let formData = new FormData();
            formData.append('action', 'paypal_smart_create_order');
            return fetch(pmproPayPalSmart.ajax_url, {
                mode: "no-cors",
                method: "POST",
                body: formData
            }).then(function(res) {
                return res.json();
            }).then(function(response) {
                jQuery('#pmpro_processing_message').css('visibility', 'hidden');
                if( !response.success && response.message ){
                    jQuery('#pmpro_message_bottom, #pmpro_message').html(response.message).fadeIn();
                    console.error(response.message);
                }
                return response.data.token; 
            });
        },
        onApprove: function(data, actions){

            document.getElementById('orderID').value = data.orderID
            document.getElementById('paymentToken').value = data.facilitatorAccessToken
            document.getElementById('payerID').value = data.payerID
            document.getElementById('pmpro_form').submit();
            
            //   let formData = new FormData();
            //   formData.append('action', 'paypal_smart_save_order');
            //   formData.append('order_id', data.orderID);
            //   return fetch(pmproPayPalSmart.ajax_url, {
            //       mode: "no-cors",
            //       method: "POST",
            //       body: formData
            //   }).then(function(res) {
            //       return res.json();
            //   }).then(function(data){
            //       if(data.success){
            //           window.location.assign("payment-success.php");
            //       }
            //   });
        }
      
  }).render("#paypal-button-container");
});
