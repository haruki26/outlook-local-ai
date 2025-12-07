import { makeStyles } from "@fluentui/react-components";

const useKnowledgeStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    gap: "0.5rem",
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
  saveButton: {
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "6px 16px",
    cursor: "pointer",
    fontSize: "0.95em",
    height: "32px",
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
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
    gap: "0.5rem",
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
  generateButton: {
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "6px 16px",
    cursor: "pointer",
    fontSize: "0.95em",
    height: "32px",
  },
});

export default useKnowledgeStyles;
