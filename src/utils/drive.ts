import drive from "drive-db";

export const getDrive = async <T>(sheetUrl: string): Promise<T[]> => {
  const db = await drive(sheetUrl);

  return db as T[];
};
