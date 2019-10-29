export const siteInfo = {
  title: {
    english: 'Rights of Future Generations',
    arabic: 'حقوق الأجيال القادمة'
  },
  description: {
    english:
      'Rights of Future Generations is an invitation to radically rethink fundamental questions about architecture and its power to create and sustain alternative modes of existence.',
    arabic: 'arabic description to come'
  },
  image: '/img/default-image.jpg'
}

export const colorList = [
  'rfgen-blue',
  'rfgen-leaf',
  'rfgen-green',
  'rfgen-military',
  'rfgen-khaki',
  'rfgen-beige',
  'rfgen-red'
]

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
  '"category": _type',
  'en_content',
  'ar_content'
]

export const categoryListDefaults = [
  {
    name: 'project',
    nameDisplay: {
      english: 'Projects',
      arabic: 'المشاريع'
    },
    categorySlug: 'project',
    menuOrder: 1,
    query: '_type == "projects"',
    projections: []
  },
  {
    name: 'discussion',
    nameDisplay: {
      english: 'Discussions',
      arabic: 'صلة' //PLACEHOLDER
    },
    categorySlug: 'discussion',
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
    menuOrder: 5,
    projections: [
      '"en_title": en_name',
      '"ar_title": ar_name',
      'author->{en_name, ar_name, slug}',
      'publisherName'
    ]
  },
  {
    name: 'participant',
    nameDisplay: {
      english: 'Participants',
      arabic: 'المشاركون'
    },
    categorySlug: 'participant',
    query: '_type == "participant"',
    menuOrder: 6,
    projections: []
  }
]
