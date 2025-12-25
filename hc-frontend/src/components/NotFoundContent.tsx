import Link from "next/link";

export default function NotFoundContent() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center max-md:px-5">
      <div className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl sm:tracking-wider font-inter text-center space-y-2 sm:space-y-4">
        <h1 className="font-bold sm:font-extrabold">
          Looks like this key doesn&apos;t fit.
        </h1>
        <h3>Let&apos;s get you back home.</h3>
      </div>

      <Link
        href="/"
        className="px-7 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-lg sm:text-xl text-white tracking-normal hover:cursor-pointer"
      >
        Go to Home
      </Link>
    </div>
  );
}
