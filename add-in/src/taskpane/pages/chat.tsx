import * as React from "react";
import useChatStyles from "../styles/chat.style";

interface Message {
  role: "user" | "assistant";
  message: string;
}

const ChatPage: React.FC = () => {
  const styles = useChatStyles();
  const [receivedMessage, setReceivedMessage] = React.useState<string>("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState<string>("");

  // メッセージ表示部分のref
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // メッセージ追加時にスクロール
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, receivedMessage]);

  const sendMessage = async (message: string) => {
    const resp = await fetch("http://localhost:8000/api/ai/chat-stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: [...messages, { role: "user", message: message }] }),
    });
    if (resp.body === null) {
      console.error("Response body is null");
      return;
    }
    const reader = resp.body.getReader();

    let assistantMessage = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        setMessages((prev) => [...prev, { role: "assistant", message: assistantMessage }]);
        setReceivedMessage("");
        break;
      }
      const chunk = new TextDecoder().decode(value);
      assistantMessage += chunk;
      setReceivedMessage((prev) => prev + chunk);
    }
  };

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages((prev) => [...prev, { role: "user", message: input }]);
    sendMessage(input);
    setInput("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.messagesArea}>
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === "user" ? styles.userMessage : styles.message}>
            {msg.message}
          </div>
        ))}
        {receivedMessage !== "" && <div className={styles.message}>{receivedMessage}</div>}
        <div ref={messagesEndRef} />
      </div>
      <form
        className={styles.inputArea}
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          className={styles.input}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力"
        />
        <button className={styles.sendButton} type="submit">
          送信
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
