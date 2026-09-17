import bcrypt from 'bcryptjs';
import { connectToDatabase, collections } from '../src/lib/mongodb.js';

const json = (value) => JSON.stringify(value);

async function seed() {
  console.log('Seeding Kredibble MongoDB database...');
  await connectToDatabase();

  const demoPasswordHash = await bcrypt.hash('password123', 12);

  // Clear existing data
  const allCollections = Object.values(collections);
  for (const getCol of allCollections) {
    try {
      await getCol().deleteMany({});
    } catch (e) {
      console.warn(`Could not clear collection: ${e.message}`);
    }
  }

  // Users
  const seekers = [
    {
      _id: 'user-seeker-1',
      name: 'Enoch Mensah',
      email: 'enoch.mensah@gmail.com',
      role: 'seeker',
      passwordHash: demoPasswordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    { _id: 'user-seeker-2', name: 'Kojo Boateng', email: 'kojo.boateng@gmail.com', role: 'seeker', createdAt: new Date(), updatedAt: new Date() },
    { _id: 'user-seeker-3', name: 'Ama Serwaa', email: 'ama.serwaa@gmail.com', role: 'seeker', createdAt: new Date(), updatedAt: new Date() },
  ];

  const admins = [
    { _id: 'user-admin-1', name: 'Nana Adjei', email: 'nana.adjei@kredibble.com', role: 'admin', passwordHash: demoPasswordHash, createdAt: new Date(), updatedAt: new Date() },
  ];

  const hirers = [
    { _id: 'user-hirer-1', name: 'Sarah Jenkins', email: 's.jenkins@google.com', role: 'hirer', passwordHash: demoPasswordHash, createdAt: new Date(), updatedAt: new Date() },
  ];

  await collections.users().insertMany([...seekers, ...admins, ...hirers]);

  // Seeker Profiles
  await collections.seekers().insertMany([
    {
      _id: 'seeker-1',
      userId: 'user-seeker-1',
      profession: 'Software Developer',
      university: 'Kwame Nkrumah University of Science and Technology',
      country: 'Ghana',
      city: 'Accra',
      website: 'EnochMensah.com',
      phone: '+23350728334',
      rating: 5,
      verified: true,
      bio: 'Experienced software developer specializing in user-friendly mobile and web experiences.',
      professionalSummary: 'Curious and detail-oriented Software Developer with strong visual design skills.',
      experienceLevel: 'Senior',
      technicalSkills: json(['HTML5', 'CSS3', 'JavaScript', 'React', 'Bootstrap', 'Figma']),
      softSkills: json(['Problem Solving', 'Team Collaboration', 'Communication']),
      tools: json(['Figma', 'VS Code', 'GitHub', 'Notion']),
      certifications: json(['Google UX Design Certificate', 'Meta Front-End Developer Certificate']),
      joinedDate: '3 Jan 2026',
      applicationsCount: 4,
      savedCount: 6,
      status: 'active',
    },
    {
      _id: 'seeker-2',
      userId: 'user-seeker-2',
      profession: 'UI/UX Designer',
      university: 'Ashesi University',
      country: 'Ghana',
      city: 'Accra',
      rating: 4,
      verified: true,
      bio: 'Detail-oriented Junior Designer with a passion for clean UI layouts.',
      experienceLevel: 'Entry Level',
      technicalSkills: json(['Figma', 'UI Design', 'Wireframing', 'Prototyping']),
      softSkills: json(['Communication', 'Creativity']),
      tools: json(['Figma', 'Miro']),
      certifications: json(['Google UX Design Certificate']),
      joinedDate: '18 Feb 2026',
      applicationsCount: 2,
      savedCount: 9,
      status: 'active',
    },
    {
      _id: 'seeker-3',
      userId: 'user-seeker-3',
      profession: 'Frontend Developer',
      university: 'KNUST',
      country: 'Ghana',
      city: 'Kumasi',
      rating: 4,
      verified: false,
      bio: 'Mobile applications enthusiast focused on performance and reusable components.',
      experienceLevel: 'Intermediate',
      technicalSkills: json(['React Native', 'TypeScript', 'TailwindCSS', 'JavaScript']),
      softSkills: json(['Teamwork', 'Time Management']),
      tools: json(['VS Code', 'GitHub']),
      certifications: json([]),
      joinedDate: '2 Mar 2026',
      applicationsCount: 1,
      savedCount: 3,
      status: 'active',
    },
  ]);

  // Hirer Accounts
  await collections.hirers().insertMany([
    {
      _id: 'hirer-1',
      userId: 'user-hirer-1',
      companyName: 'Google LLC',
      tagline: "Organizing the world's information",
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png',
      bannerImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
      industry: 'Technology / Software',
      companySize: '1,000+ employees',
      location: 'Accra, Ghana & Mountain View, CA',
      website: 'careers.google.com',
      companyEmail: 'careers@google.com',
      description: 'Global technology company focused on search, cloud, software, and AI.',
      recruiterName: 'Sarah Jenkins',
      recruiterRole: 'Lead Talent Partner, EMEA',
      recruiterEmail: 's.jenkins@google.com',
      recruiterPhone: '(+233) 24 000 0000',
      recruiterLinkedin: 'linkedin.com/in/sarahjenkins',
      verification: 'approved',
      verified: true,
      status: 'active',
      joinedDate: '28 Jun 2026',
      postingsCount: 2,
    },
    {
      _id: 'hirer-2',
      companyName: 'Wave Mobile Money',
      industry: 'Fintech',
      companySize: '201-500 employees',
      location: 'Dakar, Senegal',
      website: 'wave.com',
      companyEmail: 'careers@wave.com',
      recruiterName: 'Fatou Diop',
      recruiterRole: 'Talent Acquisition Lead',
      recruiterEmail: 'f.diop@wave.com',
      verification: 'pending',
      verified: false,
      status: 'active',
      joinedDate: '14 Jul 2026',
      postingsCount: 1,
    },
    {
      _id: 'hirer-3',
      companyName: 'Ashesi Ventures',
      industry: 'Education',
      companySize: '11-50 employees',
      location: 'Berekuso, Ghana',
      website: 'ashesiventures.org',
      companyEmail: 'hello@ashesiventures.org',
      recruiterName: 'Kwabena Owusu',
      recruiterRole: 'Program Coordinator',
      recruiterEmail: 'k.owusu@ashesiventures.org',
      verification: 'pending',
      verified: false,
      status: 'active',
      joinedDate: '12 Jul 2026',
      postingsCount: 2,
    },
  ]);

  // Company Verifications
  await collections.verifications().insertMany([
    {
      _id: 'comp-3',
      hirerId: 'hirer-1',
      name: 'Google LLC',
      industry: 'Technology / Software',
      companySize: '1,000+ employees',
      location: 'Accra, Ghana & Mountain View, CA',
      website: 'careers.google.com',
      companyEmail: 'careers@google.com',
      recruiterName: 'Sarah Jenkins',
      recruiterRole: 'Lead Talent Partner, EMEA',
      recruiterEmail: 's.jenkins@google.com',
      submittedDate: '28 Jun 2026',
      overallStatus: 'approved',
      docs: [
        { key: 'businessReg', label: 'Business Registration', fileName: 'google_business_reg.pdf', status: 'approved' },
        { key: 'orgId', label: 'Organization ID', fileName: 'google_org_id.pdf', status: 'approved' },
        { key: 'companyLogo', label: 'Company Logo', fileName: 'google_logo.png', status: 'approved' },
        { key: 'proofOfOrg', label: 'Proof of Organization', fileName: 'google_proof.pdf', status: 'approved' },
      ],
    },
    {
      _id: 'comp-1',
      name: 'Wave Mobile Money',
      industry: 'Fintech',
      companySize: '201-500 employees',
      location: 'Dakar, Senegal',
      website: 'wave.com',
      companyEmail: 'careers@wave.com',
      recruiterName: 'Fatou Diop',
      recruiterRole: 'Talent Acquisition Lead',
      recruiterEmail: 'f.diop@wave.com',
      submittedDate: '14 Jul 2026',
      overallStatus: 'pending',
      docs: [
        { key: 'businessReg', label: 'Business Registration', fileName: 'wave_business_reg.pdf', status: 'pending' },
        { key: 'orgId', label: 'Organization ID', fileName: 'wave_org_id.pdf', status: 'pending' },
        { key: 'companyLogo', label: 'Company Logo', fileName: 'wave_logo.png', status: 'approved' },
        { key: 'proofOfOrg', label: 'Proof of Organization', fileName: 'wave_tax_cert.pdf', status: 'pending' },
      ],
    },
  ]);

  // Opportunities
  await collections.opportunities().insertMany([
    {
      _id: 'opp-1',
      hirerId: 'hirer-1',
      title: 'Senior Product Designer',
      type: 'jobs',
      company: 'Google LLC',
      location: 'Accra, Ghana (Hybrid)',
      logoColor: '#4285F4',
      initial: 'G',
      description: 'Lead design initiatives across Google Pay EMEA teams.',
      applicantsCount: 3,
      date: '28 Jun 2026',
      moderationStatus: 'approved',
      workType: 'Hybrid',
      salary: '$85,000 - $110,000/yr',
      experienceLevels: json(['Senior']),
    },
    {
      _id: 'opp-2',
      title: 'Backend Engineer, Payments',
      type: 'jobs',
      company: 'Wave Mobile Money',
      location: 'Dakar, Senegal (Remote)',
      description: 'Build resilient payment infrastructure serving users across West Africa.',
      applicantsCount: 12,
      date: '10 Jul 2026',
      moderationStatus: 'pending',
      workType: 'Remote',
      salary: '$60,000 - $90,000/yr',
    },
    {
      _id: 'opp-3',
      title: 'Founders \u0026 Funders Demo Night',
      type: 'events',
      company: 'Ashesi Ventures',
      location: 'Berekuso, Ghana',
      description: 'Founder pitches, regional investors, and a networking mixer.',
      applicantsCount: 46,
      date: '2 Aug 2026',
      moderationStatus: 'pending',
      eventDateTime: '2 Aug 2026, 6:00 PM GMT',
      eventCategory: 'Networking',
    },
    {
      _id: 'opp-4',
      title: 'Early-Stage EdTech Innovation Grant',
      type: 'grants',
      company: 'Ashesi Ventures',
      location: 'Pan-African',
      description: 'Non-dilutive funding for early-stage EdTech founders building for the African market.',
      applicantsCount: 8,
      date: '5 Jul 2026',
      moderationStatus: 'pending',
      grantBudgetRange: 'Up to $25,000',
      grantSector: 'Education',
    },
  ]);

  // Applicants
  await collections.applicants().insertMany([
    {
      _id: 'app-c1',
      opportunityId: 'opp-1',
      seekerId: 'seeker-2',
      name: 'Kojo Boateng',
      profession: 'UI/UX Designer',
      university: 'Ashesi University',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      matchScore: 96,
      status: 'Shortlisted',
      skills: json(['Figma', 'UI Design', 'Wireframing']),
      resumeUrl: 'kojo_boateng_resume.pdf',
    },
    {
      _id: 'app-c2',
      opportunityId: 'opp-1',
      seekerId: 'seeker-3',
      name: 'Ama Serwaa',
      profession: 'Frontend Developer',
      university: 'KNUST',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      matchScore: 92,
      status: 'Applied',
      skills: json(['React Native', 'TypeScript', 'TailwindCSS']),
      resumeUrl: 'ama_serwaa_resume.pdf',
    },
  ]);

  // Candidates
  await collections.candidates().insertMany([
    {
      _id: 'cand-1',
      name: 'Kojo Boateng',
      profession: 'UI/UX Designer',
      university: 'Ashesi University',
      location: 'Accra, Ghana',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      matchScore: 96,
      skills: json(['Figma', 'UI Design', 'Wireframing', 'Prototyping']),
      bio: 'Detail-oriented Junior Designer with a passion for clean UI layouts.',
    },
    {
      _id: 'cand-2',
      name: 'Ama Serwaa',
      profession: 'Frontend Developer',
      university: 'KNUST',
      location: 'Kumasi, Ghana',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      matchScore: 92,
      skills: json(['React Native', 'TypeScript', 'TailwindCSS', 'JavaScript']),
      bio: 'Mobile applications enthusiast focused on performance engineering.',
    },
  ]);

  // Channels
  await collections.channels().insertOne({
    _id: 'ch-1',
    hirerId: 'hirer-1',
    name: 'Breaking Into Tech Successfully',
    owner: 'Public (community-created)',
    category: 'Coding \u0026 Technology',
    followers: '200 followers',
    postsCount: 2,
    status: 'active',
  });

  // Posts
  await collections.posts().insertMany([
    { _id: 'post-1', channelId: 'ch-1', authorName: 'System', body: 'The channel was created', date: '9 Feb 2026', flagged: false },
    { _id: 'post-2', channelId: 'ch-1', authorName: 'Anonymous User', body: 'Suspicious application-fee post.', date: '10 Feb 2026', flagged: true },
  ]);

  // Reports
  await collections.reports().insertOne({
    _id: 'report-1',
    targetType: 'post',
    targetLabel: 'Post in "Guaranteed Visa Sponsorship Jobs"',
    reporterName: 'Ama Serwaa',
    reason: 'Scam / Fraud',
    details: 'This post is asking for a registration fee to guarantee a work visa.',
    date: '13 Jul 2026',
    status: 'open',
    linkedChannelId: 'ch-1',
  });

  // Events
  await collections.events().insertMany([
    {
      _id: 'event-1',
      title: 'Founders \u0026 Funders Demo Night',
      hirer: 'Ashesi Ventures',
      location: 'Berekuso, Ghana',
      dateTime: '2 Aug 2026, 6:00 PM GMT',
      capacity: 150,
      attendeesCount: 46,
      status: 'upcoming',
    },
    {
      _id: 'event-2',
      title: 'Google Career Fair - West Africa',
      hirer: 'Google LLC',
      location: 'Accra, Ghana',
      dateTime: '20 Aug 2026, 10:00 AM GMT',
      capacity: 400,
      attendeesCount: 312,
      status: 'upcoming',
    },
  ]);

  // Grants
  await collections.grants().insertOne({
    _id: 'grant-1',
    title: 'Early-Stage EdTech Innovation Grant',
    hirer: 'Ashesi Ventures',
    sector: 'Education',
    fundingPool: 200000,
    allocated: 75000,
    status: 'open',
  });

  // Grant Applications
  await collections.grantApplications().insertMany([
    { _id: 'grant-app-1', grantId: 'grant-1', applicantName: 'Kojo Boateng', requestedAmount: 25000, status: 'approved' },
    { _id: 'grant-app-2', grantId: 'grant-1', applicantName: 'Michael Mensah', requestedAmount: 25000, status: 'pending' },
  ]);

  // Articles
  await collections.articles().insertMany([
    {
      _id: 'article-1',
      category: 'Resume Writing',
      title: 'How to write a developer resume that gets noticed',
      duration: '5 min read',
      summary: 'Learn key formatting guidelines and structural details that make your resume stand out.',
      content: 'Writing a great software developer resume is about demonstrating impact, not just listing technologies.',
      status: 'published',
      bannerImage: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=80',
    },
    {
      _id: 'article-2',
      category: 'Interview Prep',
      title: 'Mastering behavioral interviews: The STAR Method',
      duration: '8 min read',
      summary: 'A walkthrough of the Situation, Task, Action, and Result framework.',
      content: 'Behavioral interview questions are designed to predict future performance based on past actions.',
      status: 'published',
    },
  ]);

  // Staff
  await collections.staff().insertOne({
    _id: 'staff-1',
    userId: 'user-admin-1',
    name: 'Nana Adjei',
    email: 'nana.adjei@kredibble.com',
    role: 'SUPER_ADMIN',
    status: 'active',
    joinedDate: '1 Jan 2026',
  });

  // Notifications
  await collections.notifications().insertMany([
    {
      _id: 'sent-1',
      title: 'Welcome to Kredibble',
      message: 'Complete your profile to start receiving personalized opportunity matches.',
      audience: 'seekers',
      sentAt: '1 Jul 2026, 9:00 AM',
    },
    {
      _id: 'sent-2',
      title: 'New verification requirements',
      message: 'All hirer accounts must complete document verification by end of month to keep posting.',
      audience: 'hirers',
      sentAt: '10 Jul 2026, 2:30 PM',
    },
  ]);

  console.log('Seeded Kredibble MongoDB database successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
