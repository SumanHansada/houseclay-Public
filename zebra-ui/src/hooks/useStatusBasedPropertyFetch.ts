import { VerifyPropertyStatusEnum } from "@/common/enums";
import {
  useGetPropertiesToReverifyQuery,
  useGetPropertiesToVerifyQuery,
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
    {
      skip: status !== VerifyPropertyStatusEnum.VERIFY,
      refetchOnMountOrArgChange: true,
    },
  );

  const reverify = useGetPropertiesToReverifyQuery(
    { page, size },
    {
      skip: status !== VerifyPropertyStatusEnum.REVERIFY,
      refetchOnMountOrArgChange: true,
    },
  );

  return status === VerifyPropertyStatusEnum.VERIFY ? verify : reverify;
}
