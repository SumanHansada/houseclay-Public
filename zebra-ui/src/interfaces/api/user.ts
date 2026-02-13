import { UserDetails, UserInfo } from "@/interfaces/User";

// useGetUsersQuery() - Response Type
export interface GetAllUsersResponse {
  content: UserInfo[];
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

// useGetUserByPhoneNoQuery()
export interface GetUserByPhoneNoResponse {
  user: UserDetails;
}
