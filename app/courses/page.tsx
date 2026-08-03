import type { Metadata } from "next";
import CoursesClient from "./CoursesClient";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = { title: "Vastu & Architecture Courses | Attri Academy", description: "Learn scientific Vastu, floor planning and industrial Vastu through structured recorded and live courses." };

export default function Courses() {
  return <main className="courses-page"><SiteHeader active="/courses"/><section className="academy-hero"><p>ATTRI ACADEMY</p><h1>Learn the principles.<br/><em>Master the practice.</em></h1><span>Structured learning paths for homeowners, students and professionals.</span><div><b>Recorded learning</b><b>Live mentorship</b><b>Practical assignments</b><b>Certification ready</b></div></section><section className="academy-content"><div className="academy-intro"><p>PROGRAMMES</p><h2>Build knowledge<br/>that can be applied.</h2><span>Each programme combines conceptual understanding, case-based learning and practical application.</span></div><CoursesClient/></section><SiteFooter/></main>;
}
