import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    maxWidth: "100%",
    minHeight: "100vh",
    background: "#f0f1f5", // 白強めのグレー
    color: "#333",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingLeft: "0",
  },
  nav: {
    padding: "1.2em",
    whiteSpace: "nowrap",
    background: "transparent",
  },
  navList: {
    display: "flex",
    gap: "1rem",
    listStyle: "none",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    margin: 0,
  },
  navItem: {
    textAlign: "center",
  },
  navLink: {
    color: "#222", // 濃いグレー
    textDecoration: "none",
    padding: "0.2rem 0.5rem",
    fontSize: "1.5em",
    fontWeight: 500,
    display: "block",
    borderRadius: "0.5rem",
    transition: "background 0.2s",
    "&:hover": {
      background: "#e9eaef", // 白強めのグレー
    },
  },
  activeNavLink: {
    borderBottom: "3px solid #1976d2", // お好みの色に変更可能
  },
  pageContent: {
    width: "100%",
    display: "flex",
    justifyContent: "center", // カードを中央寄せ
    alignItems: "center", // 垂直方向も中央寄せ
    boxSizing: "border-box",
    background: "transparent", // 余白部分は背景なし
  },
  container: {
    width: "100%",
    background: "#fff", // カードらしい白背景
    borderRadius: "0.5rem", // 角丸を強調
    margin: "0 0.5rem", // 上下余白を広めに
    boxSizing: "border-box",
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)", // 影を強調
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    overflow: "auto",
    padding: "2rem 0.5rem", // 内側余白を広めに
    transition: "box-shadow 0.2s", // ホバー時のアニメーション用
    "&:hover": {
      boxShadow: "0 8px 32px rgba(0,0,0,0.16)", // ホバー時さらに影
    },
  },
});

export default useStyles;
