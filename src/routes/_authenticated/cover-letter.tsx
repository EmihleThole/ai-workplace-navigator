import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { AiTool } from "@/components/AiTool";

export const Route = createFileRoute("/_authenticated/cover-letter")({
  head: () => ({ meta: [{ title: "Cover Letter Generator — Workplace AI" }] }),
  component: () => (
    <div>
      <PageHeader
        eyebrow="Career"
        title="AI Cover Letter Generator"
        description="Create a tailored, professional cover letter in seconds."
      />
      <AiTool
        tool="cover_letter"
        title="Write Cover Letter"
        description="Paste the role, the company, and your strongest selling points."
        inputLabel="Role, company & your strengths"
        inputPlaceholder={`Role: Senior Product Manager\nCompany: Yoco\nWhy them: Love their mission to help SMEs in South Africa get paid.\nMy strengths: 6 yrs in SaaS PM, led pricing rework (+18% ARR), shipped onboarding redesign (-30% TTV).\nOptional: paste the job description below for tighter tailoring.`}
        cta="Write Letter"
        examples={[
          { label: "Tailored to JD", prompt: "Role: Senior Product Manager\nCompany: Yoco\nWhy them: their mission to help South African SMEs get paid faster resonates with my work in SMB fintech.\nMy strengths: 6 yrs in SaaS PM, led pricing rework (+18% ARR), shipped onboarding redesign (-30% TTV), strong data instincts.\nJob description: [paste JD here]" },
          { label: "Career switcher", prompt: "Role: Junior UX Researcher\nCompany: Discovery\nBackground: 4 years as a primary-school teacher, recently completed a UX research bootcamp, built a portfolio of 3 case studies (school logistics app, township clinic intake flow, learner motivation study).\nWhy them: Discovery's Vitality team blends behavioural science with product — exactly the intersection I want to work in." },
          { label: "Senior leader", prompt: "Role: VP Engineering\nCompany: Stitch\nMy strengths: 12 yrs engineering leadership, scaled team from 8 to 45, shipped payments platform processing R3B/yr, strong on hiring, architecture, and cross-functional partnership.\nWhy them: pan-African payments rails are one of the highest-leverage problems on the continent right now." },
        ]}
      />
    </div>
  ),
});
