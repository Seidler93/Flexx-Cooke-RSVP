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
  const [nameError, setNameError] = useState(false);

  const TRAY_PRICE = 30;
  const KIT_PRICE = 30;

  const total = Number(trays) * TRAY_PRICE + Number(kits) * KIT_PRICE;

  async function handleSubmit() {
    if (!name.trim()) {
      setNameError(true);
      return;
    }

    setNameError(false);
    setLoading(true);

    try {
      await addDoc(collection(db, "cookieRSVPs"), {
        name: name.trim(),
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
      setTrays(0);
      setKits(0);
      setNameError(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setNameError(false);
  }

  return (
    <Dialog open={open} onClose={handleClose} className="modal">
      <div className="modal-container">
        <div className="modal-panel">
          <h2 className="modal-title">Cookie Decorating RSVP 🍪</h2>

          <div className="modal-group">
            <label className={nameError ? "modal-label-error" : ""}>
              Your Name
            </label>

            <input
              className={`modal-input ${nameError ? "modal-input-error" : ""}`}
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError && e.target.value.trim()) setNameError(false);
              }}
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
              min="0"
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
          </div>

          <p className="modal-total">Total: ${total}</p>

          <p className="modal-info-text">Pay at the gym via Zelle, Venmo, or Cash</p>

          <button
            disabled={loading}
            className="modal-submit"
            onClick={handleSubmit}
          >
            {loading ? "Submitting..." : "Submit RSVP"}
          </button>

          <button className="modal-close" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
}
