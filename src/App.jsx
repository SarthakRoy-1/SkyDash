import React, { useEffect, useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "./firebase";
import Dashboard from "./components/Dashboard";
import CityDetails from "./components/CityDetails";

export default function App() {
  const [selected, setSelected] = useState(null);
  const [unit, setUnit] = useState("C");
  const [user, setUser] = useState(null);

  const [time, setTime] = useState(getFormattedTime());
  useEffect(() => {
    const t = setInterval(() => setTime(getFormattedTime()), 60 * 1000);
    return () => clearInterval(t);
  }, []);

  async function handleLogin() {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleLogout() {
    await signOut(auth);
    setUser(null);
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="title">🌦️ SkyDash</div>
          <div className="tagline">Smart Weather Forecasts · Real-time</div>
        </div>

        <div className="header-right">
          <span className="clock">{time}</span>

          {user ? (
            <div className="user-info">
              <img
                src={user.photoURL}
                alt="profile"
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
              />
              <span>{user.displayName}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button onClick={handleLogin}>Sign in with Google</button>
          )}
        </div>
      </header>

      <main className="main">
        <Dashboard onSelect={(c) => setSelected(c)} unit={unit} user={user} />
      </main>

      {selected && (
        <CityDetails city={selected} onClose={() => setSelected(null)} unit={unit} />
      )}
    </div>
  );
}

function getFormattedTime() {
  const d = new Date();
  const day = d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${day} • ${time}`;
}
