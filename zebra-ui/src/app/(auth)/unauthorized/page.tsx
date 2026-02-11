export default function UnauthorizedPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-4 text-3xl font-bold text-red-600">Unauthorized</h1>
        <p className="text-gray-700">
          You do not have permission to access this page. Please contact your
          administrator if you believe this is an error.
        </p>
      </div>
    </div>
  );
}
