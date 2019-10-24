import sanityClient from '@sanity/client'
import blocksToHtml from '@sanity/block-content-to-html'
import imageUrlBuilder from '@sanity/image-url'
import get from 'lodash/get'
import remove from 'lodash/remove'

export const client = sanityClient({
  projectId: 's581o0va',
  dataset: 'rfgen-live',
  token: '', // or leave blank to be anonymous user
  useCdn: true // `false` if you want to ensure fresh data
})

export const renderBlockText = text =>
  blocksToHtml({
    blocks: text
  })

const builder = imageUrlBuilder(client)

export const urlFor = source => builder.image(source)

const sanitizePost = res => {
  return {
    id: get(res, '_id', ''),
    slug: get(res, 'slug', ''),
    category: get(res, 'category', ''),
    title: {
      english: get(res, 'en_title', ''),
      arabic: get(res, 'en_title', '')
    },
    content: {
      english: get(res, 'en_content', []),
      arabic: get(res, 'ar_content', [])
    },
    mainImage: get(res, 'mainImage', false),
    videoLink: get(res, 'videoLink', false),
    posterImage: get(res, 'posterImage', false),
    links: [],
    event: {
      type: get(res, 'eventType', ''),
      date: get(res, 'performanceDate', ''),
      discussions: get(res, 'discussions', []),
      performers: get(res, 'participants', [])
    }
  }
}

export const loadSingleData = async (query, params) => {
  console.dir('shared')
  try {
    const res = await client.fetch(query, params)

    let postConstruction = sanitizePost(res)

    // LINKS >>>
    if (postConstruction.category === 'participant') {
      const linksQuery =
        '*[participants[]._ref == $id]{en_title, ar_title, en_content, ar_content, "slug": slug.current, mainImage, "category": _type}'
      postConstruction.links = await client.fetch(linksQuery, {
        id: postConstruction.id
      })
      postConstruction.links = postConstruction.links.map(sanitizePost)
    } else {
      postConstruction.links = get(res, 'participants', []).map(sanitizePost)
    }

    return postConstruction
  } catch (err) {
    Sentry.captureException(err)
  }
}

const isCategoryIntroduciton = p => p.category === 'categoryIntroduction'

export const loadProgrammeData = async (query, params) => {
  console.dir('programme shared')
  try {
    const res = await client.fetch(query, params)

    const introduction = remove(res, isCategoryIntroduciton)

    return {
      introduction: sanitizePost(introduction[0]),
      events: res.map(sanitizePost)
    }
  } catch (err) {
    Sentry.captureException(err)
  }
}
