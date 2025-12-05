/* global Office console */

export const getMailBody = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    Office.context.mailbox.item?.body.getAsync(Office.CoercionType.Text, (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        resolve(result.value.replace(/_{5,}/g, ""));
      } else {
        reject(result.error);
      }
    });
  });
};

export const getMailItemId = (): string | undefined => {
  try {
    const mailItem = Office.context.mailbox.item;
    if (mailItem) {
      return mailItem.itemId;
    }
  } catch (error) {
    console.error("Error getting mail item ID:", error);
  }
  return undefined;
};
