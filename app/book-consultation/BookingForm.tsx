"use client";

import {FormEvent,useState} from "react";

export default function BookingForm(){
  const [result,setResult]=useState<{reference?:string;error?:string}|null>(null);
  const [busy,setBusy]=useState(false);
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setBusy(true);setResult(null);
    const form=event.currentTarget;const body=Object.fromEntries(new FormData(form));
    const response=await fetch("/api/appointments",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
    const data=await response.json();setBusy(false);
    if(response.ok){setResult({reference:data.reference});form.reset()}else setResult({error:data.error});
  }
  if(result?.reference)return <div className="booking-success"><span>✓</span><p>REQUEST RECEIVED</p><h2>Your consultation request is registered.</h2><strong>{result.reference}</strong><p>Our team will contact you to confirm the final time and consultation details.</p><button onClick={()=>setResult(null)}>Book another consultation</button></div>;
  return <form className="booking-form" onSubmit={submit}>
    <div className="form-section"><span>01</span><div><h3>Choose your consultation</h3><p>Select the service and how you would like to meet.</p></div></div>
    <div className="booking-grid"><label>Service *<select name="service" required><option value="">Select service</option><option>Residential Vastu</option><option>Commercial Vastu</option><option>Industrial / Factory Vastu</option><option>Architecture Planning</option><option>Structural Design</option><option>Interior Design</option><option>Project Review</option></select></label><label>Consultation mode *<select name="consultationMode" required><option value="">Select mode</option><option>Video Consultation</option><option>Phone Consultation</option><option>Office Meeting</option><option>Site Visit</option></select></label><label>Project type<select name="projectType"><option>New Construction</option><option>Existing Property</option><option>Renovation</option><option>Drawing Review</option><option>Not sure yet</option></select></label></div>
    <div className="form-section"><span>02</span><div><h3>Preferred schedule</h3><p>Choose a preferred date and time. Final availability will be confirmed by our team.</p></div></div>
    <div className="booking-grid two"><label>Preferred date *<input type="date" name="preferredDate" required min={new Date().toISOString().slice(0,10)}/></label><label>Preferred time *<select name="preferredTime" required><option value="">Select time</option><option>10:00 AM – 11:00 AM</option><option>11:30 AM – 12:30 PM</option><option>2:00 PM – 3:00 PM</option><option>3:30 PM – 4:30 PM</option><option>5:00 PM – 6:00 PM</option></select></label></div>
    <div className="form-section"><span>03</span><div><h3>Your information</h3><p>We will use these details only to coordinate your consultation.</p></div></div>
    <div className="booking-grid"><label>Full name *<input name="name" required/></label><label>Phone number *<input name="phone" required inputMode="tel"/></label><label>Email address *<input name="email" required type="email"/></label></div>
    <label className="message-field">Tell us about your requirement<textarea name="message" rows={5} placeholder="Property type, location, approximate area and the guidance you need"/></label>
    {result?.error&&<p className="booking-error">{result.error}</p>}
    <button className="booking-submit" disabled={busy}>{busy?"Submitting…":"Request consultation"} <span>↗</span></button>
    <small className="privacy-copy">By submitting, you agree to be contacted regarding this consultation request. No payment is collected at this stage.</small>
  </form>
}
