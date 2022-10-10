import * as path from 'path';

let resourceType: boolean | string;
const imageFormats = ['.jpeg', '.png', '.jpg'];
const audioFormats = ['.mp3', '.mp4', '.mpeg'];
const videoFormats = ['.mp4', '.mov', '.webm', '.wmv', '.mkv', '.flv', '.mpeg'];
const docFormats = ['.doc', '.docx', '.docm', '.pdf', '.txt', '.csv', '.ppt', '.pptx', '.pptm', '.xls', '.xlsm', 'xlsx', '.html'];

const getResourceType = (file: any) => {
  if (imageFormats.includes(path.extname(file.originalname))) {
    resourceType = 'image';
  } else if (audioFormats.includes(path.extname(file.originalname))) {
    resourceType = 'audio';
  } else if (videoFormats.includes(path.extname(file.originalname))) {
    resourceType = 'video';
  } else if (docFormats.includes(path.extname(file.originalname))) {
    resourceType = 'document';
  }
  resourceType = false;

  return resourceType;
};

export default getResourceType;
