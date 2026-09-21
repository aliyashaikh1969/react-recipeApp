# Food Recipe

A responsive recipe browser built with React. Search thousands of recipes, open one to see its ingredients and cooking details, and save your favourites so they are still there the next time you visit.

Recipe data comes from the public [Forkify API](https://forkify-api.herokuapp.com/v2). It needs no account or API key.

![Home page with the search hero and popular recipes](docs/screenshots/home.jpg)

## Screenshots

### Desktop

| Search results | Recipe details |
| :---: | :---: |
| ![Search results for "pasta"](docs/screenshots/search-results.jpg) | ![Recipe details with ingredients](docs/screenshots/recipe-details.jpg) |
| **Search results.** A result count, 24 recipes per page, and a heart on every card. | **Recipe details.** Cooking time, servings, ingredients and a link to the full directions. |

| Favourites | Empty state |
| :---: | :---: |
| ![Saved favourites](docs/screenshots/favourites.jpg) | ![No recipes found state with suggestions](docs/screenshots/no-results.jpg) |
| **Favourites.** Saved in the browser and shown with a count in the navbar. | **No results.** A helpful message with quick searches to try instead. |

### Mobile

<p>
  <img src="docs/screenshots/mobile-home.jpg" alt="Home page on a phone" width="260">
  &nbsp;&nbsp;
  <img src="docs/screenshots/mobile-results.jpg" alt="Search results on a phone" width="260">
</p>

## Features

**Finding recipes**
- Search by keyword, with **Enter** or the **Search** button
- Quick-search chips (Pizza, Pasta, Chicken, ...) for one-click searching
- A **Popular recipes** section on the home page before you search
- Input is cleaned up (extra spaces trimmed), and empty or over-long searches are rejected with a clear message
- Results show how many recipes were found, 24 at a time, with **Show more** for the rest

**Recipes and favourites**
- Recipe page with image, publisher, cooking time, servings, ingredient list and a link to the original directions
- Heart button on every card and on the recipe page to save or remove a favourite
- Favourites are stored in `localStorage`, so they survive a page refresh
- Toast notifications confirm each save and removal

**Polish and reliability**
- Loading skeletons while recipes load
- Friendly empty states (no results, no favourites) that suggest what to do next
- Clear error messages with a **Try again** button when the network or the API fails
- A "Page not found" page for unknown URLs
- Placeholder image when a recipe image is missing or fails to load
- Responsive layout from phones to wide desktops
- Accessible by design: labelled controls, visible keyboard focus, screen-reader announcements for errors, and reduced-motion support

**Performance**
- Images are lazy-loaded
- API results are cached for 5 minutes, so repeat searches and revisited recipes load instantly
- If you start a new search before the last one finishes, the old answer is ignored
- Only 24 results are rendered at a time, so even a search with hundreds of matches stays fast

## Technologies used

| Technology | Used for |
| --- | --- |
| [React 19](https://react.dev) | UI, hooks and context for state |
| [Vite 6](https://vite.dev) | Dev server and production build |
| [React Router 7](https://reactrouter.com) | Client-side routing |
| [Tailwind CSS 4](https://tailwindcss.com) | Styling, with a small set of design tokens in `index.css` |
| [React Icons](https://react-icons.github.io/react-icons/) | Icons |
| [Forkify API](https://forkify-api.herokuapp.com/v2) | Recipe data |
| [ESLint](https://eslint.org) | Linting (React Hooks and React Refresh rules) |
| Browser `localStorage` | Saving favourites |

## Getting started

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

| Script            | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start the dev server         |
| `npm run build`   | Build for production         |
| `npm run preview` | Preview the production build |
| `npm run lint`    | Run ESLint                   |

## Project structure

```
src/
├── components/         Reusable UI pieces
│   ├── Button/         One button style (button, router link or normal link)
│   ├── EmptyState/     "Nothing to show" message
│   ├── ErrorMessage/   "Something went wrong" message with Try again
│   ├── FavoriteButton/ Heart that adds or removes a favorite
│   ├── Hero/           Banner with the search on the home page
│   ├── Loading/        Spinner with a message
│   ├── Navbar/         Logo, search (on other pages), links
│   ├── RecipeCard/     One recipe card
│   ├── RecipeImage/    Image with placeholder fallback
│   ├── RecipeList/     Grid of cards (+ loading placeholder)
│   ├── SearchBar/      Search form (hero and navbar)
│   ├── SectionHeader/  Title + subtitle row
│   ├── SuggestionChips/ Quick-search buttons
│   └── Toast/          Notification list
├── context/
│   ├── RecipeContext.jsx  Shared state: search and favorites
│   └── ToastContext.jsx   Toast notifications
├── pages/
│   ├── Home/           Home, search results, popular recipes
│   ├── RecipeDetails/  Single recipe
│   ├── Favorites/      Saved recipes
│   └── NotFound/       Unknown URLs
├── services/recipeApi.js  All API calls, error handling, response cleaning, 5-minute cache
├── utils/storage.js       Safe localStorage read/write for favorites
├── config.js           API URL, page size and other settings
├── App.jsx             Routes
├── main.jsx            Entry point and providers
└── index.css           Tailwind import and design tokens (colours, shape, motion)
docs/
├── PROJECT_GUIDE.md    How the code works, data flow, interview answers
└── screenshots/        Images used in this README
```

For a file-by-file explanation, the data flow and interview answers, see the [Project Guide](docs/PROJECT_GUIDE.md).

## Configuration

Settings such as the API base URL, page size and popular-recipes search word live in [src/config.js](src/config.js). No secrets or API keys are used, so there is no `.env` file to set up.

## Notes

- Favourites are saved in the browser's `localStorage` (key `recipe-app:favourites`). Only what the cards need is stored (id, title, publisher, image). Missing, corrupted or blocked storage is handled by starting with an empty list. See [src/utils/storage.js](src/utils/storage.js).
- Favourites are per browser: they are not shared between devices or synced between open tabs.
- The Forkify API has no "trending" endpoint, so the Popular recipes section shows the results of a fixed search (`POPULAR_SEARCH_TERM` in `config.js`).
