import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "row",
    background: "#f5f6fa", // 白強めのグレー
    overflowX: "hidden",
  },
  sidebar: {
    width: "220px",
    background: "#f5f6fa", // 白強めのグレー
    color: "#333",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
    nav: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // 追加：中央寄せ
    padding: "0",
    overflowX: "auto",
    whiteSpace: "nowrap",
    background: "transparent",
  },
  navList: {
    display: "flex",
    gap: "24px",
    margin: 0,
    padding: "0 0 0 12px",
    listStyle: "none",
  },
  navItem: {
    margin: "16px 0",
    width: "100%",
    textAlign: "center",
  },
  navLink: {
    color: "#222", // 濃いグレー
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    padding: "8px 0",
    display: "block",
    borderRadius: "4px",
    transition: "background 0.2s",
    "&:hover": {
      background: "#e9eaef", // 白強めのグレー
    },
  },
  main: {
    flex: 1,
    background: "#f5f6fa", // 白強めのグレー
  },
  sidebarFull: {
    width: "100vw",
    minHeight: "100vh",
    background: "#f0f1f5", // 白強めのグレー
    color: "#333",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  pageContent: {
    marginTop: "32px",
    width: "100%",
    borderRadius: "8px",
    padding: "32px", // cardの周りの余白
    display: "flex",
    justifyContent: "center", // カードを中央寄せ
    alignItems: "center",     // 垂直方向も中央寄せ
    boxSizing: "border-box",
    background: "transparent", // 余白部分は背景なし
  },
  container: {
    width: "100%",
    maxWidth: "500px",
    minHeight: "300px",
    background: "#fff",                // カードらしい白背景
    borderRadius: "16px",              // 角丸を強調
    margin: "16px auto",               // 上下余白を広めに
    boxSizing: "border-box",
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)", // 影を強調
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    alignSelf: "center",
    overflow: "auto",
    maxHeight: "calc(100vh - 64px)",   // 余白分を調整
    padding: "32px",                   // 内側余白を広めに
    transition: "box-shadow 0.2s",     // ホバー時のアニメーション用
    "&:hover": {
      boxShadow: "0 8px 32px rgba(0,0,0,0.16)", // ホバー時さらに影
    },
  },
});

export default useStyles;