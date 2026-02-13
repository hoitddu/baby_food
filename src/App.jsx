import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import LoadingSpinner from './components/LoadingSpinner'
import { useProfile, useFavorites, useMealPlan } from './hooks'
import './App.css'

const Home = lazy(() => import('./pages/Home'))
const RecipeDetail = lazy(() => import('./pages/RecipeDetail'))
const MealPlanner = lazy(() => import('./pages/MealPlanner'))
const Settings = lazy(() => import('./pages/Settings'))
const Favorites = lazy(() => import('./pages/Favorites'))
const Onboarding = lazy(() => import('./pages/Onboarding'))

function PageFallback() {
  return (
    <div className="page-content" style={{ padding: '40px 24px' }}>
      <LoadingSpinner centered={true} />
    </div>
  )
}

function Layout({ children }) {
  const location = useLocation()
  const showNav = !location.pathname.startsWith('/recipe/')

  return (
    <div className="app-container">
      {children}
      {showNav && <BottomNav />}
    </div>
  )
}

function App() {
  // Custom Hooks for state management
  const { profile, hasCompletedOnboarding, preferences, setPreferences, completeOnboarding, resetProfile } = useProfile()
  const { favorites, toggleFavorite } = useFavorites()
  const { mealPlan, removeMeal, addMealToHistory } = useMealPlan()

  // Handle onboarding completion
  const handleOnboardingComplete = (data) => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.replaceState({}, '', '/')
    }
    completeOnboarding(data)
  }

  if (!hasCompletedOnboarding) {
    return (
      <Suspense fallback={<PageFallback />}>
        <Onboarding onComplete={handleOnboardingComplete} />
      </Suspense>
    )
  }

  return (
    <Router>
      <Layout>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home preferences={preferences} profile={profile} favorites={favorites} toggleFavorite={toggleFavorite} />} />
            <Route path="/recipe/:id" element={<RecipeDetail favorites={favorites} toggleFavorite={toggleFavorite} addMealToHistory={addMealToHistory} />} />
            <Route path="/meal-planner" element={<MealPlanner mealPlan={mealPlan} removeMeal={removeMeal} />} />
            <Route path="/favorites" element={<Favorites favorites={favorites} toggleFavorite={toggleFavorite} preferences={preferences} />} />
            <Route path="/settings" element={<Settings preferences={preferences} setPreferences={setPreferences} resetProfile={resetProfile} />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  )
}

export default App
