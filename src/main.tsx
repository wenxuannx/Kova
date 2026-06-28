import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { AuthProvider } from "./app/context/AuthContext.tsx";
import { QuestProvider } from "./app/context/QuestContext.tsx";
import { GroupProvider } from "./app/context/GroupContext.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <QuestProvider>
      <GroupProvider>
        <App />
      </GroupProvider>
    </QuestProvider>
  </AuthProvider>
);
