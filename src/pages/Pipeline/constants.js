// Pipeline Stages Configuration
export const PIPELINE_STAGES = [
  { id: 'new-lead', name: 'New Lead', color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-700' },
  { id: 'qualification', name: 'Qualification', color: 'bg-pink-500', lightColor: 'bg-pink-50', textColor: 'text-pink-700' },
  { id: 'proposal', name: 'Proposal', color: 'bg-orange-500', lightColor: 'bg-orange-50', textColor: 'text-orange-700' },
  { id: 'closed-won', name: 'Closed/Won', color: 'bg-green-500', lightColor: 'bg-green-50', textColor: 'text-green-700' },
];

// Sample Opportunities Data
export const SAMPLE_OPPORTUNITIES = [
  {
    id: 1,
    stage: 'qualification',
    title: 'Jvjgjhbjhbh',
    amount: 452000,
    company: 'Brightvale Technologies',
    contactName: 'John Smith',
    closingDate: '02/11/2026',
    probability: 60,
  },
];
