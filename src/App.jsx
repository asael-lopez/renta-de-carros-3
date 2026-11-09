
import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Fleet } from './pages/Fleet';
import { Dashboard } from './pages/Dashboard';
import { Reports } from './pages/Reports';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Favorites } from './pages/Favorites';
import { Clients } from './pages/Clients';

function AppContent() {
    const getTabFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('tab') || 'dashboard';
    };

    const [activeTab, setActiveTab] = useState(getTabFromUrl);

    const { currentUser, login, register, logout } = useApp();

    useEffect(() => {
        const handleLocationChange = () => {
            setActiveTab(getTabFromUrl());
        };

        handleLocationChange();

        window.addEventListener('popstate', handleLocationChange);

        return () => {
            window.removeEventListener('popstate', handleLocationChange);
        };
    }, []);

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        window.history.pushState({}, '', `/?tab=${tabName}`);
    };

    if (!currentUser) {
        return (
            <Login
                onLogin={login}
                onRegister={register}
            />
        );
    }

    return (
        <div style={{
            background: '#0a0a0a',
            color: '#e5e5e5',
            minHeight: '100vh',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>

            <header style={{
                background: '#000000',
                borderBottom: '1px solid #222',
                padding: '12px 32px'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>

                    {/* LOGOTIPO */}
                    <a href="/index.html" style={{
                        textDecoration: 'none',
                        display: 'inline-block'
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            lineHeight: '1',
                            fontFamily: "'Libre Baskerville', 'Times New Roman', serif"
                        }}>
                            <span style={{
                                color: '#FFFFFF',
                                fontSize: '1.4rem',
                                fontWeight: '700',
                                letterSpacing: '1px'
                            }}>
                                SANTA
                            </span>

                            <span style={{
                                color: '#DC2626',
                                fontSize: '1.75rem',
                                fontWeight: '700',
                                letterSpacing: '0.5px',
                                marginTop: '-2px'
                            }}>
                                LUCÍA
                            </span>

                            <span style={{
                                color: '#DC2626',
                                fontSize: '0.55rem',
                                fontWeight: '700',
                                letterSpacing: '5.5px',
                                marginTop: '2px'
                            }}>
                                ALQUILER
                            </span>
                        </div>
                    </a>

                    {/* NAVEGACIÓN */}
                    <nav style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px'
                    }}>
                        <a href="/index.html" style={navLinkStyle}>
                            Inicio
                        </a>

                        <button
                            onClick={() => handleTabChange('fleet')}
                            style={navBtnStyle(activeTab === 'fleet')}
                        >
                            Nuestra Flota
                        </button>

                        <button
                            onClick={() => handleTabChange('dashboard')}
                            style={navBtnStyle(activeTab === 'dashboard')}
                        >
                            Panel de control
                        </button>

                        <button
                            onClick={() => handleTabChange('favorites')}
                            style={navBtnStyle(activeTab === 'favorites')}
                        >
                            Mis favoritos
                        </button>

                        {currentUser.role === 'admin' && (
                            <button
                                onClick={() => handleTabChange('reports')}
                                style={navBtnStyle(activeTab === 'reports')}
                            >
                                Reportes
                            </button>
                        )}

                        {currentUser.role === 'admin' && (
                            <button
                                onClick={() => handleTabChange('clients')}
                                style={navBtnStyle(activeTab === 'clients')}
                            >
                                Clientes
                            </button>
                        )}

                        <button
                            onClick={() => handleTabChange('profile')}
                            style={navBtnStyle(activeTab === 'profile')}
                        >
                            Mi perfil
                        </button>

                        {/* USUARIO Y CIERRE DE SESIÓN */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginLeft: '12px',
                            paddingLeft: '16px',
                            borderLeft: '1px solid #333'
                        }}>
                            <span style={{
                                fontSize: '0.85rem',
                                color: '#a3a3a3'
                            }}>
                                👤 {currentUser.name}
                            </span>

                            <button
                                onClick={() => {
                                    logout();
                                    window.history.replaceState({}, '', '/');
                                    setActiveTab('dashboard');
                                }}
                                style={{
                                    background: '#262626',
                                    color: '#fca5a5',
                                    border: '1px solid #404040',
                                    padding: '4px 10px',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Salir
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            {/* MÓDULOS REACT */}
            <main>
                {activeTab === 'fleet' && <Fleet />}

                {activeTab === 'dashboard' && <Dashboard />}

                {activeTab === 'favorites' && <Favorites />}

                {activeTab === 'profile' && <Profile />}

                {activeTab === 'reports' && currentUser.role === 'admin' && (
                    <Reports />
                )}

                {activeTab === 'clients' && currentUser.role === 'admin' && (
                    <Clients />
                )}
            </main>
        </div>
    );
}

const navLinkStyle = {
    color: '#cccccc',
    fontSize: '0.95rem',
    fontWeight: '500',
    textDecoration: 'none'
};

const navBtnStyle = (isActive) => ({
    background: 'none',
    border: 'none',
    color: isActive ? '#dc2626' : '#cccccc',
    fontSize: '0.95rem',
    fontWeight: isActive ? 'bold' : '500',
    cursor: 'pointer'
});

export default function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}
