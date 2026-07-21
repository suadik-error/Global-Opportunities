import { TaxonomyManager } from "@/components/TaxonomyManager";

// Seeded from kredibble-app/src/app/(auth)/signup.tsx's hardcoded arrays —
// today these can only change via a code deploy.
const UNIVERSITIES = [
  "Ashesi University", "Cairo University", "Cambridge University", "Columbia University",
  "Harvard University", "Johns Hopkins University", "Kwame Nkrumah University of Science and Technology",
  "London School of Economics", "Makerere University", "MIT", "National University of Singapore",
  "Oxford University", "Princeton University", "Stanford University", "University of Cape Town",
  "University of Ghana", "University of Lagos", "University of Nairobi", "University of Sydney",
  "University of Toronto", "Yale University",
];

const PROGRAMS = [
  "Accounting", "Agriculture", "Architecture", "Business Administration", "Chemical Engineering",
  "Civil Engineering", "Computer Science", "Data Science", "Economics", "Education",
  "Electrical Engineering", "Environmental Science", "Finance", "Information Technology",
  "International Relations", "Law", "Marketing", "Mathematics", "Mechanical Engineering",
  "Medicine", "Nursing", "Pharmacy", "Psychology", "Public Health", "Software Engineering",
];

const SKILLS = [
  "Data Analysis", "Project Management", "Digital Marketing", "Public Speaking", "Content Writing",
  "Graphic Design", "Financial Literacy", "Critical Thinking", "Team Collaboration", "Communication",
  "Leadership", "Problem Solving", "Time Management", "Research & Analysis", "Microsoft Excel",
  "Python Programming", "JavaScript", "SQL", "UI/UX Design", "Video Editing", "Negotiation",
  "Customer Service", "Event Planning", "Fundraising",
];

const CAREER_INTERESTS = [
  "Software Engineering", "Investment Banking", "Public Health", "Agribusiness Management",
  "Corporate Law", "Human Resource Management", "Data Science", "Supply Chain Logistics",
  "Renewable Energy Engineering", "Architecture & Urban Planning", "Education & Training",
  "Medical Research", "International Development", "Environmental Engineering", "Entrepreneurship",
  "Digital Marketing", "Finance & Accounting", "Journalism & Media", "Public Policy", "Social Work",
];

export default function SeekerTaxonomyPage() {
  return (
    <TaxonomyManager
      title="Seeker Taxonomy"
      subtitle="Reference lists shown as dropdowns during Seeker signup and profile editing."
      tabs={[
        { label: "Universities", items: UNIVERSITIES },
        { label: "Programs", items: PROGRAMS },
        { label: "Skills", items: SKILLS },
        { label: "Career Interests", items: CAREER_INTERESTS },
      ]}
    />
  );
}
