import express from 'express';
import { upload } from '../middleware/upload.js';
import { saveFileMetaWithoutDuplicates } from '../services/fileService.js';

const router = express.Router();

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'File type is not allowed or no file uploaded' });
    }
    const meta = await saveFileMetaWithoutDuplicates({
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      uploadDate: new Date()
    });
    res.status(201).json(meta);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: errorMsg });
  }
});

export default router;
