import { PhoneInput } from "react-international-phone";
import Image from "next/image";
import { useDialog } from "@/providers/DialogContextProvider";
import "react-international-phone/style.css";

const Login = () => {
  const { closeDialog } = useDialog();

  return (
    <div className="flex items-center justify-center h-full bg-white rounded-lg">
      {/* Left pane (image) - takes full height */}
      <div className="h-full">
        <Image
          src="/icons/login.svg"
          alt="Login"
          className="relative rounded-l-lg"
        />
      </div>
      {/* Right pane (form) - takes remaining width */}
      <div className="flex flex-1 h-full px-8">
        {/* Close button */}
        <div className="absolute top-4 right-4">
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={() => closeDialog("login-dialog")}
          >
            <Image src="/icons/close.svg" alt="Close" width={30} height={30} />
          </button>
        </div>
        <div className="mx-auto flex flex-col align-center justify-center gap-8">
          {/* Form header */}
          <div>
            <h1 className="text-2xl mb-3 text-black ">
              Log In to Your Account
            </h1>
            <p className="text-gray-600 text-lg">
              Enter phone number to log in
            </p>
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="phone"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <PhoneInput
                defaultCountry="in"
                value={"999 999 9999"}
                onChange={(e) => {
                  console.log(e);
                }}
                className="custom-phone-input w-full border border-gray-300 rounded-lg p-1 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Continue button */}
            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-md"
              onClick={() => console.log("Continue clicked")}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
