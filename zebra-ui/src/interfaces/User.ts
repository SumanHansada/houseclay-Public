export interface TUser {
  name: string;
  email: string;
  avatar?: string;
  phoneNo: string;
  blacklisted: boolean;
}

export interface TUsersResponse {
  content: TUser[];
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
