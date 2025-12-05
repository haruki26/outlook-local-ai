import * as React from "react";
import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  modalContainer: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "0.5rem",
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
    fontSize: "0.9em",
    position: "relative",
    margin: "0 1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.3)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    width: "100%",
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
  },
  closeButton: {
    background: "#eee",
    border: "none",
    borderRadius: "4px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    marginTop: "1em", // メール本文の下に余白を追加
    display: "block", // 横幅いっぱいに表示（必要なら）
    marginLeft: "auto",
    marginRight: "auto",
  },
});


interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<Props> = ({
  open,
  onClose,
  children,
}) => {
  const styles = useStyles();
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

export default Modal;
