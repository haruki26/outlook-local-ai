import { makeStyles } from "@fluentui/react-components";

const useKnowledgeStyles = makeStyles({
  // モーダル
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.3)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    background: "#fff",
    padding: "12px",         // パディングを12pxに変更
    borderRadius: "8px",
    maxWidth: "600px",
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
    position: "relative",
    marginLeft: "12px",      // マージンを12pxに変更
    marginRight: "12px",     // マージンを12pxに変更
  },
  // ボタン
  openButton: {
    top: "1rem",
    right: "1rem",
    background: "#eee",
    border: "none",
    borderRadius: "4px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    boxShadow: "none", // 影を消す
  },
  closeButton: {
    background: "#eee",
    border: "none",
    borderRadius: "4px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    marginTop: "1em", // メール本文の下に余白を追加
    display: "block", // 横幅いっぱいに表示（必要なら）
    marginLeft: "auto",
    marginRight: "auto",
  },
  saveButton: {
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "6px 16px",
    cursor: "pointer",
    fontSize: "0.95em",
    marginTop: "0.5em",
  },
  // タグ
  addTagButton: {
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "0 16px",
    height: "32px", 
    cursor: "pointer",
    fontSize: "0.95em",
    minWidth: "64px", // 最小幅を設定
    display: "inline-block",
  },
  tagArea: {
    display: "flex",
    flexDirection: "column",
    gap: "16px", // ここを追加
  },
  tagLabel: {
    fontWeight: "bold",
  },
  tagList: {
    listStyle: "none",
    paddingLeft: 0,
    margin: 0,
  },
  tagItem: {
    marginBottom: "6px",
  },
  tagLabelItem: {
    display: "flex",
    alignItems: "center",
  },
  tagCheckbox: {
    marginRight: "8px",
  },
  tagInputArea: {
    marginTop: "0.5em",
    display: "flex",
    alignItems: "center",
  },
  tagInput: {
    marginRight: "8px",
    padding: "0 16px", // ボタンと同じパディング
    height: "32px",      // ボタンと同じ高さ
    boxSizing: "border-box",
    fontSize: "0.95em",
  },
  // 水平線
  hr: {
    margin: "16px 0 -8px 0", // 下マージンを縮める
    border: "none",
    borderTop: "1px solid #ccc",
  },
  // ナレッジに追加
  centerArea: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default useKnowledgeStyles;