import * as React from "react";
import useSearchStyles from "../styles/search.style";
import { useMailBody } from "./knowledge";

const SearchPage: React.FC = () => {
  const styles = useSearchStyles();
  const [query, setQuery] = React.useState<string>("");
  const [results, setResults] = React.useState<string[]>([]);
  const mailBody = useMailBody();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim() === "") return;
    setResults([`「${query}」の検索結果1`, `「${query}」の検索結果2`]);
  };

// ...existing code...
  return (
    <div>
      <h2>メール本文</h2>
      <form className={styles.searchBar} onSubmit={handleSearch}>
        <input
          className={styles.input}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="検索ワードを入力"
        />
        <button className={styles.searchButton} type="submit">
          検索
        </button>
      </form>
      <ul className={styles.resultList}>
        {results.map((result, idx) => (
          <li key={idx} className={styles.resultItem}>
            {result}
          </li>
        ))}
      </ul>
      {/* 検索結果の下に抽出した本文を表示 */}
      <div>
        <h3>抽出した本文</h3>
        <pre>{mailBody}</pre>
      </div>
    </div>
  );
};

export default SearchPage;