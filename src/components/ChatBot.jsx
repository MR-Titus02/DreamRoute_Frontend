import React, { useState, useRef, useEffect } from "react";
import axios from "../api/axios";
import { X, Send, MessageSquare } from "lucide-react";

const MAX_LENGTH = 300;

const ChatBot = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expanded, setExpanded] = useState({});

  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSend = async () => {
    const message = input.trim();
    if (!message || isTyping) return;

    const userMessage = { sender: "user", text: message };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post("/chat", {
        message,
        userId,
      });

      const botMessage = {
        sender: "bot",
        text: res.data.reply || "Sorry, I didn't get that.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "I couldn't get a response. Please try again.", isError: true },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const toggleReadMore = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const renderMessage = (msg, idx) => {
    const isLong = msg.text.length > MAX_LENGTH;
    const isExpanded = expanded[idx];
    const displayedText =
      isLong && !isExpanded ? msg.text.slice(0, MAX_LENGTH) + "..." : msg.text;

    return (
      <div
        key={idx}
        role={msg.isError ? "alert" : "article"}
        className={`max-w-[85%] px-3 py-2 rounded-lg text-sm whitespace-pre-line ${
          msg.sender === "user"
            ? "ml-auto bg-primary text-primary-foreground"
            : msg.isError
              ? "mr-auto border border-error/30 bg-destructive/10 text-error"
              : "mr-auto bg-muted text-foreground"
        }`}
      >
        {displayedText}
        {isLong && (
          <button
            className="text-xs text-blue-600 ml-1 underline"
            type="button"
            aria-expanded={isExpanded}
            onClick={() => toggleReadMore(idx)}
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          type="button"
          aria-label="Open DreamRoute chat"
          className="fixed bottom-6 right-6 z-50 rounded-full bg-primary p-3 text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
          onClick={toggleChat}
        >
          <MessageSquare />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <section
          aria-label="DreamRoute chat"
          className="fixed bottom-20 right-3 z-50 flex max-h-[min(32rem,calc(100vh-6rem))] w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xl sm:right-6 sm:w-80"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-primary p-3 text-primary-foreground">
            <span className="font-semibold">DreamRoute Bot</span>
            <button
              type="button"
              onClick={toggleChat}
              aria-label="Close DreamRoute chat"
              className="rounded p-1 hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            aria-live="polite"
            aria-relevant="additions text"
            className="flex-1 space-y-2 overflow-y-auto bg-background p-3"
            style={{ height: "20rem" }}
          >
            {messages.map((msg, idx) => renderMessage(msg, idx))}

            {isTyping && (
              <div role="status" className="mr-auto animate-pulse rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                DreamRoute is typing...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            className="flex gap-2 border-t border-border p-2"
            onSubmit={(event) => {
              event.preventDefault();
              handleSend();
            }}
          >
            <input
              aria-label="Message"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="min-w-0 flex-1 rounded-lg border border-input bg-background p-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
              className="rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send aria-hidden="true" className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}
    </>
  );
};

export default ChatBot;
