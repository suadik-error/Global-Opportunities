import { TaxonomyManager } from "@/components/TaxonomyManager";

// Seeded from kredibble-app/src/app/(auth)/signup.tsx's hardcoded arrays.
const INDUSTRIES = [
  "Technology", "Education", "Finance", "Healthcare", "Marketing",
  "Nonprofit/NGO", "Government", "Media", "Agriculture", "Other",
];

const COMPANY_SIZES = [
  "1–10 employees", "11–50 employees", "51–200 employees",
  "201–500 employees", "500–1,000 employees", "1,000+ employees",
];

const POSITION_ROLES = [
  "HR Manager", "Recruiter", "Talent Acquisition Specialist", "Hiring Manager",
  "Program Coordinator", "Founder/CEO", "Operations Manager",
  "University Representative", "Internship Coordinator", "Other",
];

export default function HirerTaxonomyPage() {
  return (
    <TaxonomyManager
      title="Hirer Taxonomy"
      subtitle="Reference lists shown as dropdowns during Hirer signup and company profile editing."
      tabs={[
        { label: "Industries", items: INDUSTRIES },
        { label: "Company Sizes", items: COMPANY_SIZES },
        { label: "Position Roles", items: POSITION_ROLES },
      ]}
    />
  );
}
