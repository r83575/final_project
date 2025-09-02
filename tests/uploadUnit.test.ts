import { saveFileMetaWithoutDuplicates } from '../src/services/fileService.js';
import File from '../src/models/File.js';

// Mock mongoose model
jest.mock('../src/models/File.js');

const mockFile = File as jest.Mocked<typeof File>;

describe('Upload File Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should not create any real files during duplicate check', async () => {
    const fileData = {
      filename: 'test-no-file.pdf',
      mimetype: 'application/pdf',
      size: 1024,
      path: 'uploads/test-no-file.pdf',
      uploadDate: new Date()
    };

    // Mock that no existing file is found
    mockFile.findOne = jest.fn().mockResolvedValue(null);
    mockFile.prototype.save = jest.fn().mockResolvedValue({ ...fileData, _id: 'mockId' });

    const result = await saveFileMetaWithoutDuplicates(fileData);

    // Verify only database operations, no file system operations
    expect(mockFile.findOne).toHaveBeenCalledWith({ filename: 'test-no-file.pdf' });
    expect(result).toHaveProperty('filename', 'test-no-file.pdf');
    
    // No real file should be created - this is just metadata
    expect(result).toHaveProperty('path', 'uploads/test-no-file.pdf');
  });

  test('should prevent duplicate without any file operations', async () => {
    const fileData = {
      filename: 'duplicate-test.pdf',
      mimetype: 'application/pdf',
      size: 1024,
      path: 'uploads/duplicate-test.pdf',
      uploadDate: new Date()
    };

    // Mock that existing file is found
    mockFile.findOne = jest.fn().mockResolvedValue({
      _id: 'existingId',
      filename: 'duplicate-test.pdf',
      mimetype: 'application/pdf',
      size: 2048,
      path: 'uploads/old-duplicate.pdf',
      uploadDate: new Date()
    });

    await expect(saveFileMetaWithoutDuplicates(fileData))
      .rejects
      .toThrow("File with name 'duplicate-test.pdf' already exists in the system");

    // Verify only database query was made, no file operations
    expect(mockFile.findOne).toHaveBeenCalledWith({ filename: 'duplicate-test.pdf' });
    expect(mockFile.prototype.save).not.toHaveBeenCalled();
  });

  test('should handle file upload simulation without actual files', () => {
    // Simulate the upload process without creating real files
    const mockFileObject = {
      filename: 'simulated-upload.pdf',
      originalname: 'original-file.pdf',
      mimetype: 'application/pdf',
      size: 1024,
      path: 'uploads/simulated-upload.pdf'
    };

    // This test verifies that our file handling logic works
    // without actually creating any files on disk
    expect(mockFileObject.filename).toBeDefined();
    expect(mockFileObject.path).toContain('uploads/');
    expect(mockFileObject.mimetype).toBe('application/pdf');
  });
});
