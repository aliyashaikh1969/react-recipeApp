import { API_BASE_URL, CACHE_MINUTES } from '../config'

// ---------- Small helpers ----------

const isFilledString = (value) => typeof value === 'string' && value.trim() !== ''

// The API sends text like "Salt &amp; pepper". React prints text as-is, so we turn
// these HTML entities back into normal characters before showing them.
const HTML_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

const decodeHtmlEntities = (text) =>
    text.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (match, entity) => {
        if (entity[0] === '#') {
            const isHex = entity[1].toLowerCase() === 'x'
            const codePoint = parseInt(entity.slice(isHex ? 2 : 1), isHex ? 16 : 10)
            return codePoint > 0 && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match
        }
        return HTML_ENTITIES[entity.toLowerCase()] ?? match
    })

// The API serves images over http, which browsers block on https pages.
const toHttps = (url) => (typeof url === 'string' ? url.replace(/^http:\/\//, 'https://') : '')

// ---------- Cache ----------
// Remembers answers for a few minutes, so repeating a search or reopening a recipe
// does not call the API again. Failed requests are never saved.

const cache = new Map()
const CACHE_MILLISECONDS = CACHE_MINUTES * 60 * 1000

const getFromCache = (key) => {
    const saved = cache.get(key)
    const isFresh = saved && Date.now() - saved.savedAt < CACHE_MILLISECONDS
    return isFresh ? saved.data : null
}

// ---------- Talking to the API ----------

// Requests one URL and returns the parsed JSON.
// Throws an Error with a message that is safe to show to the user.
const requestJson = async (path) => {
    let response
    try {
        response = await fetch(`${API_BASE_URL}${path}`)
    } catch {
        throw new Error('Could not reach the recipe service. Check your internet connection and try again.')
    }

    let body = null
    try {
        body = await response.json()
    } catch {
        // The body was not JSON. This is handled below.
    }

    if (!response.ok) {
        const isClientError = response.status === 400 || response.status === 404
        if (isClientError) throw new Error(body?.message ? `Recipe service: ${body.message}.` : 'That request was not valid.')
        throw new Error(`The recipe service had a problem (error ${response.status}). Please try again later.`)
    }
    if (!body || body.status === 'fail') {
        throw new Error('The recipe service sent an unexpected response.')
    }
    return body
}

// Converts one recipe from the API into the shape the app uses.
const cleanRecipeSummary = (recipe) => ({
    id: recipe.id,
    title: decodeHtmlEntities(recipe.title.trim()),
    publisher: isFilledString(recipe.publisher) ? decodeHtmlEntities(recipe.publisher) : 'Unknown publisher',
    image_url: toHttps(recipe.image_url),
})

// ---------- Public functions ----------

// Searches recipes by keyword.
// Expects: a search term such as "pasta".
// Returns: an array of recipes: [{ id, title, publisher, image_url }]. The array is empty when nothing matches.
export const fetchRecipes = async (searchTerm) => {
    // The API ignores letter case, so "Pizza" and "pizza" share one cache entry.
    const cacheKey = `search:${searchTerm.toLowerCase()}`
    const cachedRecipes = getFromCache(cacheKey)
    if (cachedRecipes) return cachedRecipes

    const body = await requestJson(`/recipes?search=${encodeURIComponent(searchTerm)}`)

    if (!Array.isArray(body.data?.recipes)) {
        throw new Error('The recipe service sent an unexpected response.')
    }

    // Skip anything without an id and title, because the UI cannot show it properly.
    const recipes = body.data.recipes
        .filter((recipe) => recipe && isFilledString(recipe.id) && isFilledString(recipe.title))
        .map(cleanRecipeSummary)

    cache.set(cacheKey, { data: recipes, savedAt: Date.now() })
    return recipes
}

// Loads one recipe with its ingredients.
// Expects: a recipe id from the URL.
// Returns: { id, title, publisher, image_url, cooking_time, servings, source_url, ingredients }.
export const getRecipeDetails = async (id) => {
    const cacheKey = `recipe:${id}`
    const cachedRecipe = getFromCache(cacheKey)
    if (cachedRecipe) return cachedRecipe

    const body = await requestJson(`/recipes/${encodeURIComponent(id)}`)
    const recipe = body.data?.recipe

    if (!recipe || !isFilledString(recipe.id) || !isFilledString(recipe.title)) {
        throw new Error('This recipe could not be found.')
    }

    const ingredients = Array.isArray(recipe.ingredients)
        ? recipe.ingredients
            .filter((ingredient) => ingredient && isFilledString(ingredient.description))
            .map((ingredient) => ({ ...ingredient, description: decodeHtmlEntities(ingredient.description) }))
        : []

    const details = {
        ...cleanRecipeSummary(recipe),
        cooking_time: Number(recipe.cooking_time) || null,
        servings: Number(recipe.servings) || null,
        // Only allow real web links, so nothing unexpected ends up in an <a href>.
        source_url: /^https?:\/\//.test(recipe.source_url) ? recipe.source_url : '',
        ingredients,
    }

    cache.set(cacheKey, { data: details, savedAt: Date.now() })
    return details
}
