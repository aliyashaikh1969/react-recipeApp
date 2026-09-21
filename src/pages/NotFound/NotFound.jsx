import { LuCompass } from 'react-icons/lu'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import { Button } from '../../components/Button/Button'

// Shown for any URL that does not match a route.
export const NotFound = () => (
  <>
    <title>Page not found | Food Recipe</title>
    <EmptyState
      icon={<LuCompass />}
      title="Page not found"
      message="We couldn't find the page you were looking for. It may have moved, or the link is mistyped."
    >
      <Button to="/">Back to home</Button>
    </EmptyState>
  </>
)
