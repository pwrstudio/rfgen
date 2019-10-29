import sanityClient from '@sanity/client'
import blocksToHtml from '@sanity/block-content-to-html'
import imageUrlBuilder from '@sanity/image-url'
// _lodash
import get from 'lodash/get'
import remove from 'lodash/remove'
import map from 'lodash/map'
import flatten from 'lodash/flatten'
import sample from 'lodash/sample'
import fp from 'lodash/fp'

// date-fns
import format from 'date-fns/format'

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

const getEventDate = e => {
  e.event.date = new Date(get(e, 'event.date', false))
  // console.log(e.event.date)
  return e
}

export const loadProgrammeData = async (query, params) => {
  console.dir('programme shared')
  try {
    const res = await client.fetch(query, params)
    const introduction = remove(res, isCategoryIntroduciton)

    let processedEvents = fp.compose(
      fp.groupBy(e => format(e.event.date, 'MMMM do')), // Group by date
      fp.map(getEventDate), // Convert date
      fp.map(sanitizePost) // Sanetize posts
    )(res)

    // Fold the date label into the array of events
    // and flatten array
    processedEvents = flatten(
      map(processedEvents, (value, key) => [
        { category: 'date-marker', text: key },
        ...value
      ])
    )

    return {
      introduction: sanitizePost(introduction[0]),
      events: processedEvents
    }
  } catch (err) {
    Sentry.captureException(err)
  }
}

export const loadRandomSatoshi = async query => {
  try {
    const res = await client.fetch(query)
    return sanitizePost(sample(res))
  } catch (err) {
    Sentry.captureException(err)
  }
}
