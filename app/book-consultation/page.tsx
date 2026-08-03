import type {Metadata} from "next";
import BookingForm from "./BookingForm";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata:Metadata={title:"Book a Consultation | Attri Associates",description:"Request an online, phone, office or site consultation for Vastu, architecture, structural design and interiors."};

export default function BookingPage(){
  return <main className="booking-page">
    <SiteHeader />
    <section className="booking-hero"><p className="eyebrow"><span/> Consultation desk</p><h1>Begin with a<br/><em>clear conversation.</em></h1><p>Tell us what you are planning. We’ll help identify the right expertise, consultation format and next step.</p><div><span>01 Choose a service</span><span>02 Select a schedule</span><span>03 Receive confirmation</span></div></section>
    <section className="booking-content"><aside><p>WHY CONSULT WITH US</p><h2>One conversation.<br/>A connected team.</h2><ul><li>Architecture and Vastu under one roof</li><li>Residential, commercial and industrial expertise</li><li>Online consultation across India</li><li>Clear deliverables and implementation guidance</li></ul><div><small>Need urgent assistance?</small><a href="mailto:attriassociates99@gmail.com">attriassociates99@gmail.com</a></div></aside><BookingForm/></section>
    <SiteFooter />
  </main>
}
