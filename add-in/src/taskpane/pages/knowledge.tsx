import React, { useState } from "react";
import useKnowledgeStyles from "../styles/knowledge.style";
import { fetchMailBody } from "../feature/getMailBody";
import { getMailItemId } from "../feature/getMailItemId";
import { apiClient } from "../apiClient";
import { useFetch } from "../hooks/useFetch";

const Modal: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode }> = ({
  open,
  onClose,
  children,
}) => {
  const styles = useKnowledgeStyles();
  if (!open) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <p className={styles.modalContent}>{children}</p>
        <button className={styles.closeButton} onClick={onClose}>
          閉じる
        </button>
      </div>
    </div>
  );
};

const KnowledgePage: React.FC = () => {
  const {
    data: tags,
    isLoading: isTagsLoading,
    refetch: refetchTags,
  } = useFetch({ fetchFn: async () => await apiClient.tags.get() });
  const { data: mailBody, isLoading: isMailBodyLoading } = useFetch({ fetchFn: fetchMailBody });

  const [open, setOpen] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const styles = useKnowledgeStyles();

  const handleTagChange = (id: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;
    await apiClient.tags.post({ name: newTagName });
    refetchTags();
    setNewTagName("");
  };

  const handleUndecidedButton = async () => {
    const mailItemId = await getMailItemId();
    if (mailItemId && mailBody) {
      await apiClient.vectorStore.post({
        id: mailItemId,
        mail: mailBody, // メール本文
        tags: selectedTagIds,
      });
    }
  };

  return (
    <>
      <div className={styles.container}>
        <button
          className={styles.openButton}
          onClick={() => setOpen(true)}
          disabled={isMailBodyLoading}
        >
          メール本文を表示
        </button>
        <hr className={styles.hr} />
        {/* タグ付けスペースをToDoリスト風に表示 */}
        <div className={styles.tagArea}>
          <span className={styles.tagLabel}>タグ付け：</span>
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
          <form
            className={styles.tagInputArea}
            onSubmit={(e) => {
              e.preventDefault();
              handleAddTag();
            }}
          >
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="新しいタグ名"
              className={styles.tagInput}
            />
            <button type="submit" className={styles.addTagButton}>
              追加
            </button>
          </form>
          {/* 仕切り線を追加 */}
          <hr className={styles.hr} />
          {/* ここに「ナレッジに追加」ボタンを追加 */}
          <button className={styles.saveButton} onClick={handleUndecidedButton}>
            ナレッジに追加
          </button>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        {mailBody}
      </Modal>
    </>
  );
};

export default KnowledgePage;
