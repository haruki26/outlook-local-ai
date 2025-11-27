import { makeStyles } from "@fluentui/react-components";

const useSearchStyles = makeStyles({
  searchBar: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
    width: "100%", // 追加
    maxWidth: "500px", // 追加: 検索バーの最大幅を制限
    alignSelf: "center", // 追加: 中央寄せ
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    background: "#fff",
    minWidth: 0, // 追加: flexアイテムのはみ出し防止
  },
  searchButton: {
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
  resultList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  resultItem: {
    padding: "12px",
    borderRadius: "6px",
    background: "#e3e7ee",
    border: "none",
    marginBottom: "8px",
    color: "#333",
  },
});

export default useSearchStyles;