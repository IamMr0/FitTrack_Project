
const BASE_URL = 'https://exercisedb.p.rapidapi.com'
const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY
const API_HOST = import.meta.env.VITE_RAPIDAPI_HOST
const HEADERS = {
  'X-RapidAPI-Key': API_KEY,
  'X-RapidAPI-Host': API_HOST
}

const isApiKeyMissing = !API_KEY || API_KEY === 'your_rapidapi_key_here'

export async function fetchExercises(limit = 1500, offset = 0) {
  if (isApiKeyMissing) {
    console.warn('RapidAPI Key is missing. Live data unavailable.')
    return []
  }

  try {
    const response = await fetch(`${BASE_URL}/exercises?limit=${limit}&offset=${offset}`, { headers: HEADERS })
    if (!response.ok) throw new Error('API fetch failed')
    return await response.json()
  } catch (error) {
    console.error('fetchExercises error:', error)
    return []
  }
}

export async function fetchExercisesByBodyPart(bodyPart, limit = 1500, offset = 0) {
  if (isApiKeyMissing) return []

  try {
    const response = await fetch(`${BASE_URL}/exercises/bodyPart/${bodyPart}?limit=${limit}&offset=${offset}`, { headers: HEADERS })
    if (!response.ok) throw new Error('API fetch failed')
    return await response.json()
  } catch (error) {
    console.error('fetchExercisesByBodyPart error:', error)
    return []
  }
}

export async function fetchBodyPartList() {
  if (isApiKeyMissing) return []

  try {
    const response = await fetch(`${BASE_URL}/exercises/bodyPartList`, { headers: HEADERS })
    if (!response.ok) throw new Error('API fetch failed')
    return await response.json()
  } catch (error) {
    console.error('fetchBodyPartList error:', error)
    return []
  }
}

/**
 * Returns the GIF image as a local Blob URL by fetching it with proper auth headers.
 * This is required because the RapidAPI /image endpoint sends Cross-Origin-Resource-Policy: same-origin,
 * which blocks direct <img src="..."> loading from a browser.
 */
export async function fetchExerciseGif(exerciseId) {
  if (isApiKeyMissing) return null

  const url = `${BASE_URL}/image?exerciseId=${exerciseId}&resolution=180`
  try {
    const response = await fetch(url, { headers: HEADERS })
    if (!response.ok) return null
    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('fetchExerciseGif error:', error)
    return null
  }
}

export default {
  fetchExercises,
  fetchExercisesByBodyPart,
  fetchBodyPartList,
  fetchExerciseGif
}
