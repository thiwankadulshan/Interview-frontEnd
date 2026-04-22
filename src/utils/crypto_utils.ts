import bcrypt from 'bcryptjs';

export const hashText = async (text: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(text, saltRounds);
};

export const compareWithHash = async (text: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(text, hash);
};
