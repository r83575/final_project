# File Upload Service

A TypeScript-based file upload service using Express.js, MongoDB, and Multer for handling file uploads with metadata storage.

## Features

- File upload with size and type validation
- MongoDB metadata storage with Mongoose
- Comprehensive Jest test suite (93%+ coverage)
- TypeScript with ES Modules support
- Express.js REST API
- File filtering (images, PDFs, Word docs)
- Error handling and validation

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Web Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **File Handling**: Multer
- **Testing**: Jest with ts-jest
- **Build Tool**: TypeScript Compiler

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd final_project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Make sure MongoDB is running locally or update MONGODB_URI in .env

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Testing
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## API Endpoints

### POST /api/upload
Upload a file and save its metadata to MongoDB.

**Request**: Multipart form data with 'file' field
**Response**: JSON with file metadata

**Supported file types**:
- Images: JPEG, PNG, GIF
- Documents: PDF, Word (.doc, .docx)

**File size limit**: 5MB

**Example**:
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@example.pdf"
```

### GET /health
Health check endpoint.

**Response**: Server status and timestamp

## Project Structure

```
src/
├── app.ts              # Main application entry point
├── models/
│   └── File.ts         # MongoDB file schema
├── services/
│   └── fileService.ts  # Database operations
├── middleware/
│   └── upload.ts       # Multer configuration
└── routes/
    └── upload.ts       # API routes

tests/
├── upload.test.ts      # API endpoint tests
└── fileService.test.ts # Service layer tests
```

## Database Schema

### File Model
```typescript
{
  filename: string;      // Original filename
  mimetype: string;      // MIME type
  size: number;          // File size in bytes
  path: string;          // Storage path
  uploadDate: Date;      // Upload timestamp
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/fileupload` |
| `NODE_ENV` | Environment mode | `development` |

## Testing

The project includes comprehensive test coverage:

- **API Tests**: File upload scenarios, error handling
- **Service Tests**: Database operations with mocking
- **Edge Cases**: Large files, unsupported types, missing files

Run `npm run test:coverage` to see detailed coverage report.

## Contributing

This project is managed by Sary and Ruti for educational purposes.

## License

See LICENSE file for details.
