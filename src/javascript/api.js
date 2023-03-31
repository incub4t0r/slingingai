$(document).ready(function () {
    $("#user_request").focus();
    get_previous_results();
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
    $('#greeting_cards').fadeOut(200);
    $('#response_parent').fadeTo(500, 1);
    const userPrompt = $('#user_request').val();
    const promptDTG = Date.now();

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
                    html = converter.makeHtml(responseDiv.innerHTML);
                    $('#response').html(html);
                    $('#user_request').val('');
                    $('#user_request_form *').removeAttr("disabled");
                    hljs.highlightAll();
                    store_result(promptDTG, userPrompt, html);
                    return;
                }
                responseDiv.innerHTML += decoder.decode(value);
                return streamReader.read().then(processText);
            });
        }).catch(error => console.error(error));
}

// store each prompt and response in localstorage
function store_result(promptDTG, userPrompt, html){
    try {
        var result = {
            prompt: userPrompt,
            response: html
        };
        localStorage.setItem(promptDTG, JSON.stringify(result));
        get_previous_results();
    } catch (error) {
        console.log("error: " + error);
    }
}

// get all prompts and responses from localstorage
function get_previous_results(){
    $('#accordionPreviousResults').html('');
    var keys = Object.keys(localStorage);
    if (keys.length === 0) {
        $('#previous_results_parent').hide();
    } else {
        $('#previous_results_parent').show();
    }

    keys.sort(function(a,b){return b-a}).reverse().forEach(function(key) {
        var result = JSON.parse(localStorage.getItem(key));
        $('#accordionPreviousResults').append(`
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#flush-collapse${key}" aria-expanded="false" aria-controls="flush-collapse${key}">
                    <span class="me-2" id="delete" onclick="del_previous_result(${key})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </span>
                    ${result['prompt']}
                </button>
            </h2>
            <div id="flush-collapse${key}" class="accordion-collapse collapse" data-bs-parent="#accordionPreviousResults">
                <div class="accordion-body">${JSON.parse(JSON.stringify(result['response']))}</div>
            </div>
        </div>
    `);
    });
    hljs.highlightAll();
}

function del_previous_result(key) {
    console.log(key);
    localStorage.removeItem(key);
    get_previous_results();
}
