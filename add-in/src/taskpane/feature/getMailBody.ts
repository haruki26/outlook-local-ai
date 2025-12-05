// メール本文をPromiseで取得する関数
export async function fetchMailBody(): Promise<string> {
  return new Promise((resolve, reject) => {
    Office.context.mailbox.item?.body.getAsync(Office.CoercionType.Text, (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        resolve(result.value.replace(/_{5,}/g, ""));
      } else {
        reject(result.error);
      }
    });
  });
}
