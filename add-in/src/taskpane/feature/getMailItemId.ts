export const getMailItemId = async (): Promise<string | undefined> => {
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
