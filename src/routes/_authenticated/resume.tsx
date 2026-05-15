import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { AiTool } from "@/components/AiTool";

export const Route = createFileRoute("/_authenticated/resume")({
  head: () => ({ meta: [{ title: "Resume Builder — Workplace AI" }] }),
  component: () => (
    <div>
      <PageHeader
        eyebrow="Career"
        title="AI Resume Builder"
        description="Generate a polished, ATS-friendly resume tailored to your target role."
      />
      <AiTool
        tool="resume"
        title="Build Resume"
        description="Share your background, skills, and the role you're targeting."
        inputLabel="Your details & target role"
        inputPlaceholder={`Name: Jane Doe\nTarget role: Senior Product Manager at a SaaS company\nExperience: 6 years in B2B SaaS — led pricing rework (+18% ARR), shipped onboarding redesign (-30% time-to-value)...\nSkills: Roadmapping, SQL, A/B testing, stakeholder management\nEducation: BSc Computer Science, University of Cape Town`}
        cta="Build Resume"
        examples={[
          { label: "Product Manager", prompt: "Target role: Senior Product Manager at a B2B SaaS company.\nExperience: 6 years across two SaaS startups. Led pricing experiment that lifted ARR 18%. Shipped onboarding redesign that cut time-to-value by 30%. Managed a team of 4.\nSkills: roadmapping, SQL, A/B testing, customer discovery, stakeholder management.\nEducation: BSc Computer Science, University of Cape Town." },
          { label: "Software Engineer", prompt: "Target role: Senior Full-Stack Engineer (TypeScript / React / Node).\nExperience: 5 years building production web apps. Led migration to TanStack Start (cut TTFB 40%). Mentored 3 juniors.\nSkills: TypeScript, React, Node, PostgreSQL, AWS, system design.\nEducation: BEng Computer Engineering, University of Pretoria." },
          { label: "Marketing Manager", prompt: "Target role: Growth Marketing Manager at a fintech startup.\nExperience: 4 years in performance and lifecycle marketing. Scaled paid acquisition from R200k to R1.2M monthly with stable CAC. Built lifecycle programme that lifted activation 22%.\nSkills: SEO, paid social, lifecycle email, analytics (GA4, Mixpanel), copywriting." },
        ]}
      />
    </div>
  ),
});
