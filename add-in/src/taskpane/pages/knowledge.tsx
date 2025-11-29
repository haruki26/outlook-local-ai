import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchMailBody } from "../feature/getMailBody";

const MailBodyContext = createContext<string>("");

export const useMailBody = () => useContext(MailBodyContext);

export const MailBodyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mailBody, setMailBody] = useState<string>("");
useEffect(() => {
  fetchMailBody()
    .then(body => {
      // ここで本文を加工
      const cleanedBody = body
      // ここに消したい文字・記号を入力する
      .replace(/________________________________________________________________________________/g, "")
      .replace(/。/g, "\n")
      .replace(/ /g, "\n");
      setMailBody(cleanedBody);
    })
    .catch(() => setMailBody("メール本文の取得に失敗しました"));
}, []);

  return (
    <MailBodyContext.Provider value={mailBody}>
      {children}
    </MailBodyContext.Provider>
  );
};