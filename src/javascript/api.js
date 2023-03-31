$(document).ready(function () {
    $("#user_request").focus();
});

$("#user_request").keypress(function (e) {
    if((e.which === 13 || e.which === 10) && !e.shiftKey) {
        event.preventDefault();
        chat();
    }
});

var converter = new showdown.Converter();
var html;

function chat() {
    event.preventDefault();
    $('#user_request_form *').attr("disabled", true);
    // $('#response').html(`<i class="bi bi-cpu"></i>` + " Thinking...");
    $('#greeting_cards').fadeOut(200);
    $('#response_parent').fadeTo(500, 1);
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
