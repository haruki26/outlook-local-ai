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

  return (
    <div>
      <div className={styles.messagesArea}>
        {messages.map((msg, idx) => (
          <div key={idx} className={styles.message}>
            {msg}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        className={styles.inputArea}
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          className={styles.input}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
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