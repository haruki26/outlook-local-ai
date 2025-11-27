import * as React from "react";
import { HashRouter, Route, Switch, Link, useLocation, Redirect } from "react-router-dom";
import useStyles from "./styles/App.styles";
import useChatStyles from "./styles/chat.style";
import useSearchStyles from "./styles/search.style";
import ChatPage from "./pages/chat";
import SearchPage from "./pages/search";

const getPageName = (pathname: string) => {
  if (pathname === "/chat") return "Chat";
  if (pathname === "/search") return "Search";
  return "Home";
};

interface AppProps {
  title: string;
}

const App: React.FC<AppProps> = () => {
  const styles = useStyles();
  const chatStyles = useChatStyles();
  const searchStyles = useSearchStyles();
  const location = useLocation();

  // "/" でアクセスされた場合は /search にリダイレクト
  if (location.pathname === "/" || location.pathname === "") {
    return <Redirect to="/search" />;
  }

  return (
    <div className={styles.root} style={{ overflowX: "hidden" }}>
      <div className={styles.sidebarFull}>
        {/* navの外側の余白・白い四角形(div)を完全に削除 */}
        <nav
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // 追加：中央寄せ
            padding: "0 0 0 0",
            overflowX: "auto",
            whiteSpace: "nowrap",
            background: "transparent"
          }}
        >
          <ul
            style={{
              display: "flex",
              gap: "24px",
              margin: 0,
              padding: "0 0 0 12px",
              listStyle: "none"
            }}
          >
            <li>
              <Link className={styles.navLink} to="/chat">Chat</Link>
            </li>
            <li>
              <Link className={styles.navLink} to="/search">Search</Link>
            </li>
            {/* 必要に応じてリンクを追加 */}
          </ul>
        </nav>
        <div className={styles.pageContent}>
          <Switch>
            <Route path="/chat">
              <div className={styles.container}>
                <ChatPage />
              </div>
            </Route>
            <Route path="/search">
              <div className={styles.container}>
                <SearchPage />
              </div>
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

const AppWithRouter: React.FC<AppProps> = (props) => (
  <HashRouter>
    <App title={props.title} />
  </HashRouter>
);

export default AppWithRouter;