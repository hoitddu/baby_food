import { Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, Settings, Heart } from 'lucide-react'
import './bottomNav.css'

function BottomNav() {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: '홈' },
    { path: '/meal-planner', icon: BookOpen, label: '기록' },
    { path: '/favorites', icon: Heart, label: '찜' },
    { path: '/settings', icon: Settings, label: '설정' }
  ]

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path

        return (
          <Link key={item.path} to={item.path} className={`bottom-nav-item ${isActive ? 'active' : ''}`}>
            <item.icon
              size={26}
              strokeWidth={isActive ? 2.5 : 2}
              fill={item.path === '/favorites' && isActive ? 'currentColor' : 'none'}
            />
            <span className="bottom-nav-label">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default BottomNav
