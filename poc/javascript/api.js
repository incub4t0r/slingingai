var key;

$.ajax({
    url: "../keys/gpt4_key.txt",
    dataType: "text",
    success: function(data) {
        key = data;
        console.log(key);
    },
    error: function(error) {
        console.log(error);
    }
});

console.log(key);

function gptapi(){
    event.preventDefault();
    $('#response').html("I got your question, thinking...");
    var user_request = $('#user_request').val();

    var data = {
        "model": "gpt-4",
        "messages": [{"role": "user", "content": user_request}]
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
            $('#response').html(response_text);
            console.log(response);
        },
        error: function(error) {
            // Handle error here
            response_text = "Sorry, I errored out. Please try again."
            $('#response').html(response_text);
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