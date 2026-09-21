# Project Guide: how the Recipe App works

This guide explains the code so you can walk through it in an interview. It covers the structure, every important file, the data flow, and ready-made answers to common questions.

## 1. Project structure

```
src/
├── components/            Reusable UI pieces
│   ├── Button/            One button style (button, router link or normal link)
│   ├── EmptyState/        "Nothing to show" message (no results, no favorites, 404)
│   ├── ErrorMessage/      "Something went wrong" message with a Try again button
│   ├── FavoriteButton/    The heart that adds or removes a favorite
│   ├── Hero/              Red banner on the home page (title, search, quick searches)
│   ├── Loading/           Spinner with a message
│   ├── Navbar/            Logo, search (on other pages), links to Home and Favorites
│   ├── RecipeCard/        One recipe: image, publisher, title, heart, details link
│   ├── RecipeImage/       Image with a placeholder when it fails to load
│   ├── RecipeList/        Grid of recipe cards (+ grey loading placeholder)
│   ├── SearchBar/         Search form (used in the hero and in the navbar)
│   ├── SectionHeader/     Title + subtitle row
│   ├── SuggestionChips/   Quick-search buttons (Pizza, Pasta, ...)
│   └── Toast/             Small notifications in the corner
├── context/
│   ├── RecipeContext.jsx  Shared state: search + favorites
│   └── ToastContext.jsx   Shared toast notifications
├── pages/                 One folder per route
│   ├── Home/              Home.jsx, SearchResults.jsx, PopularRecipes.jsx
│   ├── RecipeDetails/     RecipeDetails.jsx, IngredientList.jsx
│   ├── Favorites/         Favorites.jsx
│   └── NotFound/          NotFound.jsx
├── services/
│   └── recipeApi.js       All talking to the API (fetchRecipes, getRecipeDetails)
├── utils/
│   └── storage.js         localStorage for favorites (loadFavorites, saveFavorites)
├── config.js              Settings in one place (API URL, page size, storage key, ...)
├── App.jsx                Routes
├── main.jsx               Entry point, wraps the app in the providers
└── index.css              Tailwind + colour/animation settings
```

Rule of thumb used everywhere: **components show things, `services` talk to the API, `utils` handle the browser storage, `context` holds shared state.**

## 2. How the app works in one minute

1. `main.jsx` wraps the app in `BrowserRouter` (routing), `ToastProvider` and `RecipeProvider` (shared state).
2. `App.jsx` shows the `Navbar` on every page and one page below it, chosen by the URL.
3. On the home page the user types a search. `SearchBar` cleans and checks the text, then calls `handleSearch` from `RecipeContext`.
4. `handleSearch` calls `fetchRecipes` (in `services/recipeApi.js`), which asks the Forkify API, and stores the result in the `recipes` state.
5. `SearchResults` reads `recipes`, `loading` and `error` from the context and shows a skeleton, an error, "no results", or a grid of `RecipeCard`s.
6. Clicking a card goes to `/recipe-item/:id`. `RecipeDetails` reads the id from the URL and loads that one recipe.
7. The heart calls `toggleFavorite`. The favorites list is stored in state **and** saved to `localStorage`, so it is still there after a refresh.

## 3. File by file

### `src/context/RecipeContext.jsx`

**Purpose:** manages the state that several pages share: the search and the favorites.

**Important logic**
1. Stores `searchInput` (what is typed), `searchTerm` (what was searched), `recipes`, `loading` and `error`.
2. `handleSearch(term)` sets loading, calls the API inside `try / catch / finally`, stores the recipes or the error, and navigates to Home.
3. A `useRef` counter (`latestSearchNumber`) makes the app ignore the answer of an old search if a newer one has started.
4. Stores `favorites`, read from `localStorage` once on the first render.
5. `toggleFavorite(recipe)` adds or removes the recipe, saves the list with `saveFavorites`, and shows a toast.
6. Provides all of this to the app through `useRecipes()`.

**Interview explanation:** "This is my central state file. It holds the search results and the favorites so that the Navbar, Home and Favorites pages all see the same data. The API code and the localStorage code are in separate files, so this file only decides *when* to fetch and save."

### `src/context/ToastContext.jsx`

**Purpose:** lets any component show a small "Saved to favourites" style message.

**Important logic:** keeps an array of toasts in state. `showToast(message, icon)` adds one and uses `setTimeout` to remove it after 3 seconds. `ToastList` draws them.

**Interview explanation:** "I made toasts a separate context because they are a different concern from recipes. Any component calls `showToast` without knowing how toasts are drawn."

### `src/services/recipeApi.js`

**Purpose:** the only file that talks to the Forkify API.

**Important logic**
1. `fetchRecipes(searchTerm)` returns an array of recipes. `getRecipeDetails(id)` returns one recipe with ingredients.
2. `requestJson` calls `fetch` and turns every failure (no internet, 400/404, 5xx, bad JSON) into an `Error` with a readable message.
3. Responses are cleaned: recipes without an id or title are dropped, `&amp;` becomes `&`, image links change from `http` to `https`.
4. A small `Map` cache remembers answers for 5 minutes, so repeating a search does not call the API again.

**Interview explanation:** "I kept all API code in one service file so components never call `fetch` directly. It also checks the response before the UI uses it, because I don't want a strange API answer to crash the page."

### `src/utils/storage.js`

**Purpose:** saves and loads favorites in `localStorage`.

**Important logic:** `saveFavorites(list)` stores only what a card needs (id, title, publisher, image) as JSON. `loadFavorites()` reads it back. Everything is inside `try / catch`, so missing data, broken JSON or blocked storage just gives an empty list. Each saved entry is checked and duplicates are removed.

**Interview explanation:** "localStorage only stores text, so I use `JSON.stringify` to save and `JSON.parse` to load. I don't trust the stored data because a user or an older version could have changed it, so I check it and fall back to an empty list."

### `src/config.js`

**Purpose:** all the settings in one file: API URL, popular search word, results per page, storage key, cache time. **Interview explanation:** "No magic numbers in components. If I want 12 results per page I change one value."

### `src/main.jsx` and `src/App.jsx`

**Purpose:** `main.jsx` starts React and wraps the app in the providers. `App.jsx` defines the routes.

**Important logic:** the order of providers matters. `BrowserRouter` must be outside `RecipeProvider` (it uses `navigate`), and `ToastProvider` must be outside it too (it shows toasts). The `Navbar` sits outside `<Routes>` so it stays on every page.

**Interview explanation:** "The routes are `/`, `/recipe-item/:id`, `/favourite` and a `*` route for Not Found. Only the part under the navbar changes when the URL changes."

### `src/components/SearchBar/SearchBar.jsx`

**Purpose:** the search form, used in the hero (big, with a button) and in the navbar (small).

**Important logic:** on submit it calls `event.preventDefault()`, removes extra spaces, checks that the text is not empty or too long, shows a message if it is not valid, and otherwise calls `handleSearch`. Enter and the button both submit the form, so one function handles both.

**Interview explanation:** "The validation lives in the search bar because it is about the input. Once the text is valid, the search bar hands it to the context and doesn't care what happens next."

### `src/components/Hero/Hero.jsx` and `src/components/Navbar/Navbar.jsx`

**Purpose:** the hero is the banner with the search and quick-search chips. The navbar is the top bar with the logo, links and the favorites count.

**Important logic:** the hero shrinks after a search so results are visible without scrolling. The navbar hides its search on the home page (the hero already has one) and uses `NavLink` so the current page is highlighted. On small screens the navbar wraps, so no hamburger menu is needed.

**Interview explanation:** "I used `useLocation` to know which page I'm on, and `NavLink` for active styling. The badge next to Favourite is just `favorites.length` from the context."

### `src/pages/Home/` (`Home.jsx`, `SearchResults.jsx`, `PopularRecipes.jsx`)

**Purpose:** the home page. Before a search it shows popular recipes, after a search it shows the results.

**Important logic:** `Home` checks `searchTerm`. `SearchResults` handles four cases in order: loading (skeleton), error (message + Try again), no results (empty state with suggestions), results (grid + "Show more"). Results are shown 24 at a time. `PopularRecipes` loads its own data with `useEffect`, because only this page needs it.

**Interview explanation:** "I split the page by responsibility. `SearchResults` is only about showing search state, `PopularRecipes` fetches its own list. Each one checks loading, then error, then empty, then data, so the UI never shows something half-loaded."

### `src/pages/RecipeDetails/RecipeDetails.jsx`

**Purpose:** shows one recipe: image, publisher, cooking time, servings, ingredients, a Save button and a link to the full directions.

**Important logic:** `useParams` gives the id from the URL. A `useEffect` with `[id, retryCount]` as dependencies loads the recipe (again if the id changes or the user clicks Try again). An `isCancelled` flag stops a late answer from updating a page that has already been left.

**Interview explanation:** "The recipe details are local state because no other page needs them. The effect depends on the id, so if the URL changes it loads the new recipe. Because the id is in the URL, a recipe page can be opened directly or bookmarked."

### `src/pages/Favorites/Favorites.jsx` and `NotFound.jsx`

**Purpose:** the favorites page lists saved recipes, or an empty state. `NotFound` is the page for unknown URLs.

**Interview explanation:** "Favorites reads the list from context and reuses the same `RecipeList` as the search results, so the cards look and behave the same."

### `RecipeList`, `RecipeCard`, `FavoriteButton`, `RecipeImage`

**Purpose:** `RecipeList` lays cards out in a responsive grid. `RecipeCard` shows one recipe. `FavoriteButton` is the heart. `RecipeImage` shows a placeholder if the image is missing or broken.

**Important logic:** `FavoriteButton` asks the context `isFavorite(recipe.id)` to choose a filled or empty heart, and calls `toggleFavorite(recipe)` on click. Images use `loading="lazy"`.

**Interview explanation:** "The card only receives a `recipe`. The heart gets its own state from the context, so I don't pass favorite functions down through every component."

### `Button`, `EmptyState`, `ErrorMessage`, `Loading`, `SectionHeader`, `SuggestionChips`, `Toast/ToastList`

**Purpose:** small reusable pieces so the same look and messages are used everywhere. For example `Button` has three variants (primary, secondary, link) and renders a `Link`, an `<a>` or a `<button>` depending on the props.

**Interview explanation:** "I made these components because each one is used in several places. It keeps the design consistent, and a change in one file updates the whole app."

## 4. Functionality explained

- **Search:** the user types in `SearchBar`. Spaces are cleaned, empty or over-long text is rejected with a message, and valid text goes to `handleSearch`. Chips and the Search button use the same function.
- **API:** `fetchRecipes` calls `GET /recipes?search=term`. `getRecipeDetails` calls `GET /recipes/:id`. Both are in `recipeApi.js`.
- **Recipe listing:** `recipes` in the context is shown by `RecipeList` as cards, 24 at a time.
- **Recipe details:** loaded from the id in the URL. It shows the ingredients and a link to the original directions. (The Forkify API does not include the cooking steps, only a link to the source page.)
- **Favorites:** `toggleFavorite` adds or removes a recipe. The heart, the navbar count and the Favorites page all read the same `favorites` array.
- **LocalStorage:** every favorite change is saved with `saveFavorites`, and the list is loaded once on start with `loadFavorites`.
- **Context:** `RecipeContext` (search + favorites) and `ToastContext` (notifications).
- **Routing:** React Router: `Route` per page, `Link`/`NavLink` for navigation, `useParams` for the recipe id, `useNavigate` to go Home after a search, `*` for Not Found.
- **Loading:** grey skeleton cards for lists, a spinner for the details page.
- **Error handling:** every request uses `try / catch / finally`. The message is shown with a Try again button. Empty results and bad recipe ids have their own messages.

## 5. Data flow

**Search**

```
User types and presses Enter (or clicks Search / a chip)
        ↓
SearchBar  (cleans and validates the text)
        ↓
handleSearch(term)          in RecipeContext
        ↓
fetchRecipes(term)          in services/recipeApi.js  → Forkify API
        ↓
setRecipes(...)  / setError(...)  / setLoading(false)
        ↓
RecipeContext value changes
        ↓
SearchResults  (loading? error? empty? results?)
        ↓
RecipeList
        ↓
RecipeCard (one per recipe)
```

**Favorites**

```
RecipeCard
      ↓
FavoriteButton (click)
      ↓
toggleFavorite(recipe)       in RecipeContext
      ↓
setFavorites(updatedList)  +  saveFavorites(updatedList)
      ↓                                   ↓
Navbar count, hearts, Favorites page     localStorage
                                          ↓
                          page refresh → loadFavorites() → favorites state
```

**Recipe details**

```
Click "Recipe details"  →  URL /recipe-item/:id
        ↓
RecipeDetails  →  useParams() gives the id
        ↓
useEffect  →  getRecipeDetails(id)  → API
        ↓
local state: recipe / loading / error
        ↓
image, ingredients, Save button
```

## 6. Interview answers

**1. How does your Recipe App work?**
"It's a React app where you search for recipes using the Forkify API, open a recipe to see its ingredients, and save favorites. The shared state, the search results and the favorites, lives in a Context. The favorites are also saved in localStorage so they are still there after a refresh. React Router handles the pages: Home, Recipe Details, Favorites and a Not Found page."

**2. How do you fetch recipes?**
"I have a service file, `recipeApi.js`, with a `fetchRecipes` function that calls the API with `fetch` and `async/await`. The context calls that function, so components never call the API directly. The function checks the response and throws a clear error if something is wrong."

**3. How does search work?**
"The `SearchBar` cleans the text and checks it is not empty. Then it calls `handleSearch` from the context. `handleSearch` saves the search term, sets loading, fetches the recipes, and stores them in state. The Home page re-renders and shows the results. The same function is used by the Search button, the Enter key and the quick-search chips."

**4. Why did you use Context API?**
"The Navbar, the Home page and the Favorites page all need the favorites, and several components need the search state. Without Context I would pass props through many levels. I kept it simple: one `RecipeContext` for search and favorites, and data used by only one page, like the recipe details, stays local to that page."

**5. How do favorites work?**
"Favorites are an array in the context. `toggleFavorite` checks if the recipe is already in the array. If it is, it removes it, otherwise it adds it. Then it updates the state, saves to localStorage and shows a toast. The heart, the navbar count and the Favorites page all read the same array, so they update together."

**6. How did you persist favorites?**
"With localStorage. Whenever the favorites change I save them as JSON. When the app starts, I read them back to set the initial state, so nothing is lost on refresh."

**7. How does localStorage work in your project?**
"I have two functions in `utils/storage.js`: `saveFavorites` uses `JSON.stringify` and `localStorage.setItem`, and `loadFavorites` uses `getItem` and `JSON.parse`. localStorage only stores strings, so the JSON step is needed. Both are wrapped in `try / catch`, and loading checks the data, so a missing or corrupted value gives an empty list instead of crashing."

**8. How does React Router work in your application?**
"`BrowserRouter` wraps the app. In `App.jsx`, `Routes` and `Route` connect a URL to a page: `/` to Home, `/recipe-item/:id` to Recipe Details, `/favourite` to Favorites, and `*` to Not Found. `Link` and `NavLink` navigate without reloading the page. `useParams` reads the recipe id from the URL, and `useNavigate` sends the user to Home after a search."

**Bonus: Why is the recipe id in the URL?**
"So the page can be refreshed, bookmarked or shared. The page loads the recipe from the id instead of relying on data passed from the previous page."

**9. How do you handle API errors?**
"Every API call is in `try / catch / finally`. The service turns problems into readable messages: no internet, a bad request, a server error, or a strange response. The context stores the message in an `error` state, and the UI shows an error message with a Try again button. Empty results are handled separately with a 'No recipes found' message."

**10. How do you handle loading states?**
"I have a `loading` state that is set to true before the request and false in `finally`, so it always turns off, even after an error. For lists I show grey skeleton cards, and for the details page a spinner."

**11. How did you make the application responsive?**
"I used Tailwind's mobile-first classes. The recipe grid goes from 1 column on phones to 2, 3 and 4 columns as the screen gets wider. The navbar wraps on small screens, and the hero search stacks vertically on phones. I tested it from 320px to 1440px and there is no horizontal scrolling."

**12. What challenges did you face?**
"Four things. First, if you search twice quickly, the first answer can arrive after the second, so I ignore old answers with a counter. Second, the API returns text like `&amp;` and `http` image links, so I clean them in the service. Third, a disabled search button also stopped the Enter key, so I don't disable it. Fourth, localStorage data can be missing or broken, so loading it is defensive."

**13. What would you improve in the future?**
"Add automated tests with Vitest and React Testing Library. Move the typed search text out of the shared context, so typing doesn't re-render the recipe cards. Sync favorites between tabs. Add TypeScript. Add a way to filter or sort results, and deploy it with a public link."

## 7. Decisions worth knowing

- **Spelling:** the code uses "favorite" (American), while the text on screen and the URL `/favourite` use "favourite" (British). This was kept so the UI and existing links did not change. The localStorage key (`recipe-app:favourites`) is also unchanged so already-saved favorites are not lost.
- **Typed search text is in the context.** This is simple and lets the hero and navbar share it, but it means the recipe cards re-render on every keystroke (24 small components, not noticeable). If the list ever gets heavy, move the text into `SearchBar`.
- **No `useMemo`, `useCallback` or `memo`.** With 24 cards per page they are not needed, and leaving them out keeps the code easier to read and explain.
- **Two `useEffect`s only**, both for loading data (`PopularRecipes` and `RecipeDetails`). Everything else happens in event handlers.
