import { VerifyPropertyStatusEnum } from "@/common/enums";
import {
  useGetPropertiesToReverifyQuery,
  useGetPropertiesToRoutineCheckQuery,
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

  const routineCheck = useGetPropertiesToRoutineCheckQuery(
    { page, size },
    {
      skip: status !== VerifyPropertyStatusEnum.ROUTINE_CHECK,
      refetchOnMountOrArgChange: true,
    },
  );

  if (status === VerifyPropertyStatusEnum.VERIFY) return verify;
  if (status === VerifyPropertyStatusEnum.REVERIFY) return reverify;
  return routineCheck;
}
