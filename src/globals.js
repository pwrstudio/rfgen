export const siteInfo = {
  title: {
    english: 'Rights of Future Generations',
    arabic: 'حقوق الأجيال القادمة'
  }
}
export const pageList = [
  {
    name: {
      english: 'Theme',
      arabic: 'الموضوع'
    },
    slug: 'theme'
  },
  {
    name: {
      english: 'Venues',
      arabic: 'صلة' //PLACEHOLDER
    },
    slug: 'venues'
  },
  {
    name: {
      english: 'Team',
      arabic: 'صلة' //PLACEHOLDER
    },
    slug: 'team'
  },
  {
    name: {
      english: 'Press',
      arabic: 'صلة' //PLACEHOLDER
    },
    slug: 'press'
  },
  {
    name: {
      english: 'Contact',
      arabic: 'اتصل بنا'
    },
    slug: 'contact'
  }
]

export const baseProjections = [
  'en_title',
  'ar_title',
  '"slug": slug.current',
  'mainImage',
  '"category": _type'
]

export const categoryList = [
  {
    name: 'project',
    nameDisplay: {
      english: 'Projects',
      arabic: 'المشاريع'
    },
    categorySlug: 'project',
    color: 'rfgen-blue',
    menuOrder: 1,
    query: '_type == "projects"',
    projections: []
  },
  {
    name: 'talk',
    nameDisplay: {
      english: 'Talks',
      arabic: 'صلة' //PLACEHOLDER
    },
    categorySlug: 'talk',
    color: 'rfgen-leaf',
    menuOrder: 2,
    query: '_type == "talk"',
    projections: ['timeAndDate']
  },
  {
    name: 'performance',
    nameDisplay: {
      english: 'Performances',
      arabic: 'صلة' //PLACEHOLDER
    },
    categorySlug: 'performance',
    color: 'rfgen-green',
    menuOrder: 3,
    query: '_type == "performance"',
    projections: ['timeAndDate']
  },
  {
    name: 'workingGroup',
    nameDisplay: {
      english: 'Working Group',
      arabic: 'صلة' //PLACEHOLDER
    },
    categorySlug: 'working-group',
    color: 'rfgen-military',
    query: '_type == "workingGroup"',
    menuOrder: 4,
    projections: []
  },
  {
    name: 'writing',
    nameDisplay: {
      english: 'Writings',
      arabic: 'صلة' //PLACEHOLDER
    },
    categorySlug: 'writing',
    query: '_type == "writing"',
    color: 'rfgen-khaki',
    menuOrder: 5,
    projections: [
      '"en_title": en_name',
      '"ar_title": ar_name',
      'author->{en_name, ar_name, slug}',
      'publisherName'
    ]
  },
  {
    name: 'socialMedia',
    nameDisplay: {
      english: '#rfgen',
      arabic: '#rfgen'
    },
    categorySlug: 'social-media',
    color: 'rfgen-red',
    menuOrder: 6,
    query: '_type == "socialMedia", ',
    projections: ['link', 'networkName']
  },
  {
    name: 'participant',
    nameDisplay: {
      english: 'Participants',
      arabic: 'المشاركون'
    },
    categorySlug: 'participant',
    color: 'rfgen-beige',
    query: '_type == "participant"',
    menuOrder: 7,
    projections: []
  }
]

export const introTexts = {
  participant: 'TODO: Participants introduction text',
  writing: 'TODO: Writings introduction text',
  talk: 'TODO: Talks introduction text',
  performance: 'TODO: Performances introduction text',
  project: 'TODO: Projects introduction text',
  'working-group': 'TODO: Working groups introduction text',
  'social-media': 'TODO: social media introduction text'
}
