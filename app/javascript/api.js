var key;

$.ajax({
    url: "../keys/gpt4_key.txt",
    dataType: "text",
    success: function(data) {
        key = data;
    },
    error: function(error) {
        console.log(error);
    }
});

$(document).ready(function () {
    $("#user_request").focus();
});


function addLineBreaks(paragraph) {
    // Replace all periods followed by a space with periods and line breaks
    return paragraph.replace(/\. /g, '.<br><br>');
}


function gptapi(){
    event.preventDefault();
    $('#user_request_form *').attr("disabled", true);
    $('#response').html(`<i class="bi bi-cpu"></i>` + " Thinking...");
    $('#greeting_cards').fadeOut(500);
    var user_request = $('#user_request').val();

    var data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": user_request}],
        "max_tokens": 100,
        "temperature": 0.7,
    };
    
    $.ajax({
        type: "POST",
        url: "https://api.openai.com/v1/chat/completions",
        headers: {
            "Authorization": "Bearer " + key,
            "Content-Type": "application/json"
        },
        data: JSON.stringify(data),
        success: function(response) {
            // Handle successful response here
            response_text = response.choices[0].message.content;
            $('#response').html(addLineBreaks(response_text));
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
    });
}

// {
//     "id": "chatcmpl-6w0cjEc8mllqABfIYV0RObcoUChT2",
//     "object": "chat.completion",
//     "created": 1679283441,
//     "model": "gpt-4-0314",
//     "usage": {
//       "prompt_tokens": 13,
//       "completion_tokens": 109,
//       "total_tokens": 122
//     },
//     "choices": [
//       {
//         "message": {
//           "role": "assistant",
//           "content": "The OpenAI mission is to ensure that artificial general intelligence (AGI)—highly autonomous systems that outperform humans at most economically valuable work—benefits all of humanity. OpenAI aims to directly build safe and beneficial AGI or aid others in achieving that outcome, while acting in a cooperative manner with other research and policy institutions to address global challenges posed by AGI and create a global community to address AGI's global impacts. OpenAI commits to prioritizing long-term safety, technical leadership, and cooperative orientation in fulfilling its mission."
//         },
//         "finish_reason": "stop",
//         "index": 0
//       }
//     ]
//   }