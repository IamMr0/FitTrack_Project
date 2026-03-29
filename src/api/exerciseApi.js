import fallbackExercises from '../data/exercises.json'

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
    console.warn('RapidAPI Key is missing. Using offline exercise data.')
    return fallbackExercises
  }

  try {
    const response = await fetch(`${BASE_URL}/exercises?limit=${limit}&offset=${offset}`, { headers: HEADERS })
    if (!response.ok) throw new Error('API fetch failed')
    return await response.json()
  } catch (error) {
    console.error('fetchExercises error:', error)
    return fallbackExercises
  }
}

export async function fetchExercisesByName(name, limit = 5) {
  if (!name.trim()) return []
  if (isApiKeyMissing) {
    const term = name.trim().toLowerCase()
    return fallbackExercises.filter(ex => ex.name.toLowerCase().includes(term)).slice(0, limit)
  }

  try {
    const encoded = encodeURIComponent(name.trim().toLowerCase())
    const response = await fetch(`${BASE_URL}/exercises/name/${encoded}?limit=${limit}&offset=0`, { headers: HEADERS })
    if (!response.ok) throw new Error('API fetch failed')
    return await response.json()
  } catch (error) {
    console.error('fetchExercisesByName error:', error)
    return fallbackExercises.filter(ex => ex.name.toLowerCase().includes(name.trim().toLowerCase())).slice(0, limit)
  }
}

export async function fetchExercisesByBodyPart(bodyPart, limit = 1500, offset = 0) {
  if (isApiKeyMissing) {
    return fallbackExercises.filter(ex => ex.bodyPart.toLowerCase() === bodyPart.toLowerCase())
  }

  try {
    const response = await fetch(`${BASE_URL}/exercises/bodyPart/${bodyPart}?limit=${limit}&offset=${offset}`, { headers: HEADERS })
    if (!response.ok) throw new Error('API fetch failed')
    return await response.json()
  } catch (error) {
    console.error('fetchExercisesByBodyPart error:', error)
    return fallbackExercises.filter(ex => ex.bodyPart.toLowerCase() === bodyPart.toLowerCase())
  }
}

export async function fetchBodyPartList() {
  if (isApiKeyMissing) {
    return [...new Set(fallbackExercises.map(ex => ex.bodyPart))].sort()
  }

  try {
    const response = await fetch(`${BASE_URL}/exercises/bodyPartList`, { headers: HEADERS })
    if (!response.ok) throw new Error('API fetch failed')
    return await response.json()
  } catch (error) {
    console.error('fetchBodyPartList error:', error)
    return [...new Set(fallbackExercises.map(ex => ex.bodyPart))].sort()
  }
}

export async function fetchEquipmentList() {
  if (isApiKeyMissing) {
    return [...new Set(fallbackExercises.map(ex => ex.equipment))].sort()
  }

  try {
    const response = await fetch(`${BASE_URL}/exercises/equipmentList`, { headers: HEADERS })
    if (!response.ok) throw new Error('API fetch failed')
    return await response.json()
  } catch (error) {
    console.error('fetchEquipmentList error:', error)
    return [...new Set(fallbackExercises.map(ex => ex.equipment))].sort()
  }
}

export async function fetchExercisesByEquipment(equipment, limit = 1500, offset = 0) {
  if (isApiKeyMissing) {
    return fallbackExercises.filter(ex => ex.equipment.toLowerCase() === equipment.toLowerCase())
  }

  try {
    const response = await fetch(`${BASE_URL}/exercises/equipment/${equipment}?limit=${limit}&offset=${offset}`, { headers: HEADERS })
    if (!response.ok) throw new Error('API fetch failed')
    return await response.json()
  } catch (error) {
    console.error('fetchExercisesByEquipment error:', error)
    return fallbackExercises.filter(ex => ex.equipment.toLowerCase() === equipment.toLowerCase())
  }
}

export async function fetchTargetList() {
  if (isApiKeyMissing) {
    return [...new Set(fallbackExercises.map(ex => ex.target))].sort()
  }

  try {
    const response = await fetch(`${BASE_URL}/exercises/targetList`, { headers: HEADERS })
    if (!response.ok) throw new Error('API fetch failed')
    return await response.json()
  } catch (error) {
    console.error('fetchTargetList error:', error)
    return [...new Set(fallbackExercises.map(ex => ex.target))].sort()
  }
}

export async function fetchExercisesByTarget(target, limit = 1500, offset = 0) {
  if (isApiKeyMissing) {
    return fallbackExercises.filter(ex => ex.target.toLowerCase() === target.toLowerCase())
  }

  try {
    const response = await fetch(`${BASE_URL}/exercises/target/${target}?limit=${limit}&offset=${offset}`, { headers: HEADERS })
    if (!response.ok) throw new Error('API fetch failed')
    return await response.json()
  } catch (error) {
    console.error('fetchExercisesByTarget error:', error)
    return fallbackExercises.filter(ex => ex.target.toLowerCase() === target.toLowerCase())
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
