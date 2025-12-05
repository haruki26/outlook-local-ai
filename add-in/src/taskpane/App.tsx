import * as React from "react";
import { HashRouter, Route, Switch, Link, useLocation, Redirect } from "react-router-dom";
import useStyles from "./styles/App.styles";
import ChatPage from "./pages/chat";
import SearchPage from "./pages/search";
import Knowledge from "./pages/knowledge";

interface AppProps {
  title: string;
}

const App: React.FC<AppProps> = () => {
  const styles = useStyles();
  const location = useLocation();

  // "/" でアクセスされた場合は /search にリダイレクト
  if (location.pathname === "/" || location.pathname === "") {
    return <Redirect to="/search" />;
  }

  return (
    <div className={styles.root}>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <Link
                className={`${styles.navLink} 
                ${location.pathname === "/search" ? styles.activeNavLink : ""}`}
                to="/search"
              >
                Search
              </Link>
            </li>
            <li>
              <Link
                className={`${styles.navLink} 
                ${location.pathname === "/Knowledge" ? styles.activeNavLink : ""}`}
                to="/Knowledge"
              >
                Knowledge
              </Link>
            </li>
            {/* 必要に応じてリンクを追加 */}
          </ul>
        </nav>
        <div className={styles.pageContent}>
          <Switch>
            <Route path="/search">
              <div>
                <SearchPage />
              </div>
            </Route>
            <Route path="/knowledge">
              <div className={styles.container}>
                <Knowledge />
              </div>
            </Route>
          </Switch>
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
