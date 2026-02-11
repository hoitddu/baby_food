import { Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, Settings, Heart } from 'lucide-react'

function BottomNav() {
    const location = useLocation()

    const navItems = [
        { path: '/', icon: Home, label: '홈' },
        { path: '/meal-planner', icon: BookOpen, label: '기록' }, // Changed Icon and Label
        { path: '/favorites', icon: Heart, label: '찜' },
        { path: '/settings', icon: Settings, label: '설정' },
    ]

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            paddingTop: '10px',
            paddingBottom: 'calc(10px + env(safe-area-inset-bottom))',
            display: 'flex',
            justifyContent: 'space-around',
            zIndex: 1000,
            maxWidth: '480px',
            margin: '0 auto',
            width: '100%'
        }}>
            {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                    <Link key={item.path} to={item.path} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: isActive ? '#FFAB40' : '#D7CCC8', flex: 1 }}>
                        <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} fill={item.label === '찜' && isActive ? '#FFAB40' : 'none'} />
                        <span style={{ fontSize: '0.75rem', fontWeight: isActive ? '600' : '400' }}>{item.label}</span>
                    </Link>
                )
            })}
        </nav>
    )
}

export default BottomNav
