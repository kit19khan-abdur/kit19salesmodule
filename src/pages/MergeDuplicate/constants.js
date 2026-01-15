/**
 * Constants for MergeDuplicate feature
 */

export const MOCK_DUPLICATES = [
  {
    id: 1,
    name: 'Margarita Denesik',
    mobile: '+91 9476975825',
    email: 'marcelina.tillman@hotmail.com',
    company: 'Tech Solutions Ltd',
    createdDate: '2026-01-15T11:25:00',
    source: 'Website',
    matchCount: 2,
    duplicates: [
      { id: 11, name: 'Margarita D.', mobile: '+91 9476975825', email: 'margarita.d@gmail.com', createdDate: '2026-01-10T09:00:00', source: 'Import' },
      { id: 12, name: 'M. Denesik', mobile: '+91 9476975826', email: 'marcelina.tillman@hotmail.com', createdDate: '2026-01-08T14:30:00', source: 'Manual' }
    ]
  },
  {
    id: 2,
    name: 'Miss Karli Fahey',
    mobile: '+91 9202025368',
    email: 'marion.walsh@hotmail.com',
    company: 'Global Enterprises',
    createdDate: '2026-01-14T09:26:00',
    source: 'Referral',
    matchCount: 1,
    duplicates: [
      { id: 21, name: 'Karli Fahey', mobile: '+91 9202025368', email: 'karli.f@yahoo.com', createdDate: '2026-01-08T14:30:00', source: 'Campaign' }
    ]
  },
  {
    id: 3,
    name: 'William Rodriguez',
    mobile: '+91 9565650809',
    email: 'vernon.rohan@hotmail.com',
    company: 'Innovate Corp',
    createdDate: '2026-01-14T09:16:00',
    source: 'Walk-in',
    matchCount: 1,
    duplicates: [
      { id: 31, name: 'Will Rodriguez', mobile: '+91 9565650809', email: 'will.r@outlook.com', createdDate: '2026-01-05T11:45:00', source: 'Website' }
    ]
  },
  {
    id: 4,
    name: 'Elise Leffler',
    mobile: '+91 9367125013',
    email: 'tanner.oconner@yahoo.com',
    company: 'DataFlow Inc',
    createdDate: '2026-01-14T09:06:00',
    source: 'Campaign',
    matchCount: 3,
    duplicates: [
      { id: 41, name: 'Elise L.', mobile: '+91 9367125013', email: 'elise.leffler@gmail.com', createdDate: '2026-01-03T16:20:00', source: 'Import' },
      { id: 42, name: 'E. Leffler', mobile: '+91 9367125014', email: 'tanner.oconner@yahoo.com', createdDate: '2026-01-02T10:15:00', source: 'Manual' },
      { id: 43, name: 'Elise Leffler', mobile: '+91 9367125013', email: 'e.leffler@work.com', createdDate: '2026-01-01T08:00:00', source: 'Website' }
    ]
  },
  {
    id: 5,
    name: 'Susanna Eichmann III',
    mobile: '+91 9247330097',
    email: 'dovie.altenwerth@hotmail.com',
    company: 'Prime Services',
    createdDate: '2026-01-13T20:36:00',
    source: 'Import',
    matchCount: 1,
    duplicates: [
      { id: 51, name: 'Susanna Eichmann', mobile: '+91 9247330097', email: 'susanna.e@company.com', createdDate: '2026-01-01T08:15:00', source: 'Referral' }
    ]
  },
  {
    id: 6,
    name: 'Bettie Skiles',
    mobile: '+91 9714881975',
    email: 'llewellyn.baumbach@yahoo.com',
    company: 'Nexus Group',
    createdDate: '2026-01-12T19:23:00',
    source: 'Manual',
    matchCount: 2,
    duplicates: [
      { id: 61, name: 'Bettie S.', mobile: '+91 9714881975', email: 'bettie.skiles@gmail.com', createdDate: '2025-12-28T10:30:00', source: 'Website' },
      { id: 62, name: 'B. Skiles', mobile: '+91 9714881975', email: 'b.skiles@work.com', createdDate: '2025-12-25T14:00:00', source: 'Import' }
    ]
  },
  {
    id: 7,
    name: 'Lazaro Walter I',
    mobile: '+91 9370844193',
    email: 'rosetta.pacocha@gmail.com',
    company: 'Alpha Technologies',
    createdDate: '2026-01-12T08:33:00',
    source: 'Website',
    matchCount: 1,
    duplicates: [
      { id: 71, name: 'Lazaro Walter', mobile: '+91 9370844193', email: 'lazaro.w@yahoo.com', createdDate: '2025-12-20T09:45:00', source: 'Manual' }
    ]
  },
  {
    id: 8,
    name: "Kyle D'Amore Jr.",
    mobile: '+91 9530755802',
    email: 'judy.zemlak@gmail.com',
    company: 'Summit Corp',
    createdDate: '2026-01-12T08:23:00',
    source: 'Campaign',
    matchCount: 1,
    duplicates: [
      { id: 81, name: 'Kyle DAmore', mobile: '+91 9530755802', email: 'kyle.damore@outlook.com', createdDate: '2025-12-18T13:10:00', source: 'Referral' }
    ]
  }
];
