document.addEventListener("DOMContentLoaded", () => {
    const questionInput = document.getElementById("questionInput");
    const chatContainer = document.getElementById("chatContainer");
    const generateAnswerBtn = document.getElementById("generateAnswerBtn");
    const API_KEY = "AIzaSyACMbr5cMCJH7VkC_H3GMcfhOlmcmGlr5o";
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
  
    // Add loading state to button
    function setLoading(isLoading) {
      generateAnswerBtn.disabled = isLoading;
      generateAnswerBtn.textContent = isLoading ? "Sending..." : "Send";
    }
  
    // Scroll chat to bottom
    function scrollToBottom() {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  
    // Create and append message to chat
    function appendMessage(content, isUser = false) {
      const message = document.createElement("div");
      message.classList.add("chat-message", isUser ? "user-message" : "ai-message");
      message.textContent = content;
      chatContainer.appendChild(message);
      scrollToBottom();
    }
  
    // Handle API errors
    function handleError(error) {
      console.error("Error:", error);
      appendMessage("I apologize, but I encountered an error. Please try again later.");
      setLoading(false);
    }
  
    async function generateAnswer() {
      const question = questionInput.value.trim();
      if (!question) return;
  
      // Add user message and clear input
      appendMessage(question, true);
      questionInput.value = "";
      setLoading(true);
  
      // Add loading message
      const loadingMessage = document.createElement("div");
      loadingMessage.classList.add("chat-message", "ai-message");
      loadingMessage.textContent = "Thinking...";
      chatContainer.appendChild(loadingMessage);
      scrollToBottom();
  
      try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: question }] }],
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I couldn't generate a response.";
  
        // Remove loading message and add actual response
        loadingMessage.remove();
        appendMessage(answer);
      } catch (error) {
        loadingMessage.remove();
        handleError(error);
      } finally {
        setLoading(false);
      }
    }
  
    // Event Listeners
    generateAnswerBtn.addEventListener("click", generateAnswer);
    
    // Allow sending with Enter key (Shift+Enter for new line)
    questionInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        generateAnswer();
      }
    });
  
    // Auto-resize textarea
    questionInput.addEventListener("input", function() {
      this.style.height = "auto";
      this.style.height = (this.scrollHeight) + "px";
    });
  });
  