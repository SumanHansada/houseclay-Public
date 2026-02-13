import { AdminInfo } from "../Admin";

// useGetAdminsQuery() - Response Type
export interface GetAllAdminsResponse {
  content: AdminInfo[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
}
