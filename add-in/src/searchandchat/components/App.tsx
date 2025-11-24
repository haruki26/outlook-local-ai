import * as React from "react";
import SearchAndChatApp from "../components/SearchAndChatApp";
import { makeStyles } from "@fluentui/react-components";

interface AppProps {
  title: string;
}

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

const App: React.FC<AppProps> = (props: AppProps) => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <SearchAndChatApp title={props.title ?? "検索とAIチャット"} />
    </div>
  );
};

export default App;