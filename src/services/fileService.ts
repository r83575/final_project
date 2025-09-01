import File, { IFile } from '../models/File.js';

export const saveFileMeta = async (fileData: Partial<IFile>) => {
  const file = new File(fileData);
  return await file.save();
};

export const getFileMeta = async (id: string) => {
  return await File.findById(id);
};

export const deleteFileMeta = async (id: string) => {
  return await File.findByIdAndDelete(id);
};
