import { makeStyles } from "@fluentui/react-components";

const useChatStyles = makeStyles({
  message: {
    padding: "12px",
    borderRadius: "6px",
    background: "#e3e7ee",
    color: "#333",
    marginBottom: "8px",
    alignSelf: "flex-start",
    maxWidth: "70%",
  },
  userMessage: {
    background: "#d1f0ff",
    alignSelf: "flex-end",
  },
  messagesArea: {
    maxHeight: "40vh", // 画面高さの40%を上限に
    overflowY: "auto",
    width: "100%",
    marginBottom: "8px",
  },
  inputArea: {
    marginTop: "auto",
    display: "flex",
    gap: "8px",
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    background: "#fff",
    minWidth: 0, // 追加: flexアイテムのはみ出し防止
  },
  sendButton: {
    padding: "8px 16px",
    borderRadius: "4px",
    background: "#0078d4",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 500,
    "&:hover": {
      background: "#005a9e",
    },
  },
});

export default useChatStyles;