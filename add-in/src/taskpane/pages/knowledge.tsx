import React, { useState } from "react";
import { Tag, VectorMail } from "../types";
import useKnowledgeStyles from "../styles/knowledge.style";
import { fetchMailBody } from "../feature/getMailBody";

const Modal: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode }> = ({ open, onClose, children }) => {
  const styles = useKnowledgeStyles();
  if (!open) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <p className={styles.modalContent}>
          {children}
        </p>
        <button className={styles.closeButton} onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
};

const tagList: Tag[] = [
  { id: "1", name: "重要" },
  { id: "2", name: "対応済み" },
  { id: "3", name: "要確認" },
  // 必要に応じてタグ追加
];

const KnowledgePage: React.FC = () => {
  const [mailBody, setMailBody] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [tags, setTags] = useState<Tag[]>(tagList);
  const [newTagName, setNewTagName] = useState("");
  const styles = useKnowledgeStyles();

  const handleTagChange = (id: string) => {
    setSelectedTagIds(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const handleOpenModal = async () => {
    if (mailBody === null) {
      setMailBody(await fetchMailBody())
    }
    setOpen(true);
  }

  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    const newTag: Tag = {
      id: (tags.length + 1).toString(),
      name: newTagName.trim(),
    };
    setTags([...tags, newTag]);
    setNewTagName("");
  };

  const handleUndecidedButton = () => {
    const selectedTags = tags.filter(tag => selectedTagIds.includes(tag.id));
    const vectorMail: VectorMail = {
      id: "dummy-id", // 仮のID
      part: mailBody, // メール本文
      sectionId: "dummy-section", // 仮のセクションID
      tag: selectedTags,
    };
    console.log("VectorMail（形だけ）:", vectorMail);
    // ここで裏側に送信する処理を追加予定
  };

  return (
    <>
    <div className={styles.container}>
      <button className={styles.openButton} onClick={handleOpenModal}>
        メール本文を表示
      </button>
      <hr className={styles.hr} />
      {/* タグ付けスペースをToDoリスト風に表示 */}
      <div className={styles.tagArea}>
        <span className={styles.tagLabel}>タグ付け：</span>
        <ul className={styles.tagList}>
          {tags.map(tag => (
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
        <form
          className={styles.tagInputArea}
          onSubmit={e => {
            e.preventDefault();
            handleAddTag();
          }}
        >
          <input
            type="text"
            value={newTagName}
            onChange={e => setNewTagName(e.target.value)}
            placeholder="新しいタグ名"
            className={styles.tagInput}
          />
          <button
            className={styles.addTagButton}
            onClick={handleAddTag}
          >
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