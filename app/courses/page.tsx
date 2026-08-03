import type { Metadata } from "next";
import CoursesClient from "./CoursesClient";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import PageFaqs from "../components/PageFaqs";
import DynamicBanner from "../components/DynamicBanner";
import { moduleState } from "../module-visibility";

export const metadata: Metadata = { title: "Vastu & Architecture Courses | Attri Academy", description: "Learn scientific Vastu, floor planning and industrial Vastu through structured recorded and live courses." };

export default async function Courses() {
  const visibility=await moduleState("courses");if(!visibility.enabled)return <main className="courses-page"><SiteHeader/><section className="module-disabled"><p>MODULE PAUSED</p><h1>Courses are temporarily unavailable.</h1><span>{visibility.message}</span></section><SiteFooter/></main>;
  return <main className="courses-page"><SiteHeader active="/courses"/><DynamicBanner placement="courses-top"/><section className="academy-hero"><p>ATTRI ACADEMY</p><h1>Learn the principles.<br/><em>Master the practice.</em></h1><span>Structured learning paths for homeowners, students and professionals.</span><div><b>Recorded learning</b><b>Live mentorship</b><b>Practical assignments</b><b>Certification ready</b></div></section><section className="academy-content"><div className="academy-intro"><p>PROGRAMMES</p><h2>Build knowledge<br/>that can be applied.</h2><span>Each programme combines conceptual understanding, case-based learning and practical application.</span></div><CoursesClient/></section><PageFaqs pageSlug="courses"/><SiteFooter/></main>;
}
