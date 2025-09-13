import { SvgIcon } from "@/utility-components";

export function EmailVerifyIncentive({ onVerify }: { onVerify: () => void }) {
  return (
    <div className="mt-2 p-3 bg-red-50 rounded-lg flex flex-col justify-between w-full gap-4">
      <div className="flex gap-2 items-center w-full">
        <SvgIcon iconSize="medium" name="coin-egg" />
        <span className="px-1 w-4/5">
          Verify your email address and earn <b>1 Connect</b> instantly!
        </span>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className="font-medium border border-red-500 rounded-xl px-4 py-2 text-red-500 hover:bg-red-500 hover:text-white text-nowrap "
          onClick={onVerify}
        >
          Verify Email Address
        </button>
      </div>
    </div>
  );
}
