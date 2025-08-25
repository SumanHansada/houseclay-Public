import CoinEggIconSvg from "public/icons/coin-egg.svg";

const CoinEggIcon = CoinEggIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
export function EmailVerifyIncentive({ onVerify }: { onVerify: () => void }) {
  return (
    <div className="mt-2 p-3 bg-red-50 rounded-lg flex flex-col justify-between w-full gap-2">
      <div className="flex gap-2 items-center w-full">
        <CoinEggIcon />
        <span className="px-1 w-4/5">
          Verify your email address and earn <b>1 Connect</b> instantly!
        </span>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className="font-medium text-red-500 hover:text-red-600 underline text-nowrap"
          onClick={onVerify}
        >
          Verify Email Address
        </button>
      </div>
    </div>
  );
}
