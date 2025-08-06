import { getInitials } from "@/common/utils";

const user = {
  name: "Ankit Biswas",
  phone: "+91 999 999 9999",
  whatsapp: true,
  email: "ankitbiswas@gmail.com",
  emailVerified: false,
};

export default function MyProfilePage() {
  return (
    <div className="space-y-6">
      <div className="border-b-2 pb-2">
        <h1 className="text-2xl font-medium">My Profile</h1>
      </div>

      <div className="flex space-x-20">
        {/* Avatar + Upload */}
        <div className="flex flex-col items-center">
          <div className="size-40 bg-black rounded-full flex items-center justify-center text-[60px] text-white">
            {getInitials(user.name)}
          </div>
          <button className="mt-2 underline underline-offset-4">
            Upload Profile Photo
          </button>
        </div>

        {/* Profile Form */}
        <form className="flex-1 space-y-4">
          {/* Name */}

          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              defaultValue={user.name}
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium">Mobile Phone</label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="text"
                defaultValue={user.phone}
                className="flex-1 border rounded px-3 py-2"
              />
              <label className="inline-flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={user.whatsapp}
                  readOnly
                  className="form-checkbox"
                />
                <span className="text-sm">WhatsApp</span>
              </label>
            </div>
            <p className="text-sm text-green-600">Verified</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email Address</label>
            <input
              type="email"
              defaultValue={user.email}
              className="mt-1 block w-full border rounded px-3 py-2"
            />
            {!user.emailVerified && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded flex items-center justify-between">
                <span className="text-red-700 text-sm">
                  Verify your email and earn 1 Connect instantly!
                </span>
                <button
                  type="button"
                  className="text-sm font-medium text-red-600"
                >
                  Verify Email Address
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 text-white rounded"
            >
              Save
            </button>
            <button type="button" className="px-6 py-2 border rounded">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
