
const BASE_URL = 'https://exercisedb.p.rapidapi.com'
const HEADERS = {
  'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
  'X-RapidAPI-Host': import.meta.env.VITE_RAPIDAPI_HOST
}

const isApiKeyMissing = !import.meta.env.VITE_RAPIDAPI_KEY || import.meta.env.VITE_RAPIDAPI_KEY === 'your_rapidapi_key_here'

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

export function getExerciseGifUrl(exerciseId) {
  if (!import.meta.env.VITE_RAPIDAPI_KEY) {
    return `https://placehold.co/180x180?text=GIF+Preview+${exerciseId}`
  }
  return `https://exercisedb.p.rapidapi.com/image?exerciseId=${exerciseId}&resolution=180&rapidapi-key=${import.meta.env.VITE_RAPIDAPI_KEY}`
}

export default {
  fetchExercises,
  fetchExercisesByBodyPart,
  fetchBodyPartList,
  getExerciseGifUrl
}
