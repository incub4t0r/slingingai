$(document).ready(function () {
    $("#user_request").focus();
});

var converter = new showdown.Converter();
var html;

// function gptapi() {
//     event.preventDefault();
//     $('#user_request_form *').attr("disabled", true);
//     $('#response').html(`<i class="bi bi-cpu"></i>` + " Thinking...");
//     $('#greeting_cards').fadeOut(500);
//     var user_request = $('#user_request').val();

//     var data = {
//         prompt: user_request,
//     };

//     console.log(JSON.stringify(data));

//     $.ajax({
//         type: "POST",
//         url: "/api/prompt",
//         data: JSON.stringify({ prompt: user_request }),
//         dataType: "json",
//         contentType: "application/json",
//         success: function (response) {
//             // Handle successful response here
//             response_text = response.responseText;
//             // response_text = response.openai_response;
//             html = converter.makeHtml(response_text);
//             $('#response').html(html);
//             $('#user_request_form *').removeAttr("disabled");
//             console.log(response);
//             hljs.highlightAll();
//         },
//         error: function (error) {
//             // Handle error here
//             response_text = `<i class="bi bi-emoji-frown"></i>` + " Sorry, I errored out. Please try again.";
//             $('#response').html(response_text);
//             $('#user_request_form *').removeAttr("disabled");
//             console.log(error);
//         }
//     })
// }

function chat() {
    event.preventDefault();
    $('#user_request_form *').attr("disabled", true);
    $('#response').html(`<i class="bi bi-cpu"></i>` + " Thinking...");
    $('#greeting_cards').fadeOut(500);
    const userPrompt = $('#user_request').val();
    fetch('/api/prompt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: userPrompt })
    }).then(response => {
            const reader = response.body.getReader();
            const stream = new ReadableStream({
                start(controller) {
                    function push() {
                        reader.read().then(({ done, value }) => {
                            if (done) {
                                controller.close();
                                return;
                            }
                            controller.enqueue(value);
                            push();
                        });
                    }
                    push();
                }
            });
            const streamReader = stream.getReader();
            const decoder = new TextDecoder();
            const responseDiv = document.getElementById('response');
            responseDiv.innerHTML = '';
            streamReader.read().then(function processText({ done, value }) {
                if (done) {
                    console.log("done");
                    html = converter.makeHtml(responseDiv.innerHTML);
                    $('#response').html(html);
                    $('#user_request_form *').removeAttr("disabled");
                    hljs.highlightAll();
                    return;
                }
                responseDiv.innerHTML += decoder.decode(value);
                return streamReader.read().then(processText);
            });
        }).catch(error => console.error(error));
}
