import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import RecipeDetail from './pages/RecipeDetail'
import MealPlanner from './pages/MealPlanner'
import Settings from './pages/Settings'
import Favorites from './pages/Favorites'
import Onboarding from './pages/Onboarding'
import BottomNav from './components/BottomNav'
import { useProfile, useFavorites, useMealPlan } from './hooks'
import './App.css'

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
  const { profile, preferences, setPreferences, completeOnboarding } = useProfile()
  const { favorites, toggleFavorite } = useFavorites()
  const { mealPlan, setMealPlan, addMealToHistory } = useMealPlan()

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(!profile)

  // Handle onboarding completion
  const handleOnboardingComplete = (data) => {
    completeOnboarding(data)
    setShowOnboarding(false)
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home preferences={preferences} profile={profile} favorites={favorites} toggleFavorite={toggleFavorite} />} />
          <Route path="/recipe/:id" element={<RecipeDetail favorites={favorites} toggleFavorite={toggleFavorite} addMealToHistory={addMealToHistory} />} />
          <Route path="/meal-planner" element={<MealPlanner mealPlan={mealPlan} setMealPlan={setMealPlan} />} />
          <Route path="/favorites" element={<Favorites favorites={favorites} toggleFavorite={toggleFavorite} preferences={preferences} />} />
          <Route path="/settings" element={<Settings preferences={preferences} setPreferences={setPreferences} age={null} />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
