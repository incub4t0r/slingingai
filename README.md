# SlingingAI

SlingingAI is an internal chat tool utilizing the GPT4 API. 

- [SlingingAI](#slingingai)
  - [Packages used](#packages-used)
  - [Installation](#installation)
  - [How to use](#how-to-use)
  - [TODO](#todo)
    - [Phase 1](#phase-1)
    - [Phase 2](#phase-2)
    - [Phase 3](#phase-3)


## Packages used

- [OpenAI API]()
- [jQuery](https://jquery.com/)
- [Bootstrap 5.3](https://getbootstrap.com/)
- [showdown.js](https://showdownjs.com/)
- [highlight.js](https://highlightjs.org/)

## Installation

1. `git clone git@github.com:incub4t0r/slingingai.git`
2. `pip3 install -r requirements.txt`
3. Create a `.env` file in the `/src` directory
4. Add the following to the `.env` file:
   1. `OPENAI_KEY=YOURKEYHERE`
   
## How to use

In the current state, there is only a proof of concept. To run this proof of concept, simply open the `index.html` file in your browser.

## TODO

### Phase 1

- [X] Create a basic UI
- [X] Create an API callback to GPT4
  
### Phase 2

- [X] Create a FastAPI backend to handle the GPT4 API calls
- [X] Add FastAPI frontend endpoints to the UI
- [ ] Address security issues with frontend and backend

### Phase 3

- [ ] Rewrite the application in Svelte and NodeJS
- [ ] Add user authentication (discord, google)
- [ ] Add a firestore database to store the chat history per user
- [ ] Add a firestore database to store the user's settings