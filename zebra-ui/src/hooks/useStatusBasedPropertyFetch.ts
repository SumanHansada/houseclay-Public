import { VerifyPropertyStatusEnum, PropertyState } from "@/common/enums";
import { useGetPropertiesQuery } from "@/store/apiSlice";

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
  let mappedState: string = "";
  if (status === VerifyPropertyStatusEnum.VERIFY) {
    mappedState = PropertyState.PENDING_VERIFICATION;
  } else if (status === VerifyPropertyStatusEnum.REVERIFY) {
    mappedState = PropertyState.PENDING_RE_VERIFICATION;
  } else if (status === VerifyPropertyStatusEnum.ROUTINE_CHECK) {
    mappedState = PropertyState.PENDING_ROUTINE_CHECK;
  }

  return useGetPropertiesQuery(
    { page, size, state: mappedState },
    { refetchOnMountOrArgChange: true },
  );
}
