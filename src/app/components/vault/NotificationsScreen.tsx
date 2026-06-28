import React, { useState } from "react";
import { Bell, Clock, Users, Target, CheckCircle } from "lucide-react";
import { C, StatusBar, Card, SectionLabel, BottomNav, ScrollArea, type NavigateFn } from "./Shared";

type NotifType = "deadline" | "nudge" | "challenge" | "completed";

interface Notif {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFS: Notif[] = [
  {
    id: "n1",
    type: "nudge",
    title: "Sarah R. nudged you",
    body: "Don't forget to complete this week's challenge! You've got this 💪",
    time: "2 min ago",
    read: false,
  },
  {
    id: "n2",
    type: "deadline",
    title: "Goal deadline approaching",
    body: "Your Emergency fund goal is due in 7 days. You're 58% of the way there.",
    time: "1 hr ago",
    read: false,
  },
  {
    id: "n3",
    type: "nudge",
    title: "Marcus T. nudged you",
    body: "We're counting on you — complete your challenge to keep the group streak!",
    time: "3 hrs ago",
    read: false,
  },
  {
    id: "n4",
    type: "challenge",
    title: "New challenge ready",
    body: "Your AI challenge for this week has been generated. Check it out!",
    time: "Yesterday",
    read: true,
  },
  {
    id: "n5",
    type: "deadline",
    title: "Holiday savings reminder",
    body: "Your Holiday savings goal deadline is in 49 days. Stay on track!",
    time: "2 days ago",
    read: true,
  },
  {
    id: "n6",
    type: "completed",
    title: "Sarah R. completed her challenge",
    body: "Sarah completed this week's challenge. Keep up with the group!",
    time: "3 days ago",
    read: true,
  },
];

const TYPE_CONFIG: Record<NotifType, { Icon: React.ElementType; bg: string; color: string }> = {
  deadline: { Icon: Clock, bg: "rgba(245,158,11,0.10)", color: "#F59E0B" },
  nudge: { Icon: Users, bg: "rgba(123,97,255,0.10)", color: C.primary },
  challenge: { Icon: Target, bg: "rgba(34,197,94,0.10)", color: C.success },
  completed: { Icon: CheckCircle, bg: "rgba(34,197,94,0.10)", color: C.success },
};

export function NotificationsScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL_NOTIFS);

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const unreadCount = notifs.filter((n) => !n.read).length;
  const unread = notifs.filter((n) => !n.read);
  const read = notifs.filter((n) => n.read);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative", overflow: "hidden" }}>
      <StatusBar />
      <ScrollArea style={{ padding: "0 20px 110px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <p style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: 0 }}>Notifications</p>
            {unreadCount > 0 && (
              <span style={{
                background: C.danger,
                color: "white",
                fontSize: 11,
                fontWeight: 700,
                borderRadius: 50,
                padding: "2px 7px",
                lineHeight: 1.6,
              }}>
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.primary, fontFamily: "inherit", padding: 0 }}
            >
              Mark all read
            </button>
          )}
        </div>

        {notifs.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 60, gap: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(123,97,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bell size={24} color={C.muted} strokeWidth={1.6} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: 0 }}>All caught up</p>
            <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>No notifications yet</p>
          </div>
        )}

        {unread.length > 0 && (
          <>
            <SectionLabel>New</SectionLabel>
            <Card style={{ marginBottom: 20, padding: 0, overflow: "hidden" }}>
              {unread.map((n, i) => {
                const cfg = TYPE_CONFIG[n.type];
                return (
                  <div key={n.id}>
                    <button
                      onClick={() => markRead(n.id)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: "14px 16px",
                        background: "rgba(123,97,255,0.04)",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        textAlign: "left",
                      }}
                    >
                      <div style={{ width: 38, height: 38, borderRadius: 12, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <cfg.Icon size={18} color={cfg.color} strokeWidth={1.8} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>{n.title}</p>
                          <p style={{ fontSize: 11, color: C.muted, margin: 0, flexShrink: 0, marginLeft: 8 }}>{n.time}</p>
                        </div>
                        <p style={{ fontSize: 13, color: C.textSecondary, margin: 0, lineHeight: 1.5 }}>{n.body}</p>
                      </div>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.primary, flexShrink: 0, marginTop: 6 }} />
                    </button>
                    {i < unread.length - 1 && <div style={{ height: 1, background: "rgba(123,97,255,0.06)", margin: "0 16px" }} />}
                  </div>
                );
              })}
            </Card>
          </>
        )}

        {read.length > 0 && (
          <>
            <SectionLabel>Earlier</SectionLabel>
            <Card style={{ marginBottom: 20, padding: 0, overflow: "hidden" }}>
              {read.map((n, i) => {
                const cfg = TYPE_CONFIG[n.type];
                return (
                  <div key={n.id}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px" }}>
                      <div style={{ width: 38, height: 38, borderRadius: 12, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: 0.6, marginTop: 1 }}>
                        <cfg.Icon size={18} color={cfg.color} strokeWidth={1.8} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
                          <p style={{ fontSize: 14, fontWeight: 500, color: C.textSecondary, margin: 0 }}>{n.title}</p>
                          <p style={{ fontSize: 11, color: C.muted, margin: 0, flexShrink: 0, marginLeft: 8 }}>{n.time}</p>
                        </div>
                        <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.5 }}>{n.body}</p>
                      </div>
                    </div>
                    {i < read.length - 1 && <div style={{ height: 1, background: "rgba(123,97,255,0.06)", margin: "0 16px" }} />}
                  </div>
                );
              })}
            </Card>
          </>
        )}
      </ScrollArea>

      <div style={{ position: "absolute", bottom: 20, left: 16, right: 16, zIndex: 10 }}>
        <BottomNav active="notifications" onNavigate={onNavigate} />
      </div>
    </div>
  );
}
