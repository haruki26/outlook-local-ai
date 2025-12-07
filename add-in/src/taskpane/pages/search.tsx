import React, { useState } from "react";
import useSearchStyles from "../styles/search.style";
import { apiClient } from "../apiClient";
import type { Concept, VectorMail } from "../types";
import { openMailItem } from "../taskpane";
import Modal from "../components/Modal";
import { useFetch } from "../hooks/useFetch";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Switch,
} from "@fluentui/react-components";

interface ConceptSearchResult {
  concept: Concept;
  mails: VectorMail[];
}

const SearchPage: React.FC = () => {
  const {
    data: tags,
    isLoading: isTagsLoading,
    refetch: refetchTags,
  } = useFetch({ fetchFn: async () => await apiClient.tags.get() });
  const styles = useSearchStyles();

  const [isConceptSearch, setIsConceptSearch] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [modalItem, setModalItem] = useState<VectorMail | null>(null);

  const [normalSearchResults, setNormalSearchResults] = useState<VectorMail[]>([]);
  const [conceptSearchResults, setConceptSearchResults] = useState<ConceptSearchResult[]>([]);

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const handleTagChange = (id: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setNormalSearchResults([]);
    setConceptSearchResults([]);

    if (!query.trim()) return;

    setIsLoading(true);
    if (isConceptSearch) {
      const res = await apiClient.vectorStore.searchWithConcept.post({
        query,
        tagIds: selectedTagIds,
      });
      setConceptSearchResults(res);
    } else {
      const res = await apiClient.vectorStore.search.post({ query, tagIds: selectedTagIds });
      setNormalSearchResults(res);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className={styles.container}>
        <form className={styles.searchContainer} onSubmit={handleSearch}>
          <Switch
            label="概念検索"
            checked={isConceptSearch}
            onChange={() => setIsConceptSearch((prev) => !prev)}
            labelPosition="before"
          />
          <div className={styles.searchBox}>
            <input
              className={styles.input}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="検索ワードを入力"
            />
            <button className={styles.searchButton} type="submit" disabled={isLoading}>
              検索
            </button>
          </div>
          <Accordion collapsible className={styles.settingsContainer}>
            <AccordionItem value="1">
              <AccordionHeader>検索設定</AccordionHeader>
              <AccordionPanel className={styles.settingsPanel}>
                <div className={styles.panelItem}>
                  <div className={styles.panelItemTitle}>タグ設定</div>
                  <div className={styles.panelItemContent}>
                    {isTagsLoading ? (
                      <div>Loading...</div>
                    ) : (
                      <ul className={styles.tagList}>
                        {tags !== null &&
                          tags.map((tag) => (
                            <li key={tag.id} className={styles.tagItem}>
                              <label className={styles.tagLabelItem}>
                                <input
                                  type="checkbox"
                                  checked={selectedTagIds.includes(tag.id)}
                                  onChange={() => handleTagChange(tag.id)}
                                  className={styles.tagCheckbox}
                                />
                                <span>{tag.name}</span>
                              </label>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                </div>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </form>
        {isLoading && <span className={styles.loadingLabel}>検索中...</span>}
        <ul className={styles.resultList}>
          {isConceptSearch
            ? conceptSearchResults.map(({ concept, mails }) => (
                <li key={concept.id}>
                  <span>{concept.label}</span>
                  <ul>
                    {mails.map((mail) => (
                      <li
                        key={mail.id}
                        className={styles.resultItem}
                        onClick={() => setModalItem(mail)}
                      >
                        <span className={styles.resultItemText}>{mail.part}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))
            : normalSearchResults.map((result) => (
                <li
                  key={result.id}
                  className={styles.resultItem}
                  onClick={() => setModalItem(result)}
                >
                  <span className={styles.resultItemText}>{result.part}</span>
                </li>
              ))}
        </ul>
      </div>
      {modalItem !== null && (
        <Modal open={modalItem !== null} onClose={() => setModalItem(null)}>
          <div className={styles.modalContainer}>
            <p className={styles.mailPart}>{modalItem.part}</p>
            <button className={styles.openMailButton} onClick={() => openMailItem(modalItem.id)}>
              メールを開く
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default SearchPage;
