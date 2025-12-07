import { makeStyles } from "@fluentui/react-components";

const useSearchStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    padding: "0 0.5rem",
  },
  searchContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    gap: "1rem",
    backgroundColor: "#fff",
    borderRadius: "0.7rem",
    padding: "1rem 1.5rem",
  },
  searchBox: {
    display: "flex",
    maxWidth: "100%", // 追加
    alignSelf: "center",
    alignItems: "center",
    justifyItems: "center",
    gap: "0.5rem",
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
  modalContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    width: "100%",
  },
  mailPart: {
    fontSize: "1em",
    color: "#333",
  },
  openMailButton: {
    padding: "0.5rem 0",
    borderRadius: "0.5rem",
    background: "#0078d4",
    minWidth: "100%",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "0.9em",
    "&:hover": {
      background: "#005a9e",
    },
    "&:disabled": {
      background: "#ccc",
      color: "#999",
      cursor: "not-allowed",
    },
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
  loadingLabel: {
    color: "#999",
    fontSize: "0.9em",
    fontWeight: "bold",
  },
  settingsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    minWidth: "100%",
  },
  settingsPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    width: "100%",
  },
  panelItem: {
    minWidth: "100%",
    display: "flex",
    alignItems: "start",
    flexDirection: "column",
    gap: "0.3rem",
  },
  panelItemTitle: {
    fontWeight: "bold",
    fontSize: "1em",
    color: "#333",
  },
  panelItemContent: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "0.5rem",
    alignItems: "center",
  },
});

export default useSearchStyles;
