import * as React from "react";
import { Input, Button, Card, Title3 } from "@fluentui/react-components";

const SearchAndChat: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResult, setSearchResult] = React.useState<string | null>(null);
  const [chatInput, setChatInput] = React.useState("");
  const [chatHistory, setChatHistory] = React.useState<string[]>([]);

  // ダミー検索処理
  const handleSearch = () => {
    setSearchResult(`「${searchQuery}」の検索結果（ダミー）`);
  };

  // ダミーチャット処理
  const handleChatSend = () => {
    if (chatInput.trim()) {
      setChatHistory([...chatHistory, `ユーザー: ${chatInput}`, `AI: これはAIのダミー回答です。`]);
      setChatInput("");
    }
  };

  return (
    <Card>
      <Title3>検索とAIチャット</Title3>
      {/* 検索エリア */}
      <Input
        value={searchQuery}
        onChange={(_, data) => setSearchQuery(data.value)}
        placeholder="キーワードを入力"
      />
      <Button onClick={handleSearch} appearance="primary" style={{ marginTop: 8 }}>
        検索
      </Button>
      {searchResult && (
        <div style={{ marginTop: 8, marginBottom: 16 }}>
          <strong>検索結果:</strong> {searchResult}
        </div>
      )}

      {/* AIチャットエリア */}
      <Input
        value={chatInput}
        onChange={(_, data) => setChatInput(data.value)}
        placeholder="メッセージを入力"
      />
      <Button onClick={handleChatSend} appearance="primary" style={{ marginTop: 8 }}>
        送信
      </Button>
      <div style={{ marginTop: 8 }}>
        {chatHistory.map((msg, idx) => (
          <div key={idx}>{msg}</div>
        ))}
      </div>
    </Card>
  );
};

export default SearchAndChat;
