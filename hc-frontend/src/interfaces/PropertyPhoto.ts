import { FileData } from "./FileData";

export interface PropertyPhoto {
  id: string;
  file: FileData;
  url: string;
  isCover: boolean;
  S3Url: string;
}
