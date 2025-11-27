import * as React from "react";
import useChatStyles from "../styles/chat.style";

const ChatPage: React.FC = () => {
  const styles = useChatStyles();
  const [messages, setMessages] = React.useState<string[]>([]);
  const [input, setInput] = React.useState<string>("");

  // メッセージ表示部分のref
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // メッセージ追加時にスクロール
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages([...messages, input]);
    setInput("");
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div>
      <div
        style={{
          maxHeight: "300px", // 必要に応じて高さ調整
          overflowY: "auto",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={styles.message}>
            {msg}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputArea}>
        <input
          className={styles.input}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="メッセージを入力"
        />
        <button className={styles.sendButton} onClick={handleSend}>
          送信
        </button>
      </div>
    </div>
  );
};

export default ChatPage;