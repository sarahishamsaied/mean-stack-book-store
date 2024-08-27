import bcrypt from 'bcrypt';
export const hash = async (str: string): Promise<string> => {
  const salt = await bcrypt.genSalt();

  const hash = await bcrypt.hash(str, salt);

  return hash;
};
