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
                        $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("Wrong username or password.").delay( 5000 ).slideUp(300);
                    } else if (response==="DBError") {
                        $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("Database connection error.").delay( 5000 ).slideUp(300);
                    }
                });
                request.fail(function (jqXHR, textStatus, errorThrown){
                    $("#flash-message").empty().removeClass().addClass("alert alert-danger").append(errorThrown).delay( 5000 ).slideUp(300);
                });
                request.always(function () {
                    $inputs.prop("disabled", false);
                });
            }
        } else {
            return false;
        }
    });

    $('.validateUsername').on('submit', function() {
        if(request){
            request.abort();
        }
        var $form = $(this);
        var data = {
            username: $form.find("input[name='username']").val(),
        };
        request = $.ajax({
            url: $form.attr("action"),
            type: 'POST',
            data: data,
        });
        request.done(function(response, textStatus, jqXHR) {
            if (response==="Invalid") {
                $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("Invalid username.").delay( 5000 ).slideUp(300);
            } else if (response==="DBError") {
                $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("Database connection error.").delay( 5000 ).slideUp(300);
            } else {
                var user = JSON.parse(response);
                $("#forgotPasswordBody").empty().append('<form action="app/controllers/ForgotPasswordSubmit.php" method="post" class="validateAnswer"><div class="row"><div class="col-12"><h5><span class="text-secondary"><i class="fa fa-user"></i>&nbsp;Enter Username</span>&nbsp;&nbsp;&nbsp;<span class="fa fa-caret-right"></span>&nbsp;&nbsp;&nbsp;<span class="text-success"><i class="fa fa-question-circle"></i>&nbsp;Answer Security Question</span>&nbsp;&nbsp;&nbsp;<span class="fa fa-caret-right"></span>&nbsp;&nbsp;&nbsp;<span class="text-secondary"><i class="fa fa-lock"></i>&nbsp;Change Password</span></h5></div></div><hr><input type="hidden" name="username" value="' + user.username + '"><div class="row"><div class="col-12"><p>Security Question:</p><h5>' + user.security_question + '</h5></div></div><div class="row p-t-35"><div class="col-12"><p>Answer:</p><input type="text" name="answer" class="form-control"></div></div><div class="row p-t-35"><div class="col-12 d-flex justify-content-center"> <button type="button" class="btn btn-success">Submit</button> </div></div></form>');
                $('.validateAnswer').on('submit', function() {
                    var $form = $(this);
                    var data = {
                        username: $form.find("input[name='username']").val(),
                        answer: $form.find("input[name='answer']").val(),
                    };
                    requestAnswer = $.ajax({
                        url: $form.attr("action"),
                        type: 'POST',
                        data: data,
                    });
                    requestAnswer.done(function(response, textStatus, jqXHR) {
                        if (response==="Invalid") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("Wrong answer.").delay( 5000 ).slideUp(300);
                        } else if (response==="DBError") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("Database connection error.").delay( 5000 ).slideUp(300);
                        } else if (response==="Success") {
                            $("#forgotPasswordBody").empty().append('<form action="app/controllers/ForgotPasswordChange.php" method="post" class="changePassword"><div class="row"><div class="col-12"><h5><span class="text-secondary"><i class="fa fa-user"></i>&nbsp;Enter Username</span>&nbsp;&nbsp;&nbsp;<span class="fa fa-caret-right"></span>&nbsp;&nbsp;&nbsp;<span class="text-secondary"><i class="fa fa-question-circle"></i>&nbsp;Answer Security Question</span>&nbsp;&nbsp;&nbsp;<span class="fa fa-caret-right"></span>&nbsp;&nbsp;&nbsp;<span class="text-success"><i class="fa fa-lock"></i>&nbsp;Change Password</span></h5></div></div><hr><input type="hidden" name="username" value="' + user.username + '"><div class="row"><div class="col-12"><p>New Password:</p><input type="password" name="new_password" class="form-control"></div></div><div class="row p-t-35"><div class="col-12 d-flex justify-content-center"> <button type="button" class="btn btn-success">Submit</button> </div></div></form>');
                            $('.changePassword').on('submit', function() {
                                var $form = $(this);
                                var data = {
                                    username: $form.find("input[name='username']").val(),
                                    new_password: $form.find("input[name='new_password']").val(),
                                };
                                requestAnswer = $.ajax({
                                    url: $form.attr("action"),
                                    type: 'POST',
                                    data: data,
                                });
                                requestAnswer.done(function(response, textStatus, jqXHR) {
                                    if (response==="Invalid") {
                                        $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("Invalid Password.").delay( 5000 ).slideUp(300);
                                    } else if (response==="DBError") {
                                        $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("Database connection error.").delay( 5000 ).slideUp(300);
                                    } else if (response==="Success") {
                                        $("#flash-message").empty().removeClass().addClass("alert alert-success").show().append("Change password successful!").delay( 5000 ).slideUp(300);
                                        var $modal = $("#forgotPasswordModal");
                                        $modal.modal('toggle');
                                        $('body').removeClass('modal-open');
                                        $('.modal-backdrop').remove();
                                        $('body').css('padding-right',0);
                                    }
                                });
                                requestAnswer.fail(function(jqXHR, textStatus, errorThrown) {
                                    $("#flash-message").empty().addClass("alert alert-danger").append(errorThrown).delay( 5000 ).slideUp(300);
                                });
                                return false;
                            });
                        }
                    });
                    requestAnswer.fail(function(jqXHR, textStatus, errorThrown) {
                        $("#flash-message").empty().addClass("alert alert-danger").append(errorThrown).delay( 5000 ).slideUp(300);
                    });
                    return false;
                });
            }
        });
        request.fail(function(jqXHR, textStatus, errorThrown) {
            $("#flash-message").empty().addClass("alert alert-danger").append(errorThrown).delay( 5000 ).slideUp(300);
        });
        return false;
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