function cleanTextContent(message = '') {
  message = message.replace(/\[b\]/g, '<strong>')
  message = message.replace(/\[\/b\]/g, '</strong>')

  message = message.replace(/\[u\]/g, '<span class="underline">')
  message = message.replace(/\[\/u\]/g, '</span>')

  message = message.replace(/\[i\]/g, '<i class="italic">')
  message = message.replace(/\[\/i\]/g, '</i>')

  message = message.replace(/\[code\]/g, '<code>')
  message = message.replace(/\[\/code\]/g, '</code>')

  message = message.replace(/\[quote\]/g, '<q>')
  message = message.replace(/\[\/quote\]/g, '</q>')

  message = message.replace(/\[color=(.*?)\]/g, '<span style="background-color: $1">')
  message = message.replace(/\[\/color\]/g, '</span>')

  if (message.match(/https:\/\/.*/g)) {
    message = message.replace(/(https:\/\/.*?)\s|$/g, '<a href="$1">$1</a>')
  }

  return message
}

function cleanTextForNotification(message = '') {
  message = message.replace(/\[.*?\]/g, '')
  message = message.replace(/\[\/.*?\]/g, '')

  return message
}

function getMediaContent(content) {
  const imageRgx = /http.*?\.(jpg|png|gif|webp|svg)/g
  const videoRgx = /https:\/\/.*(youtube|yoube).*?v=(.*)($|\s)/g

  let images = content.match(imageRgx)
  let videos = content.match(videoRgx)

  if (!images) {
    images = []
  }

  if (videos) {
    videos = videos.map(
      (r) => `https://www.youtube.com/embed/${r.replace(/.*?(v=)(.*)($|\s)/, '$2')}?si=sC8j8RNlgt9Y9qgI`,
    )
    console.log(videos)
  } else {
    videos = []
  }

  let text = content.replace(imageRgx, '[image]')
  text = text.replace(videoRgx, '[video]')

  const media = [...images.map((m) => ({ src: m, type: 'image' })), ...videos.map((m) => ({ src: m, type: 'video' }))]

  return {
    text: cleanTextContent(text),
    media,
  }
}

export { getMediaContent, cleanTextForNotification, cleanTextContent }
