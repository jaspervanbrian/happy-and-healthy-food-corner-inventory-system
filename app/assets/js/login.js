(function ($) {

    
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');
    var request;
    $('.validate-form').on('submit', function(e){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }
        if (check) {
            if(request){
                request.abort();
            }
            var $form = $(this);
            if ($form.attr('action') === "app/controllers/VerifyAccount.php") {
                e.preventDefault();
                var $inputs = $form.find("input, select, button, textarea");
                var data = {
                    username: $form.find("input[name='username']").val(),
                    password: $form.find("input[name='password']").val(),
                };
                $inputs.prop("disabled", true);
                request = $.ajax({
                    url: $form.attr("action"),
                    type: 'POST',
                    data: data,
                });
                request.done(function (response, textStatus, jqXHR){
                    if (response==="Success") {
                        $inputs.prop("disabled", false);
                        $form.attr("action", "app/controllers/LoginSuccessController.php");
                        $form.submit();
                    } else if (response==="Invalid") {
                        $("#flash-message").empty().addClass("alert alert-danger").show().append("Wrong username or password.").delay( 5000 ).slideUp(300);
                    } else if (response==="DBError") {
                        $("#flash-message").empty().addClass("alert alert-danger").show().append("Database connection error.").delay( 5000 ).slideUp(300);
                    }
                });
                request.fail(function (jqXHR, textStatus, errorThrown){
                    $("#flash-message").empty().addClass("alert alert-danger").append(errorThrown).delay( 5000 ).slideUp(300);
                });
                request.always(function () {
                    $inputs.prop("disabled", false);
                });
            }
        } else {
            return false;
        }
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if ($(input).val().trim() == '') {
            return false;
        }
        return true;
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
})(jQuery);