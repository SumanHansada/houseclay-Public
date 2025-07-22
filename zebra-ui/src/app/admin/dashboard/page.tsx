"use client";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-200">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Total Properties
            </h3>
            <p className="mt-2 text-3xl font-bold text-red-600">0</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Pending Verifications
            </h3>
            <p className="mt-2 text-3xl font-bold text-red-600">0</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
            <p className="mt-2 text-3xl font-bold text-red-600">0</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <p className="text-gray-500 text-center">No recent activity</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
