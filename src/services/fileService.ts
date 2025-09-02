import File, { IFile } from '../models/File.js';

export const saveFileMeta = async (fileData: Partial<IFile>) => {
  const file = new File(fileData);
  return await file.save();
};

export const saveFileMetaWithoutDuplicates = async (fileData: Partial<IFile>) => {
  // Check if file with same name already exists
  const existingFile = await File.findOne({ filename: fileData.filename });
  
  if (existingFile) {
    throw new Error(`File with name '${fileData.filename}' already exists in the system`);
  }
  
  // If file doesn't exist, save it
  return await saveFileMeta(fileData);
};

export const getFileMeta = async (id: string) => {
  return await File.findById(id);
};

export const deleteFileMeta = async (id: string) => {
  return await File.findByIdAndDelete(id);
};
