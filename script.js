/* enhanced script.js
   Replace your existing file or merge functions.
   No external APIs — all local, safe logic.
*/

const chat = document.getElementById('chat');
const inputEl = document.getElementById('input');
const button = document.getElementById('button');

// --- Utilities ---
function scrollToBottom() {
  chat.scrollTop = chat.scrollHeight;
}
function createMessageElement(text, who='bot', rawHTML=false) {
  const msg = document.createElement('div');
  msg.className = `message ${who}`;
  const inner = document.createElement('div');
  inner.className = 'text';
  if(rawHTML) inner.innerHTML = text;
  else inner.textContent = text;
  msg.appendChild(inner);
  chat.appendChild(msg);
  scrollToBottom();
  return msg;
}
function showTyping(duration=900) {
  const typing = document.createElement('div');
  typing.className = 'message bot typing-msg';
  typing.innerHTML = `<div class="typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
  chat.appendChild(typing);
  scrollToBottom();
  return new Promise(resolve => setTimeout(() => { typing.remove(); resolve(); }, duration));
}

// Save & load user name
function setUserName(name) {
  localStorage.setItem('gg_username', name);
}
function getUserName() {
  return localStorage.getItem('gg_username') || null;
}

// Download chat as plain text
function downloadChat() {
  const items = Array.from(document.querySelectorAll('#chat .message')).map(m => {
    const who = m.classList.contains('user') ? 'You' : 'GG';
    return `${who}: ${m.innerText.replace(/\n+/g, ' ')}`;
  }).join('\n');
  const blob = new Blob([items], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'chat-with-gg.txt';
  a.click();
  URL.revokeObjectURL(url);
}

// --- Small safe arithmetic evaluator ---
function safeEval(expr) {
  // allow only digits, whitespace and arithmetic operators
  if(!/^[0-9+\-*/().%\s]+$/.test(expr)) {
    throw new Error('Expression contains invalid characters.');
  }
  // avoid huge expressions
  if(expr.length > 120) throw new Error('Expression too long.');
  // eslint-disable-next-line no-new-func
  return Function('"use strict"; return (' + expr + ')')();
}

// --- Knowledge / Replies ---
const FAQS = [
  {q: 'deploy to github pages', a: 'To deploy: init git, push to GitHub, then enable Pages in repo settings. Ask "deploy steps" for full commands.'},
  {q: 'resume tips', a: 'Keep it 1 page, list projects with tech & impact, show links (Github/Portfolio), remove CGPA if asked.'},
  {q: 'help', a: 'Try: "time", "date", "tell me a joke", "calc: 4*(3+2)" or commands /clear /save' }
];

const jokes = [
  "Why don’t skeletons fight each other? They don’t have the guts!",
  "Why did the computer go to therapy? It had a hard drive!",
  "Why did the developer go broke? Because he used up all his cache!"
];

const smallTalk = {
  greetings: ["hello","hi","hey","good morning","good evening"],
  greetReplies: [
    "Hello! How are you today?",
    "Hi there 👋",
    "Hey! Nice to meet you!",
    "Hi! What’s up?"
  ]
};

// --- Core chatbot logic (improved) ---
function chatbotLogic(rawInput) {
  const original = rawInput.trim();
  const input = original.toLowerCase();

  // special commands
  if(input === '/clear') {
    chat.innerHTML = '';
    return "Chat cleared. Say hi to start again!";
  }
  if(input === '/save' || input === '/download') {
    downloadChat();
    return "Downloaded chat as a text file.";
  }

  // set name command: "my name is Ganesh"
  const nameMatch = input.match(/\bmy name is ([a-z\s]{2,40})/i);
  if(nameMatch) {
    const name = nameMatch[1].trim().split(' ').map(s => s[0].toUpperCase()+s.slice(1)).join(' ');
    setUserName(name);
    return `Nice to meet you, ${name}! I'll remember your name. ✨`;
  }

  // small talk: greetings
  if (smallTalk.greetings.some(w => input.includes(w))) {
    const maybeName = getUserName();
    const r = smallTalk.greetReplies[Math.floor(Math.random()*smallTalk.greetReplies.length)];
    return maybeName ? `${r} ${maybeName}!` : r;
  }

  // time & date
  if(input.includes('time')) {
    return "Current time: " + new Date().toLocaleTimeString();
  }
  if(input.includes('date')) {
    return "Today's date: " + new Date().toLocaleDateString();
  }

  // jokes
  if(input.includes('joke') || input.includes('tell me a joke')) {
    return jokes[Math.floor(Math.random()*jokes.length)];
  }

  // who made you
  if(input.includes('who made you') || input.includes('who created you')) {
    return "I was created by a JavaScript developer — maybe someone like you!";
  }
  
  if(input.includes('i love you')|| input.includes("I love you")){
    return "love you too!";
  }

  // what can you do
  if(input.includes('what can you do') || input.includes('capabilities') || input.includes('help')) {
    return "I can chat, tell jokes, give time/date, do simple math using `calc: 2+3*4`, remember your name (`my name is ...`), and let you save the chat with `/save`.";
  }

  // deploy/resume FAQs
  for(const f of FAQS) {
    if(input.includes(f.q)) return f.a;
  }

  // calculator: "calc: expression"
  if(input.startsWith('calc:') || input.startsWith('calculate:')) {
    const expr = original.split(':').slice(1).join(':').trim();
    if(!expr) return 'Please provide an expression after "calc:" e.g. calc: (2+3)*4';
    try {
      const value = safeEval(expr);
      return `Result: ${value}`;
    } catch (e) {
      return 'Calculator error: ' + e.message;
    }
  }

  // simple quiz example
  if(input.includes('quiz') || input.includes('start quiz')) {
    return `Quiz: What is 2+2? (Answer by typing: answer: 4)`;
  }
  if(input.startsWith('answer:')) {
    const ans = input.split(':')[1].trim();
    if(ans === '4') return 'Correct! 🎉 Great job.';
    return `You answered: ${ans}. Try again or type "quiz" to restart.`;
  }

  // link detection
  const urlMatch = original.match(/https?:\/\/[^\s]+/);
  if(urlMatch) {
    return `Nice link! I can't open it, but I can remember it for you: ${urlMatch[0]}`;
  }

  // fallback suggestions
  const suggestions = ['Try "tell me a joke"', 'Try "calc: 12/4"', 'Type "/save" to download chat', 'Try "deploy to github pages"'];
  return `Hmm… I didn't get that. ${suggestions[Math.floor(Math.random()*suggestions.length)]}`;
}

// --- Display handlers (use typing) ---
async function sendMessage() {
  const text = inputEl.value.trim();
  if(!text) return;
  // show user message
  createMessageElement(text, 'user');
  inputEl.value = '';
  // show typing animation & then bot reply
  await showTyping(900 + Math.min(1200, text.length * 20));
  const reply = chatbotLogic(text);
  createMessageElement(reply, 'bot', false);
}

// Quick suggestions UI (below chat) - adds clickable chips
function renderSuggestions() {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.gap = '8px';
  container.style.flexWrap = 'wrap';
  container.style.marginTop = '10px';
  const suggestions = ['hello','tell me a joke','calc: 5*7','my name is Ganesh','/save','deploy to github pages'];
  suggestions.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'button-suggestion';
    btn.textContent = s;
    btn.style.padding = '6px 10px';
    btn.style.borderRadius = '10px';
    btn.style.border = '1px solid rgba(255,255,255,0.06)';
    btn.style.background = 'transparent';
    btn.style.color = 'var(--muted)';
    btn.addEventListener('click', () => {
      inputEl.value = s;
      inputEl.focus();
      // send automatically for short suggestions
      if(s.length < 25) setTimeout(sendMessage, 150);
    });
    container.appendChild(btn);
  });
  // attach once
  if(!document.querySelector('.suggestions-row')) {
    container.classList.add('suggestions-row');
    document.querySelector('.container').appendChild(container);
  }
}

// --- Event listeners ---
button.addEventListener('click', sendMessage);
inputEl.addEventListener('keydown', (e) => {
  if(e.key === 'Enter') sendMessage();
});

// init: show welcome and suggestions
(async function init() {
  const name = getUserName();
  await showTyping(800);
  if(name) createMessageElement(`Welcome back, ${name}! Ask me anything or type "help".`, 'bot');
  else createMessageElement("Hi! I'm GG — your friendly assistant. Try 'help', 'tell me a joke', or 'calc: 2+2'.", 'bot', false);
  renderSuggestions();
})();
