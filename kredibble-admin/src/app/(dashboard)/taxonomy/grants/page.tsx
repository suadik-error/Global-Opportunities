import { TaxonomyManager } from "@/components/TaxonomyManager";

// Seeded from kredibble-app/src/app/grants/filter.tsx's hardcoded arrays.
const SECTORS = [
  "Administration", "Advocacy", "Agriculture and rural development", "Border management",
  "Civic engineering", "Community development & NGO", "Culture & arts", "Education",
  "Environment", "Health", "Human rights", "Humanitarian aid", "Infrastructure",
  "Legal & governance", "Media & communications", "Peacebuilding", "Water & sanitation",
];

const APPLICANT_TYPES = [
  "NGOs / nonprofit organization", "Government / public bodies", "Academic institution",
  "Private sector", "Unrestricted / unspecific", "Individuals", "Others",
];

const FUNDING_AGENCIES = [
  "AF - adaptation fund", "Alliance - alliance for public health",
  "Academic institution", "Others",
];

export default function GrantsTaxonomyPage() {
  return (
    <TaxonomyManager
      title="Grants Taxonomy"
      subtitle="Reference lists shown as filters and dropdowns in the Grants section of the app."
      tabs={[
        { label: "Sectors", items: SECTORS },
        { label: "Applicant Types", items: APPLICANT_TYPES },
        { label: "Funding Agencies", items: FUNDING_AGENCIES },
      ]}
    />
  );
}
