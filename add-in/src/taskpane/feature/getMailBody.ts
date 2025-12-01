// メール本文をPromiseで取得する関数
export function fetchMailBody(): Promise<string> {
    return new Promise((resolve, reject) => {
        Office.context.mailbox.item.body.getAsync("text", (result) => {
    if (result.status === Office.AsyncResultStatus.Succeeded) {
        const res = result
            .value
            .replace(/_{5,}/g, "")
            .replace(/。/g, "。\n")
        resolve(res);
    } else {
        reject(result.error);
    }
    });
});
}