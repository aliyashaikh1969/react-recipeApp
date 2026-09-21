// App-wide settings. Change values here instead of searching through components.

export const API_BASE_URL = 'https://forkify-api.herokuapp.com/api/v2'

// The API has no "trending" endpoint, so the Popular section shows the results of this search.
export const POPULAR_SEARCH_TERM = 'pizza'
export const POPULAR_RECIPE_COUNT = 8

// Search results are shown this many at a time; "Show more" reveals the next batch.
export const RESULTS_PER_PAGE = 24

export const MAX_SEARCH_LENGTH = 100

// Quick-search buttons shown in the hero and in empty states.
export const SUGGESTED_SEARCHES = ['Pizza', 'Pasta', 'Chicken', 'Salad', 'Burger', 'Cake']

// Keep this key unchanged, otherwise people lose the favorites they already saved.
export const FAVORITES_STORAGE_KEY = 'recipe-app:favourites'

// How long API responses are reused before asking the API again.
export const CACHE_MINUTES = 5

export const TOAST_SECONDS = 3
