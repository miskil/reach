// app/[site]/admin/members/invite/page.tsx
"use client";

import { inviteMember } from "@/lib/actions";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/lib/auth";

export default function InviteMemberPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = useParams() as { site: string };
  const [email, setEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState("viewer");
  const { user, setUser, modifyMode, setModifyMode, adminMode, setAdminMode } =
    useUser();

  const handleSubmit = async () => {
    if (site)
      if (typeof site === "string") {
        await inviteMember(site, email, user!.email, accessLevel);
      }
    alert("Invite sent!");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-xl font-bold mb-4">Invite Member</h1>
      <input
        type="email"
        placeholder="Member Email"
        className="w-full p-2 border bg-white rounded mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <select
        value={accessLevel}
        onChange={(e) => setAccessLevel(e.target.value)}
        className="w-full p-2 bg-white border rounded mb-4"
      >
        <option value="viewer">Viewer</option>
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </select>
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Send Invite
      </button>
    </div>
  );
}
