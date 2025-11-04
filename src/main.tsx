import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// // TEMPORARY: Expose functions for testing (remove before production!)
// import { createRSVP, getUserByReferralCode, getLeaderboard, getTotalUsers } from "./lib/supabase";

// if (import.meta.env.DEV) {
//     (window as any).testAPI = {
//         createRSVP,
//         getUserByReferralCode,
//         getLeaderboard,
//         getTotalUsers,
//     };
//     console.log('🧪 Test API exposed: window.testAPI');
// }

// createRoot(document.getElementById("root")!).render(<App />);
