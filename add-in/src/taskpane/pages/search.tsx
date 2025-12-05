import React, { useState } from "react";
import useSearchStyles from "../styles/search.style";
import { apiClient } from "../apiClient";
import { VectorMail } from "../types";
import { openMailItem } from "../taskpane";

const SearchPage: React.FC = () => {
  const styles = useSearchStyles();
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<VectorMail[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const res = await apiClient.vectorStore.search.post({ query, tagIds: [] });
    setResults(res);
  };

  return (
    <div>
      <form className={styles.searchBar} onSubmit={handleSearch}>
        <input
          className={styles.input}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="検索ワードを入力"
        />
        <button className={styles.searchButton} type="submit">
          検索
        </button>
      </form>
      <ul className={styles.resultList}>
        {results.map((result, idx) => (
          <li key={idx} className={styles.resultItem} onClick={() => openMailItem(result.id)}>
            {result.part}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;
