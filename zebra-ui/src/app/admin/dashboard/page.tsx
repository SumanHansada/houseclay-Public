"use client";

import { useRouter } from "next/navigation";
import HouseClaySvg from "public/icons/houseclay.svg";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "@/store/adminSlice";
import { RootState } from "@/store/store";

export default function AdminDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.admin);
  const HouseClay = HouseClaySvg as React.FC<React.SVGProps<SVGSVGElement>>;

  useEffect(() => {
    if (!token) {
      router.push("/admin/login");
    }
  }, [token, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HouseClay />
              <span className="text-red-600 text-lg font-nunito font-bold">
                HouseClay
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 hover:text-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Total Properties
            </h3>
            <p className="mt-2 text-3xl font-bold text-red-600">0</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Pending Verifications
            </h3>
            <p className="mt-2 text-3xl font-bold text-red-600">0</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Total Users
            </h3>
            <p className="mt-2 text-3xl font-bold text-red-600">0</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                No recent activity
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
