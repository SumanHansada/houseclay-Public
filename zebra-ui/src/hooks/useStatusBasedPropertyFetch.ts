import { VerifyPropertyStatusEnum } from "@/common/enum";
import {
  useGetPropertiesToVerifyQuery,
  useGetPropertiesToReverifyQuery,
} from "@/store/apiSlice";

interface StatusFetchParams {
  status: VerifyPropertyStatusEnum;
  page: number;
  size: number;
}

export function useStatusBasedPropertyFetch({
  status,
  page,
  size,
}: StatusFetchParams) {
  const verify = useGetPropertiesToVerifyQuery(
    { page, size },
    { skip: status !== VerifyPropertyStatusEnum.VERIFY },
  );

  const reverify = useGetPropertiesToReverifyQuery(
    { page, size },
    { skip: status !== VerifyPropertyStatusEnum.REVERIFY },
  );

  return status === VerifyPropertyStatusEnum.VERIFY ? verify : reverify;
}
