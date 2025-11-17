// Main chatbot logic
function chatbot(input) {
  let output = "";
  input = input.toLowerCase().trim();

  // Possible responses
  const greetings = ["hello", "hi", "hey", "good morning", "good evening"];
  const greetReplies = [
    "Hello! How are you today?",
    "Hi there 👋",
    "Hey! Nice to meet you!",
    "Hi! What’s up?"
  ];

  if (greetings.some(word => input.includes(word))) {
    output = greetReplies[Math.floor(Math.random() * greetReplies.length)];
  }
  else if (input.includes("how are you")) {
    output = "I'm doing great, thanks for asking! 😊 How about you?";
  }
  else if (input.includes("your name")) {
    output = "I'm GG — your friendly AI chatbot 🤖";
  }
  else if (input.includes("time")) {
    output = "The current time is " + new Date().toLocaleTimeString();
  }
  else if (input.includes("date")) {
    output = "Today's date is " + new Date().toLocaleDateString();
  }
  else if (input.includes("weather")) {
    output = "I can’t access live weather yet, but I hope it’s sunny where you are ☀️";
  }
  else if (input.includes("tell me a joke")) {
    const jokes = [
      "Why don’t skeletons fight each other? They don’t have the guts!",
      "Why did the computer go to therapy? It had a hard drive!",
      "Parallel lines have so much in common. It’s a shame they’ll never meet."
    ];
    output = jokes[Math.floor(Math.random() * jokes.length)];
  }
  else if (input.includes("bye") || input.includes("goodbye")) {
    output = "Goodbye! Have a great day 😊";
  }
  else if (input.includes("who made you")) {
    output = "I was created by a JavaScript developer — maybe someone like you!";
  }
  else if (input.includes("what can you do")) {
    output = "I can chat, tell jokes, give time/date, and make your day better 😄";
  }
  else {
    output = "Hmm... I’m not sure I understand that 🤔. Try asking me something else!";
  }

  return output;
}

// Display user message
function displayUserMessage(message) {
  const chat = document.getElementById("chat");
  const userMessage = document.createElement("div");
  userMessage.classList.add("message", "user");

  const userText = document.createElement("div");
  userText.classList.add("text");
  userText.textContent = message;

  userMessage.appendChild(userText);
  chat.appendChild(userMessage);
  chat.scrollTop = chat.scrollHeight;
}

// Display bot message
function displayBotMessage(message) {
  const chat = document.getElementById("chat");
  const botMessage = document.createElement("div");
  botMessage.classList.add("message", "bot");

  const botText = document.createElement("div");
  botText.classList.add("text");
  botText.textContent = message;

  botMessage.appendChild(botText);
  chat.appendChild(botMessage);
  chat.scrollTop = chat.scrollHeight;
}

// Send message and get bot response
function sendMessage() {
  const input = document.getElementById("input").value;
  if (input) {
    displayUserMessage(input);
    document.getElementById("input").value = "";

    // Show typing effect
    displayBotMessage("Typing...");
    setTimeout(() => {
      const lastMessage = document.querySelector("#chat .bot:last-child .text");
      lastMessage.textContent = chatbot(input);
    }, 1000);
  }
}

// Event listeners
document.getElementById("button").addEventListener("click", sendMessage);
document.getElementById("input").addEventListener("keypress", function (event) {
  if (event.key === "Enter") sendMessage();
});
