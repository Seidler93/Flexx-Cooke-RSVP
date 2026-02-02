import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import "./RSVPModal.css";

export default function RSVPModal({ open, setOpen }) {
  const [name, setName] = useState("");
  const [people, setPeople] = useState(1);
  const [trays, setTrays] = useState(0);
  const [kits, setKits] = useState(0);
  const [loading, setLoading] = useState(false);

  const TRAY_PRICE = 30;
  const KIT_PRICE = 30;

  const total =
    Number(trays) * TRAY_PRICE +
    Number(kits) * KIT_PRICE;

  async function handleSubmit() {
    if (!name) return;

    setLoading(true);

    try {
      await addDoc(collection(db, "cookieRSVPs"), {
        name,
        people: Number(people),
        trays: Number(trays),
        kits: Number(kits),
        totalCost: total,
        createdAt: Timestamp.now(),
      });

      setLoading(false);
      setOpen(false);
      setName("");
      setPeople(1);
      setTrays(1);
      setKits(0);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="modal">
      <div className="modal-backdrop" />

      <div className="modal-container">
        <Dialog.Panel className="modal-panel">
          <h2 className="modal-title">Cookie Decorating RSVP 🍪</h2>

          <div className="modal-group">
            <label>Your Name</label>
            <input
              className="modal-input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="modal-group">
            <label>Number of People Attending (Including Kids!)</label>
            <input
              className="modal-input"
              type="number"
              min="1"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
            />
          </div>

          <div className="modal-group">
            <label>Cookie Trays for the Event ($30 each)</label>
            <input
              className="modal-input"
              type="number"
              min="1"
              value={trays}
              onChange={(e) => setTrays(e.target.value)}
            />
          </div>

          <div className="modal-group">
            <label>Take-Home Cookie Kits ($30 each)</label>
            <input
              className="modal-input"
              type="number"
              min="0"
              value={kits}
              onChange={(e) => setKits(e.target.value)}
            />
            <p className="modal-helper">
              Decorate at home with icing & sprinkles 💕
            </p>
          </div>

          <p className="modal-total">
            Total: ${total}
          </p>

          <p className="modal-info-text">
            Pay at the gym via Zelle, Venmo, or Cash
          </p>

          <button
            disabled={loading || !name}
            className="modal-submit"
            onClick={handleSubmit}
          >
            {loading ? "Submitting..." : "Submit RSVP"}
          </button>

          <button
            className="modal-close"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
