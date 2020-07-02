import sanityClient from '@sanity/client'
import blocksToHtml from '@sanity/block-content-to-html'
import imageUrlBuilder from '@sanity/image-url'
import getVideoId from "get-video-id";
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
  useCdn: false // `false` if you want to ensure fresh data
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
  },
  types: {
    embed: props => {
      // YOUTUBE
      if (props.node.url.includes('youtube')) {
        return h('div', { className: 'embed-container' }, h('iframe', { width: '720', height: '480', src: 'https://www.youtube.com/embed/' + getVideoId(props.node.url).id, frameborder: 'no', allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture', allowfullscreen: true }))
      }
      // VIMEO
      if (props.node.url.includes('vimeo')) {
        return h('div', { className: 'embed-container' }, h('iframe', { width: '720', height: '480', src: 'https://player.vimeo.com/video/' + getVideoId(props.node.url).id, frameborder: 'no', byline: false, color: '#ffffff', allow: 'autoplay; fullscreen', allowfullscreen: true }))
      }
      // SOUNDCLOUD
      if (props.node.url.includes('soundcloud')) {
        return h('div', { className: 'soundcloud-container' }, h('iframe', { width: '100%', height: '300', src: 'https://w.soundcloud.com/player/?url=' + props.node.url + '&color=%23fffff', frameborder: 'no', scrolling: "no", allow: 'autoplay' }))
      }
    }
  }
}

export const renderBlockText = text =>
  blocksToHtml({
    blocks: text,
    serializers: serializers,
    projectId: 's581o0va',
    dataset: 'rfgen-live',
    imageOptions: { w: 720, h: 500, fit: 'max' },
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

    if (res === null) {
      return Promise.reject(new Error(404));
    }

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
    return Promise.reject(new Error(404));
  }
}

const isCategoryIntroduciton = p => p.category === 'categoryIntroduction'

export const loadProgrammeData = async (query, params) => {
  try {
    const res = await client.fetch(query, params)

    if (res === null) {
      return Promise.reject(new Error(404));
    }

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
    if (res === null) {
      return Promise.reject(new Error(404));
    }
    return res.map(sanitizePost)
  } catch (err) {
    Sentry.captureException(err)
    return Promise.reject(new Error(404));
  }
}
