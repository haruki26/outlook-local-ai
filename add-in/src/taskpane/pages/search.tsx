import * as React from "react";
import useSearchStyles from "../styles/search.style";

const SearchPage: React.FC = () => {
  const styles = useSearchStyles();
  const [query, setQuery] = React.useState<string>("");
  const [results, setResults] = React.useState<string[]>([]);

  const handleSearch = () => {
    if (query.trim() === "") return;
    // 検索処理（例: ダミー結果）
    setResults([`「${query}」の検索結果1`, `「${query}」の検索結果2`]);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <div className={styles.searchBar}>
        <input
          className={styles.input}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="検索ワードを入力"
        />
        <button className={styles.searchButton} onClick={handleSearch}>
          検索
        </button>
      </div>
      <ul className={styles.resultList}>
        {results.map((result, idx) => (
          <li key={idx} className={styles.resultItem}>
            {result}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;