import { makeStyles } from "@fluentui/react-components";

const useSearchStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    padding: "0 0.5rem",
  },
  searchBox: {
    display: "flex",
    maxWidth: "100%", // 追加
    alignSelf: "center",
    alignItems: "center",
    justifyItems: "center",
    gap: "0.5rem",
    backgroundColor: "#fff",
    borderRadius: "0.7rem",
    padding: "1rem 1.5rem",
  },
  input: {
    flex: 1,
    padding: "0.6rem",
    borderRadius: "0.5rem",
    border: "1px solid #ccc",
    background: "#fff",
  },
  searchButton: {
    padding: "0.5rem",
    borderRadius: "0.5rem",
    background: "#0078d4",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 500,
    "&:hover": {
      background: "#005a9e",
    },
    "&:disabled": {
      background: "#ccc",
      color: "#999",
      cursor: "not-allowed",
    },
  },
  resultList: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    margin: "1rem 0",
    padding: "0 0.5rem",
  },
  resultItem: {
    maxWidth: "100%",
    padding: "0.5rem",
    borderRadius: "0.5rem",
    background: "#e3e7ee",
    border: "none",
    color: "#333",
    cursor: "pointer",
    "&:hover": {
      background: "#d9e1eb",
    },
  },
  resultItemText: {
    display: "-webkit-box",
    "-webkit-box-orient": "vertical",
    "-webkit-line-clamp": "3",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

export default useSearchStyles;
