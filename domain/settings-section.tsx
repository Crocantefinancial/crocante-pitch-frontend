"use client";

import { USERS_DATA } from "@/shared/mockups/users";
import { useEffect, useState } from "react";

const SETTINGS_TABS = [
  "Counterparties",
  "Users",
  "Whitelist",
  "FX Accounts",
  "Coverage",
  "Billing",
  "API",
];

interface SettingsSectionProps {
  setCustomAdditionalHeader: (header: React.ReactNode) => void;
}

export function SettingsSection({
  setCustomAdditionalHeader,
}: SettingsSectionProps) {
  useEffect(() => {
    setCustomAdditionalHeader(
      <button className="px-6 py-2 bg-primary text-primary-foreground rounded font-normal hover:bg-primary/90 transition-colors flex items-center gap-2">
        + Invite User
      </button>
    );
  }, [setCustomAdditionalHeader]);
  const [activeTab, setActiveTab] = useState("Users");
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-emerald-600 bg-emerald-50";
      case "Registered":
        return "text-blue-600 bg-blue-50";
      case "Invited":
        return "text-neutral-600 bg-neutral-100";
      case "Disabled":
        return "text-red-600 bg-red-50";
      default:
        return "text-neutral-600";
    }
  };

  return (
    <>
      {/* Settings Tabs */}
      <div className="bg-white px-8 sticky top-0 z-10">
        <div className="flex gap-8">
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-normal border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Settings Content */}
      <div className="p-8">
        {activeTab === "Users" && (
          <div className="space-y-6">
            <p className="text-neutral-600 font-normal">
              All your users are shown below.
            </p>

            <div className="bg-white rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-normal text-neutral-600">
                        Full Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-normal text-neutral-600">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-normal text-neutral-600">
                        Phone Number
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-normal text-neutral-600">
                        User Role
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-normal text-neutral-600">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-normal text-neutral-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {USERS_DATA.map((user, index) => (
                      <tr
                        key={user.id}
                        className="hover:bg-neutral-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-normal text-neutral-900">
                          {user.fullName}
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600">
                          {user.phoneNumber}
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-900 font-normal">
                          {user.userRole}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-normal ${getStatusColor(
                              user.status
                            )}`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button className="text-primary hover:text-primary/90 font-normal">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-end gap-2">
              {[1, 2, 3, "...", 7].map((page) => (
                <button
                  key={page}
                  className={`px-3 py-2 text-sm font-normal rounded transition-colors ${
                    page === 1
                      ? "bg-neutral-300 text-neutral-900"
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab !== "Users" && (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-neutral-500 text-lg font-normal">
              Coming soon: {activeTab} section
            </p>
            <p className="text-neutral-400 text-sm mt-2">
              This feature will be available soon
            </p>
          </div>
        )}
      </div>
    </>
  );
}
