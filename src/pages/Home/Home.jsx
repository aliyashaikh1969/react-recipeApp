import { useRecipes } from '../../context/RecipeContext'
import { Hero } from '../../components/Hero/Hero'
import { SearchResults } from './SearchResults'
import { PopularRecipes } from './PopularRecipes'

// Before a search the page shows popular recipes. After a search it shows the results.
export const Home = () => {
  const { searchTerm } = useRecipes()

  return (
    <div className="container mx-auto py-8">
      <title>Food Recipe | Search and save recipes</title>
      <Hero />
      <section className="py-12">{searchTerm ? <SearchResults /> : <PopularRecipes />}</section>
    </div>
  )
}
