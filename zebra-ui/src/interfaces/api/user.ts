import { User, UserDetails } from "@/interfaces/User";

// useGetUsersQuery()
export interface GetAllUsersResponse {
  content: User[];
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
