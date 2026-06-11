import Link from "next/link";
import React from "react";

export default function page() {
  const user = false;
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white mt-5">
        Team Access Control Demo
      </h1>

      <p className="text-slate-300 mb-8">
        This Demo show case nextjs Lorem ipsum dolor, sit amet consectetur
        adipisicing elit. Cupiditate consectetur unde dolore a quo numquam
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8 ">
        <div className="bg-slate-700 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 ">Features Demonstrated</h3>
          <ul className="list-disc list-inside text-sm text-slate-300">
            <li>Role Based Access Control</li>
            <li>Role Based Access Control</li>
            <li>Role Based Access Control</li>
            <li>Role Based Access Control</li>
          </ul>
        </div>

        <div className="bg-slate-700 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">User Roles</h3>
          <ul className="list-disc list-inside text-sm text-slate-300">
            <li>
              <strong className="uppercase text-purple-400">Super Admin</strong>{" "}
              : Full System Access
            </li>
            <li>
              <strong className="uppercase text-green-400">Admin</strong> :User
              and Team management
            </li>
            <li>
              <strong className="uppercase text-yellow-400">Manager</strong>{" "}
              :Team specific management
            </li>
            <li>
              <strong className="uppercase text-blue-400">User</strong> :Basic
              Dashboard
            </li>
          </ul>
        </div>
      </div>

      {user ? (
        <div className="bg-green-800 border-2 border-green-600 p-3 rounded-xl">
          <p>
            Welcome Back Dipesh, You are logged in as <span>USER</span>
          </p>
        </div>
      ) : (
        <div className="bg-blue-950 border-2 border-blue-600 p-4 rounded-xl">
          <p className="text-slate-300 mb-2">You are not logged in</p>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="bg-blue-600 text-white px-3 py-1 rounded-sm"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-white border-slate-400 border-2 px-3 py-1 rounded-sm"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
