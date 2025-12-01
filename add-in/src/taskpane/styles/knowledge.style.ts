import { makeStyles } from "@fluentui/react-components";

const useKnowledgeStyles = makeStyles({
  // モーダル
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    gap: "8px"
  },
  modalContainer: {
    background: "#fff",
    padding: "12px", // パディングを12pxに変更
    borderRadius: "8px",
    maxWidth: "600px",
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
    fontSize: "0.9em",
    position: "relative",
    margin: "0 12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
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
    width: "100%",
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
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
    width: "100%",
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
    height: "32px",
  },
  // タグ
  addTagButton: {
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "0 8px",
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
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  tagInput: {
    marginRight: "8px",
    padding: "0 16px", // ボタンと同じパディング
    height: "32px", // ボタンと同じ高さ
    boxSizing: "border-box",
    fontSize: "0.95em",
    flex: 1,
    minWidth: 0,
  },
  // 水平線
  hr: {
    border: "none",
    height: "1px",
    width: "100%",
    backgroundColor: "#ccc",
  },
  // ナレッジに追加ボタン
  centerArea: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default useKnowledgeStyles;
