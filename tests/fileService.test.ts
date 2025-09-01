import { saveFileMeta, getFileMeta, deleteFileMeta } from '../src/services/fileService.js';
import File from '../src/models/File.js';

// Mock mongoose model
jest.mock('../src/models/File.js');

const mockFile = File as jest.Mocked<typeof File>;

describe('File Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveFileMeta', () => {
    test('should save file metadata successfully', async () => {
      const fileMeta = {
        filename: 'test.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        path: 'uploads/test.pdf',
        uploadDate: new Date()
      };

      const savedFile = { ...fileMeta, _id: 'mockId' };
      mockFile.prototype.save = jest.fn().mockResolvedValue(savedFile);
      
      const result = await saveFileMeta(fileMeta);

      expect(mockFile).toHaveBeenCalledWith(fileMeta);
      expect(result).toEqual(savedFile);
    });

    test('should throw error when save fails', async () => {
      const fileMeta = {
        filename: 'test.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        path: 'uploads/test.pdf',
        uploadDate: new Date()
      };

      const error = new Error('Database error');
      mockFile.prototype.save = jest.fn().mockRejectedValue(error);

      await expect(saveFileMeta(fileMeta)).rejects.toThrow('Database error');
    });
  });

  describe('getFileMeta', () => {
    test('should get file metadata by ID', async () => {
      const mockFileData = {
        _id: 'mockId',
        filename: 'test.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        path: 'uploads/test.pdf',
        uploadDate: new Date()
      };

      mockFile.findById = jest.fn().mockResolvedValue(mockFileData);

      const result = await getFileMeta('mockId');

      expect(mockFile.findById).toHaveBeenCalledWith('mockId');
      expect(result).toEqual(mockFileData);
    });

    test('should return null when file not found', async () => {
      mockFile.findById = jest.fn().mockResolvedValue(null);

      const result = await getFileMeta('nonexistentId');

      expect(result).toBeNull();
    });
  });

  describe('deleteFileMeta', () => {
    test('should delete file metadata by ID', async () => {
      const mockDeletedFile = {
        _id: 'mockId',
        filename: 'test.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        path: 'uploads/test.pdf',
        uploadDate: new Date()
      };

      mockFile.findByIdAndDelete = jest.fn().mockResolvedValue(mockDeletedFile);

      const result = await deleteFileMeta('mockId');

      expect(mockFile.findByIdAndDelete).toHaveBeenCalledWith('mockId');
      expect(result).toEqual(mockDeletedFile);
    });

    test('should return null when file to delete not found', async () => {
      mockFile.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      const result = await deleteFileMeta('nonexistentId');

      expect(result).toBeNull();
    });
  });
});
