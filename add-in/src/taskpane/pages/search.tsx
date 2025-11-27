import * as React from "react";
import useSearchStyles from "../styles/search.style";

const SearchPage: React.FC = () => {
  const styles = useSearchStyles();
  const [query, setQuery] = React.useState<string>("");
  const [results, setResults] = React.useState<string[]>([]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim() === "") return;
    setResults([`「${query}」の検索結果1`, `「${query}」の検索結果2`]);
  };

  return (
    <div>
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
    </div>
  );
};

export default SearchPage;