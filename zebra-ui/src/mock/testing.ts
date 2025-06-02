import { store } from "@/store/store";
import { apiSlice } from "@/store/apiSlice";

// Import the three fake pages:
import {
  fakeUsersPage0,
  fakeUsersPage1,
  fakeUsersPage2,
} from "@/mock/usersDummyData"; // adjust the path if needed

export function seedUsersCache() {
  // 1) Upsert page 0 (when page = 0, size = 12)
  store.dispatch(
    apiSlice.util.upsertQueryData(
      "getUsers", // the endpoint name
      { page: 0, size: 12 }, // the exact args object
      fakeUsersPage0, // the fake UsersResponse for page 0
    ),
  );

  // 2) Upsert page 1 (when page = 1, size = 12)
  store.dispatch(
    apiSlice.util.upsertQueryData(
      "getUsers",
      { page: 1, size: 12 },
      fakeUsersPage1,
    ),
  );

  // 3) Upsert page 2 (when page = 2, size = 12)
  store.dispatch(
    apiSlice.util.upsertQueryData(
      "getUsers",
      { page: 2, size: 12 },
      fakeUsersPage2,
    ),
  );
}
