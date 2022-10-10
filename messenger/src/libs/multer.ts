import { Request } from 'express';
import multer, { diskStorage, FileFilterCallback } from 'multer';
import path from 'path';

// types declaration
type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

class MulterSetUp {
  constructor() {}
  private fileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/pdf', 'audio/mpeg', 'audio/mp3', 'audio/m4a'];

  private fileStorage = diskStorage({
    destination: (request: Request, file: Express.Multer.File, callback: DestinationCallback): void => {
      let dir: string;
      const audio = ['audio/mpeg', 'audio/mp3', 'audio/m4a'];
      const image = ['image/jpeg', 'image/jpg', 'image/png', 'image/pdf', 'image/gif'];
      if (audio.includes(file.mimetype)) {
        dir = path.resolve(process.cwd(), 'assets', 'audio');
        callback(null, dir);
      } else if (image.includes(file.mimetype)) {
        dir = path.resolve(process.cwd(), 'assets', 'images');
        callback(null, dir);
      } else {
        throw new Error('File not permitted');
      }
      // setting destination
      // will be removed and left blank when production ready
    },
    filename: (request: Request, file: Express.Multer.File, callback: FileNameCallback): void => {
      callback(null, `connect-msg-${Date.now().toString()}-${file.originalname}`);
    },
  });

  private fileFilter = (request: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
    if (this.fileTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  };

  public singleUpload = multer({
    storage: this.fileStorage,
    fileFilter: this.fileFilter,
  }).single('upload');

  public multipleUpload = multer({
    storage: this.fileStorage,
    fileFilter: this.fileFilter,
  }).array('uploads');
}

export default MulterSetUp;
