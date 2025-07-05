import { FileData } from "./FileData";

export interface PropertyPhoto {
  id: string;
  file: FileData;
  url: string;
  isCover: boolean;
}

// import { FileData } from "./FileData";

// export interface ExistingPhoto {
//   id: string;
//   url: string;
//   isCover: boolean;
// }

// export interface NewPhoto extends ExistingPhoto {
//   file: File;
//   meta: FileData;
// }

// export type PropertyPhoto = ExistingPhoto | NewPhoto;

// export const isNewPhoto = (p: PropertyPhoto): p is NewPhoto => "file" in p;
