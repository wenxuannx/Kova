import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import type { AvatarColor, DotState } from "../components/vault/Shared";
import { useAuth } from "./AuthContext";

export interface GroupMember {
  id: string;
  initials: string;
  color: AvatarColor;
  name: string;
  saved: string;
  dots: DotState[];
  status: "on track" | "behind";
  isCurrentUser: boolean;
}

export interface Group {
  id: string;
  goalName: string;
  inviteCode: string;
  members: GroupMember[];
}

const DEMO_JOINERS: Omit<GroupMember, "id">[] = [
  { initials: "SR", color: "teal",   name: "Sarah R.",  saved: "$580 saved", dots: ["green","green","green","green","red","green","empty"],   status: "on track", isCurrentUser: false },
  { initials: "MT", color: "amber",  name: "Marcus T.", saved: "$310 saved", dots: ["green","red","green","green","red","red","empty"],       status: "behind",   isCurrentUser: false },
  { initials: "AK", color: "purple", name: "Alex K.",   saved: "$120 saved", dots: ["green","green","empty","empty","empty","empty","empty"], status: "on track", isCurrentUser: false },
];

function genCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

interface GroupContextValue {
  groups: Group[];
  createGroup: (goalName: string, userName: string) => { groupId: string; inviteCode: string };
  getGroup: (groupId: string) => Group | undefined;
  joinWithCode: (groupId: string, code: string) => { ok: boolean; error?: string; memberName?: string };
  rotateCode: (groupId: string) => void;
}

const GroupContext = createContext<GroupContextValue | null>(null);

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [usedCodes, setUsedCodes] = useState<Set<string>>(new Set());
  const joinerIndex = useRef(0);

  useEffect(() => {
    setGroups([]);
    setUsedCodes(new Set());
    joinerIndex.current = 0;
  }, [user?.id]);

  function createGroup(goalName: string, userName: string): { groupId: string; inviteCode: string } {
    const initials = userName.trim().split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2) || "ME";
    const groupId = `group-${Date.now()}`;
    const inviteCode = genCode();
    const founder: GroupMember = {
      id: "me",
      initials,
      color: "purple",
      name: "You",
      saved: "$0 saved",
      dots: Array(7).fill("empty") as DotState[],
      status: "on track",
      isCurrentUser: true,
    };
    setGroups((prev) => [...prev, { id: groupId, goalName, inviteCode, members: [founder] }]);
    return { groupId, inviteCode };
  }

  function getGroup(groupId: string): Group | undefined {
    return groups.find((g) => g.id === groupId);
  }

  function joinWithCode(groupId: string, entered: string): { ok: boolean; error?: string; memberName?: string } {
    const code = entered.trim().toUpperCase();
    const group = groups.find((g) => g.id === groupId);
    if (!group) return { ok: false, error: "Group not found." };
    if (!code) return { ok: false, error: "Enter an invite code." };
    if (code === group.inviteCode) return { ok: false, error: "This is your own group's code — you're already a member." };
    if (usedCodes.has(code)) return { ok: false, error: "This code has already been used." };
    if (code.length !== 6) return { ok: false, error: "Invalid code — check it and try again." };

    const joiner = DEMO_JOINERS[joinerIndex.current % DEMO_JOINERS.length];
    const alreadyIn = group.members.some((m) => m.initials === joiner.initials);
    if (alreadyIn) return { ok: false, error: "This member has already joined." };

    setUsedCodes((prev) => new Set([...prev, code]));
    joinerIndex.current += 1;
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, members: [...g.members, { ...joiner, id: joiner.initials }], inviteCode: genCode() }
          : g
      )
    );
    return { ok: true, memberName: joiner.name };
  }

  function rotateCode(groupId: string) {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, inviteCode: genCode() } : g))
    );
  }

  return (
    <GroupContext.Provider value={{ groups, createGroup, getGroup, joinWithCode, rotateCode }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroup() {
  const ctx = useContext(GroupContext);
  if (!ctx) throw new Error("useGroup must be used inside GroupProvider");
  return ctx;
}
