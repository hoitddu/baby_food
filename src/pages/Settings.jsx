function Settings({ preferences, setPreferences, age, setAge }) {

    const togglePref = (key) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const allergies = [
        { key: 'dairy', label: 'Dairy', icon: '🥛', desc: '우유, 치즈, 요거트' },
        { key: 'eggs', label: 'Eggs', icon: '🥚', desc: '계란, 난황, 난백' },
        { key: 'peanuts', label: 'Peanuts', icon: '🥜', desc: '땅콩' },
        { key: 'treeNuts', label: 'Tree Nuts', icon: '🌰', desc: '호두, 아몬드' },
        { key: 'wheat', label: 'Wheat', icon: '🍞', desc: '밀가루, 빵, 국수' },
        { key: 'soy', label: 'Soy', icon: '🌱', desc: '두부, 콩, 간장, 두유' },
        { key: 'fish', label: 'Fish', icon: '🐟', desc: '생선' },
    ]

    return (
        <div className="page-content" style={{ padding: '0 24px 100px', background: '#FAFAF8', minHeight: '100vh' }}>
            <header className="app-header">
                <h2>⚙️ Preferences</h2>
                <p style={{ color: '#8D6E63' }}>우리 아기 맞춤 설정</p>
            </header>

            <div className="section" style={{ marginTop: '20px' }}>
                <h3 style={{ color: '#FF8A65', marginBottom: '15px' }}>🚫 Allergies (제외할 재료)</h3>
                <div style={{ background: 'white', borderRadius: '20px', padding: '10px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                    {allergies.map(item => (
                        <div
                            key={item.key}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '15px 0',
                                borderBottom: item.key !== 'fish' ? '1px solid #F5F5F5' : 'none'
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '1rem', color: '#5D4037', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span>{item.icon}</span> {item.label}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: '#BCAAA4', marginTop: '4px', marginLeft: '34px' }}>
                                    {item.desc} 포함
                                </span>
                            </div>

                            {/* Custom Toggle Switch */}
                            <div
                                onClick={() => togglePref(item.key)}
                                style={{
                                    width: '50px',
                                    height: '28px',
                                    background: preferences[item.key] ? '#FFAB40' : '#E0E0E0',
                                    borderRadius: '14px',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    transition: 'background 0.3s'
                                }}
                            >
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    background: 'white',
                                    borderRadius: '50%',
                                    position: 'absolute',
                                    top: '2px',
                                    left: preferences[item.key] ? '24px' : '2px',
                                    transition: 'left 0.3s',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Settings
