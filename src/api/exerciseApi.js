import axios from 'axios'
import fallbackExercises from '../data/exercises.json'

const BASE_URL = 'https://exercisedb.p.rapidapi.com'
const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY
const API_HOST = import.meta.env.VITE_RAPIDAPI_HOST

const isApiKeyMissing = !API_KEY || API_KEY === 'your_rapidapi_key_here'

// Pre-configured axios instance — all requests share the same baseURL and auth headers
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': API_HOST,
  },
})

export async function fetchExercises(limit = 1500, offset = 0) {
  if (isApiKeyMissing) {
    console.warn('RapidAPI Key is missing. Using offline exercise data.')
    return fallbackExercises
  }

  try {
    const { data } = await apiClient.get('/exercises', { params: { limit, offset } })
    return data
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
    const { data } = await apiClient.get(`/exercises/name/${encoded}`, { params: { limit, offset: 0 } })
    return data
  } catch (error) {
    console.error('fetchExercisesByName error:', error)
    return fallbackExercises
      .filter(ex => ex.name.toLowerCase().includes(name.trim().toLowerCase()))
      .slice(0, limit)
  }
}

export async function fetchExercisesByBodyPart(bodyPart, limit = 1500, offset = 0) {
  if (isApiKeyMissing) {
    return fallbackExercises.filter(ex => ex.bodyPart.toLowerCase() === bodyPart.toLowerCase())
  }

  try {
    const { data } = await apiClient.get(`/exercises/bodyPart/${bodyPart}`, { params: { limit, offset } })
    return data
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
    const { data } = await apiClient.get('/exercises/bodyPartList')
    return data
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
    const { data } = await apiClient.get('/exercises/equipmentList')
    return data
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
    const { data } = await apiClient.get(`/exercises/equipment/${equipment}`, { params: { limit, offset } })
    return data
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
    const { data } = await apiClient.get('/exercises/targetList')
    return data
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
    const { data } = await apiClient.get(`/exercises/target/${target}`, { params: { limit, offset } })
    return data
  } catch (error) {
    console.error('fetchExercisesByTarget error:', error)
    return fallbackExercises.filter(ex => ex.target.toLowerCase() === target.toLowerCase())
  }
}

/**
 * Returns the GIF image as a local Blob URL.
 * Uses responseType: 'blob' so axios returns binary data directly.
 * Required because the RapidAPI /image endpoint sends Cross-Origin-Resource-Policy: same-origin,
 * which blocks direct <img src="..."> loading from a browser.
 */
export async function fetchExerciseGif(exerciseId) {
  if (isApiKeyMissing) return null

  try {
    const { data } = await apiClient.get('/image', {
      params: { exerciseId, resolution: 180 },
      responseType: 'blob',
    })
    return URL.createObjectURL(data)
  } catch (error) {
    console.error('fetchExerciseGif error:', error)
    return null
  }
}

export default {
  fetchExercises,
  fetchExercisesByBodyPart,
  fetchBodyPartList,
  fetchExerciseGif,
}
