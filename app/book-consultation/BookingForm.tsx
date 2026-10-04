"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const fallbackTimes = ["10:00 AM – 11:00 AM", "11:30 AM – 12:30 PM", "2:00 PM – 3:00 PM", "3:30 PM – 4:30 PM", "5:00 PM – 6:00 PM"];
const fallbackConsultants = ["Any available consultant", "Senior Vastu Consultant", "Architecture Consultant", "Interior & Design Consultant"];
const defaultServices = ["Residential Vastu", "Commercial Vastu", "Industrial / Factory Vastu", "Architecture Planning", "Structural Design", "Interior Design", "Project Review"];

export default function BookingForm() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<{ reference?: string; error?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [service, setService] = useState("");
  const [serviceOptions, setServiceOptions] = useState(defaultServices);
  const [date, setDate] = useState("");
  const [consultant, setConsultant] = useState(fallbackConsultants[0]);
  const [times, setTimes] = useState(fallbackTimes);
  const [consultants, setConsultants] = useState(fallbackConsultants);
  const [available, setAvailable] = useState(fallbackTimes);

  useEffect(() => {
    const requested = searchParams.get("service")?.trim();
    if (requested) setService(requested);
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/services", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const managed = Array.isArray(data?.services)
          ? data.services.map((item: { name?: string }) => item.name?.trim()).filter((name: string | undefined): name is string => Boolean(name))
          : [];
        if (managed.length) setServiceOptions(Array.from(new Set([...defaultServices, ...managed])));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const requested = searchParams.get("service")?.trim();
    if (requested) setServiceOptions((options) => Array.from(new Set([...options, requested])));
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/appointments/config", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.slots?.length) {
          setTimes(data.slots);
          setAvailable(data.slots);
        }
        if (data?.consultants?.length) {
          setConsultants(data.consultants);
          setConsultant(data.consultants[0]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!date) {
      setAvailable(times);
      return;
    }
    fetch(`/api/appointments/availability?date=${encodeURIComponent(date)}&consultant=${encodeURIComponent(consultant)}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setAvailable((data.slots || []).filter((slot: { available: boolean }) => slot.available).map((slot: { time: string }) => slot.time)))
      .catch(() => setAvailable(times));
  }, [date, consultant, times]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setResult(null);
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...values, service }),
    });
    const data = await response.json();
    setBusy(false);
    if (response.ok) {
      setResult({ reference: data.reference });
      form.reset();
      setService("");
      setDate("");
      setConsultant(consultants[0]);
    } else setResult({ error: data.error || "Unable to submit your consultation request." });
  }

  if (result?.reference) return <div className="booking-success"><span>✓</span><p>REQUEST RECEIVED</p><h2>Your consultation request is registered.</h2><strong>{result.reference}</strong><p>Our team will contact you to confirm the final time and consultation details.</p><button onClick={() => setResult(null)}>Book another consultation</button></div>;

  return <form className="booking-form" onSubmit={submit}>
    <div className="form-section"><span>01</span><div><h3>Choose your consultation</h3><p>Select the service and how you would like to meet.</p></div></div>
    <div className="booking-grid">
      <label>Service *<select name="service" required value={service} onChange={(event) => setService(event.target.value)}><option value="">Select service</option>{serviceOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>Consultation mode *<select name="consultationMode" required><option value="">Select mode</option><option>Video Consultation</option><option>Phone Consultation</option><option>Chat Consultation</option><option>Office Meeting</option><option>Site Visit</option></select></label>
      <label>Consultant preference<select name="consultantPreference" value={consultant} onChange={(event) => setConsultant(event.target.value)}>{consultants.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>Project type<select name="projectType"><option>New Construction</option><option>Existing Property</option><option>Renovation</option><option>Drawing Review</option></select></label>
      <label>Booking type<select name="bookingType"><option value="scheduled">Schedule for later</option><option value="now">Request now</option></select></label>
    </div>
    <div className="form-section"><span>02</span><div><h3>Preferred schedule</h3><p>Only available slots are shown for the selected date and consultant.</p></div></div>
    <div className="booking-grid two"><label>Preferred date *<input type="date" name="preferredDate" required min={new Date().toISOString().slice(0, 10)} value={date} onChange={(event) => setDate(event.target.value)} /></label><label>Preferred time *<select name="preferredTime" required><option value="">{date && !available.length ? "No slots available" : "Select time"}</option>{available.map((slot) => <option key={slot}>{slot}</option>)}</select></label></div>
    <div className="form-section"><span>03</span><div><h3>Your information</h3><p>We will use these details only to coordinate your consultation.</p></div></div>
    <div className="booking-grid"><label>Full name *<input name="name" required /></label><label>Phone number *<input name="phone" required inputMode="tel" /></label><label>Email address *<input name="email" required type="email" /></label></div>
    <label className="message-field">Tell us about your requirement<textarea name="message" rows={5} placeholder="Property type, location, approximate area and the guidance you need" /></label>
    {result?.error && <p className="booking-error">{result.error}</p>}
    <button className="booking-submit" disabled={busy || !available.length || !service}>{busy ? "Submitting…" : "Request consultation"} <span>↗</span></button>
    <small className="privacy-copy">By submitting, you agree to be contacted regarding this consultation. No payment is collected at this stage.</small>
  </form>;
}
