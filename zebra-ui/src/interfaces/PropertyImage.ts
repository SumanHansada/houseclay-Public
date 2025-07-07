import { FileData } from "./FileData";

export interface PropertyImage {
  id: string;
  file: FileData;
  url: string;
  isCover: boolean;
}
