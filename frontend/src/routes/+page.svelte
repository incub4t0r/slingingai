<script>
    import Layout from '$lib/Layout.svelte'; // Adjust the import path as needed
    import hljs from 'highlight.js';
    import showdown from 'showdown';
    const converter = new showdown.Converter();

    let response = "";
    let prompt = "";
    let pre_conversion_response = "";
    function startSSE() {
        const eventSource = new EventSource(`/api/prompt?prompt=${encodeURIComponent(prompt)}`);
        eventSource.addEventListener("message", (event) => {
            // console.log("SSE Message:", event.data);
            pre_conversion_response += event.data;
            response = converter.makeHtml(pre_conversion_response);
            console.log(response);
            // call highlight
            hljs.highlightAll();
        });

        eventSource.addEventListener("error", (error) => {
            // console.error("SSE Error:", error);
            eventSource.close();
        });

        eventSource.addEventListener("end", () => {
            // console.log("SSE End");
            eventSource.close();
        });
    }

    function sendPrompt() {
        // set greeting_cards to display none
        document.getElementById("greeting_cards").style.display = "none";
        document.getElementById("response_parent").style.display = "block";
        response = "";
        fetch(`/api/prompt?prompt=${encodeURIComponent(prompt)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(() => {
            startSSE();
        });
    }

    $: {
        console.log(prompt);
    }
</script>

<Layout>
    <style>
        .main {
            height: 100%; /* Default height for larger screens */
            /* Media query for iPhones or devices with smaller screen heights */
            @media screen and (max-height: 700px) {
                height: 100%; /* Default height for larger screens */
            }
        }

        .footer {
            position: absolute;
            bottom: 0;
        }

        #response_parent { 
            display: none;
        }
    </style>

<div class="main">
    <div class="container-lg pt-4" id="greeting_cards">
        <div class="row g-4">
            <div class="col-lg-4">
                <div class="card h-100">
                    <div class="card-body">
                        I'm using GPT4 to answer your questions.
                    </div>
                </div>
            </div>
            <div class="col-lg-4 h-100">
                <div class="card">
                    <div class="card-body">
                        Please give me a second to format everything after my response is complete.
                    </div>
                </div>
            </div>
            <div class="col-lg-4 h-100">
                <div class="card">
                    <div class="card-body">
                        My creator is constantly improving me, check back for updates!
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="container-lg mt-4" id="response_parent">
        <div class="card">
            <div class="card-body">
                {response}
                <!-- <span class="mb-0" id="response">{response}</span> -->
            </div>
        </div>
    </div>
    <div class="mt-auto pb-4 footer w-100">
        <div class="container-lg">
            <div class="card">
                <div class="card-body">
                    <form class="input-group" on:submit|preventDefault={sendPrompt} id="user_request_form">
                        <textarea bind:value={prompt} data-at-expandable class="no-border-focus form-control form-control-custom rounded" placeholder="Ask me anything!"  id="user_request"></textarea>
                        <button type="submit" class="p-2 border-0 btn-custom" id="user_request_button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
</Layout>
