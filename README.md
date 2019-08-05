# Fora chat

Important change!

As part of the test task, I needed to develop a JavaScript application - text chat:

* After opening a page, user should enter his name
* After entering the name user should join new chat room
* There can be several chat rooms at the same time
* User can copy link to the room and send to another user to invite him
* User can send text messages to the chat and all users in the chat will see message
* Users should see who sent message to the chat and when
* Users should see who is in the chat room right now

## Technology stack

**Front-end:**

* HTML, CSS (SASS), JavaScript, React

**Back-end:**

* Node.js, Express.js, Socket.io

## Local setup

Clone the repo:

```bash
git clone https://github.com/romalenskiy/fora-chat.git
```

Install node packages:

```bash
npm install && npm --prefix client install
```

Start dev server

```bash
npm run dev
```

Add Heroku remote:

```bash
heroku git:remote -a fora-chat
```