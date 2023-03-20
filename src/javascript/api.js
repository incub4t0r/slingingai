$(document).ready(function () {
    $("#user_request").focus();
});

var converter = new showdown.Converter();
var html;

function gptapi(){
    event.preventDefault();
    $('#user_request_form *').attr("disabled", true);
    $('#response').html(`<i class="bi bi-cpu"></i>` + " Thinking...");
    $('#greeting_cards').fadeOut(500);
    var user_request = $('#user_request').val();

    var data = {
        prompt: user_request,
    };

    console.log(JSON.stringify(data));

    $.ajax({
        type: "POST",
        url: "/api/prompt",
        data: JSON.stringify({prompt: user_request}),
        dataType: "json",
        contentType: "application/json",
        success: function(response) {
            // Handle successful response here
            response_text = response.openai_response;
            html = converter.makeHtml(response_text);
            $('#response').html(html);
            $('#user_request_form *').removeAttr("disabled");
            console.log(response);
        },
        error: function(error) {
            // Handle error here
            response_text = `<i class="bi bi-emoji-frown"></i>` + " Sorry, I errored out. Please try again.";
            $('#response').html(response_text);
            $('#user_request_form *').removeAttr("disabled");
            console.log(error);
        }
            
    })
}