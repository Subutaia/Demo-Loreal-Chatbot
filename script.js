/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

/* Store chat messages */
let messages = [
  {
    role: "system",
    content:
      "You are a helpful assistant for L’Oréal. Only answer questions related to L’Oréal products, beauty routines, and product recommendations. If asked about anything else, politely redirect the user to ask about L’Oréal products or routines.",
  },
];

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Remove initial message if it's still there
  if (chatWindow.textContent === "👋 Hello! How can I help you today?") {
    chatWindow.textContent = "";
  }

  // Get user's question
  const userMsg = userInput.value;
  // Add user message to messages array
  messages.push({ role: "user", content: userMsg });

  // Show user's message in chat window
  chatWindow.innerHTML += `<div class="msg user">${userMsg}</div>`;

  // Clear input box
  userInput.value = "";

  // Show loading message
  chatWindow.innerHTML += `<div class="msg ai">Thinking...</div>`;

  // Send request to Cloudflare Worker API
  try {
    // Replace with your actual Cloudflare Worker endpoint URL
    const response = await fetch("https://loreal-chatbot.lukelangan6.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages, // Send messages array to Worker
      }),
    });

    const data = await response.json();

    // Get assistant's reply
    const aiReply = data.choices[0].message.content;

    // Add assistant's reply to messages array
    messages.push({ role: "assistant", content: aiReply });

    // Remove loading message and show reply
    const allMsgs = chatWindow.querySelectorAll(".msg.ai");
    if (allMsgs.length) {
      allMsgs[allMsgs.length - 1].remove();
    }
    chatWindow.innerHTML += `<div class="msg ai">${aiReply}</div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } catch (error) {
    chatWindow.innerHTML += `<div class="msg ai">Sorry, there was a problem. Please try again.</div>`;
  }
});
