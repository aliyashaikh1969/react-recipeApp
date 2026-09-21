import { FAVORITES_STORAGE_KEY } from '../config'

// Keeps only the fields the app needs. Returns null when the entry is unusable.
// Stored data can be edited by hand or come from an older version, so it is never trusted blindly.
const cleanRecipe = (entry) => {
    if (!entry || typeof entry.id !== 'string' || typeof entry.title !== 'string') return null
    if (entry.id.trim() === '' || entry.title.trim() === '') return null

    return {
        id: entry.id,
        title: entry.title,
        publisher: typeof entry.publisher === 'string' ? entry.publisher : '',
        image_url: typeof entry.image_url === 'string' ? entry.image_url : '',
    }
}

// Reads the saved favorites from localStorage.
// Returns an array of recipes. Returns [] if nothing is saved, the JSON is broken, or storage is blocked.
export const loadFavorites = () => {
    try {
        const savedText = localStorage.getItem(FAVORITES_STORAGE_KEY)
        if (savedText === null) return []

        const savedList = JSON.parse(savedText)
        if (!Array.isArray(savedList)) return []

        // Clean every entry and drop duplicates, so the rest of the app can trust the list.
        const seenIds = new Set()
        const favorites = []
        savedList.forEach((entry) => {
            const recipe = cleanRecipe(entry)
            if (recipe && !seenIds.has(recipe.id)) {
                seenIds.add(recipe.id)
                favorites.push(recipe)
            }
        })
        return favorites
    } catch {
        // localStorage can throw (private mode, blocked by the browser) and JSON.parse can throw (broken data).
        return []
    }
}

// Saves the favorites list to localStorage so it is still there after a page refresh.
// Only the fields a recipe card needs are stored, not the whole recipe.
export const saveFavorites = (favorites) => {
    try {
        const cardData = favorites.map(cleanRecipe).filter(Boolean)
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(cardData))
    } catch {
        // Storage is full or blocked. Favorites still work until the page is closed.
    }
}
