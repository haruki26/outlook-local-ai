import React, { useState } from "react";
import useKnowledgeStyles from "../styles/knowledge.style";
import { getMailBody, getMailItemId } from "../taskpane";
import { apiClient } from "../apiClient";
import { useFetch } from "../hooks/useFetch";
import Modal from "../components/Modal";

const KnowledgePage: React.FC = () => {
  const { data: isRegistered, refetch: refetchRegistered } = useFetch({
    fetchFn: async () =>
      await apiClient.vectorStore.registeredCheck.post({
        mailId: getMailItemId() || "",
      }),
  });

  const [openMailModal, setOpenMailModal] = useState(false);
  const [openTagModal, setOpenTagModal] = useState(false);

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [generatedTags, setGeneratedTags] = useState<string[] | null>(null);
  
  const [submitting, setSubmitting] = useState(false);

  const {
    data: tags,
    isLoading: isTagsLoading,
    refetch: refetchTags,
  } = useFetch({ fetchFn: async () => await apiClient.tags.get() });
  const { data: mailBody, isLoading: isMailBodyLoading } = useFetch({ fetchFn: getMailBody });
  const styles = useKnowledgeStyles();

  const handleTagChange = (id: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const handleAddTag = async (newTag: string) => {
    if (!newTag.trim()) return;
    await apiClient.tags.post({ name: newTag });
    refetchTags();
  };

  const handleAddNewTag = async () => {
    await handleAddTag(newTagName);
    setNewTagName("");
  };

  const handleAddGeneratedTag = async (generatedTag: string) => {
    await handleAddTag(generatedTag);
    setGeneratedTags((prev) => prev?.filter((tag) => tag !== generatedTag) || []);
  };

  const handleUndecidedButton = async () => {
    const mailItemId = getMailItemId();
    if (mailItemId && mailBody) {
      setSubmitting(true);
      await apiClient.vectorStore.post({
        id: mailItemId,
        mail: mailBody, // メール本文
        tagIds: selectedTagIds,
      });
      refetchRegistered();
      setSubmitting(false);
    }
  };

  const handleGenerateTags = async () => {
    if (mailBody === null) return;
    const res = await apiClient.ai.ner.post({ text: mailBody });
    setGeneratedTags(res.map((tag) => tag.text));
    setOpenTagModal(true);
  };

  return (
    <>
      <div className={styles.container}>
        <button
          className={styles.openButton}
          onClick={() => setOpenMailModal(true)}
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
              handleAddNewTag();
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
          <button onClick={handleGenerateTags} className={styles.generateButton}>
            メール本文からタグを生成
          </button>
          {/* 仕切り線を追加 */}
          <hr className={styles.hr} />
          {/* ここに「ナレッジに追加」ボタンを追加 */}
          <button
            className={styles.saveButton}
            onClick={handleUndecidedButton}
            disabled={(isRegistered ?? false) || submitting}
          >
            ナレッジに追加
          </button>
        </div>
      </div>
      <Modal open={openMailModal} onClose={() => setOpenMailModal(false)}>
        {mailBody}
      </Modal>
      <Modal open={openTagModal} onClose={() => setOpenTagModal(false)}>
        <ul className={styles.tagList}>
          {generatedTags !== null
            ? generatedTags.map((tag) => (
                <li key={tag} className={styles.tagLabelItem}>
                  <span>{tag}</span>
                  <button
                    onClick={() => handleAddGeneratedTag(tag)}
                    className={styles.addTagButton}
                  >
                    追加
                  </button>
                </li>
              ))
            : null}
        </ul>
      </Modal>
    </>
  );
};

export default KnowledgePage;
