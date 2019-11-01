import sanityClient from '@sanity/client'
import blocksToHtml from '@sanity/block-content-to-html'
import imageUrlBuilder from '@sanity/image-url'
// _lodash
import get from 'lodash/get'
import remove from 'lodash/remove'
import fp from 'lodash/fp'

const tracer = x => {
  console.dir(x)
  return x
}

export const client = sanityClient({
  projectId: 's581o0va',
  dataset: 'rfgen-live',
  token: '', // or leave blank to be anonymous user
  useCdn: true // `false` if you want to ensure fresh data
})

const h = blocksToHtml.h

const serializers = {
  marks: {
    link: props =>
      h(
        'a',
        { target: '_blank', rel: 'noreferrer', href: props.mark.href },
        props.children
      )
  }
}

export const renderBlockText = text =>
  blocksToHtml({
    blocks: text,
    serializers: serializers
  })

export const toPlainText = (blocks = []) => {
  return (
    blocks
      // loop through each block
      .map(block => {
        // if it's not a text block with children,
        // return nothing
        if (block._type !== 'block' || !block.children) {
          return ''
        }
        // loop through the children spans, and join the
        // text strings
        return block.children.map(child => child.text).join('')
      })
      // join the parapgraphs leaving split by two linebreaks
      .join('\n\n')
  )
}

const builder = imageUrlBuilder(client)

export const urlFor = source => builder.image(source)

const sanitizePost = res => {
  return {
    id: get(res, '_id', ''),
    slug: get(res, 'slug', ''),
    category: get(res, 'category', ''),
    satoshiIndex: get(res, 'satoshiIndex', 0),
    title: {
      english: get(res, 'en_title', ''),
      arabic: get(res, 'ar_title', '')
    },
    content: {
      english: get(res, 'en_content', []),
      arabic: get(res, 'ar_content', [])
    },
    mainImage: get(res, 'mainImage', false),
    videoLink: get(res, 'videoLink', false),
    posterImage: get(res, 'posterImage', false),
    links: [],
    curatorialTeam: get(res, 'curatorialTeam', []),
    sharjahTeam: get(res, 'sharjahTeam', []),
    event: {
      type: get(res, 'eventType', ''),
      date: get(res, 'performanceDate', ''),
      simpleDate: get(res, 'simpleDate', 12),
      startTime: get(res, 'startTime', ''),
      discussions: get(res, 'discussions', []),
      performers: get(res, 'participants', [])
    },
    link: get(res, 'link', ''),
    publisherName: get(res, 'publisherName', '')
  }
}

export const loadSingleData = async (query, params) => {
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
  try {
    const res = await client.fetch(query, params)
    const introduction = remove(res, isCategoryIntroduciton)

    let processedEvents = fp.compose(
      fp.groupBy(e => e.event.simpleDate), // Group by (simple) date
      fp.map(sanitizePost) // Sanetize posts
    )(res)

    return {
      introduction: sanitizePost(introduction[0]),
      events: processedEvents
    }
  } catch (err) {
    Sentry.captureException(err)
  }
}

export const loadSatoshis = async query => {
  try {
    const res = await client.fetch(query)
    return res.map(sanitizePost)
  } catch (err) {
    Sentry.captureException(err)
  }
}
