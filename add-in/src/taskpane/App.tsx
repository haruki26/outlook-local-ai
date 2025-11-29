import * as React from "react";
import { HashRouter, Route, Switch, Link, useLocation, Redirect } from "react-router-dom";
import useStyles from "./styles/App.styles";
import useChatStyles from "./styles/chat.style";
import useSearchStyles from "./styles/search.style";
import ChatPage from "./pages/chat";
import SearchPage from "./pages/search";
import { MailBodyProvider } from "./pages/knowledge";

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
    <div className={styles.root}>
      <div className={styles.sidebarFull}>
        {/* navの外側の余白・白い四角形(div)を完全に削除 */}
        <nav className={styles.nav}>
          <ul className={styles.navList}>
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
            <MailBodyProvider>
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
            </MailBodyProvider>
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