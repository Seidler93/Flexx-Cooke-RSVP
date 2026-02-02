import React, { useState, useEffect } from "react";
import RSVPModal from "./RSVPModal";
import "./app.css"; // <-- import your new CSS
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function App() {
  const [open, setOpen] = useState(false);
  const [attendingCount, setAttendingCount] = useState(0);

  // Listen to RSVP count in real time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "cookieRSVPs"), (snapshot) => {
      let total = 0;
      snapshot.forEach((doc) => {
        total += doc.data().people ?? 0;
      });
      setAttendingCount(total);
    });

    return () => unsub();
  }, []);

  return (
  <div className="page">
    <div className="container card">
      <h1 className="title">
        Flexx Valentines Day Cookie Decorating 🍪💖
      </h1>

      <p className="event-date">Saturday, February 7th • 1:15 PM</p>
      <p className="event-date">At the gym!</p>
      
      <div className="cookie-preview">
        <img
          src="/wendyvalentine.jpeg"
          alt="Valentine Cookies"
        />
      </div>

      <p className="description">
        Join us for some Valentine's Day DIY cookie decorating! Six cookies, 4 icing colors, 2 sets of sprinkles.
        Perfect for families and friends!
      </p>

      <div className="counter">
        <strong>{attendingCount}</strong> people are coming!
      </div>

      <button className="rsvp-btn" onClick={() => setOpen(true)}>
        RSVP Now
      </button>

      <RSVPModal open={open} setOpen={setOpen} />
    </div>
  </div>
);

}
