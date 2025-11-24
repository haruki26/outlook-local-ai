import * as React from "react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import SearchAndChat from "./SearchAndChat";

interface SearchAndChatAppProps {
  title?: string;
}

const SearchAndChatApp: React.FC<SearchAndChatAppProps> = ({ title }) => {
  return (
    <FluentProvider theme={webLightTheme}>
      <div style={{ minHeight: "100vh", padding: 24 }}>
        {title && <h2>{title}</h2>}
        <SearchAndChat />
      </div>
    </FluentProvider>
  );
};

export default SearchAndChatApp;