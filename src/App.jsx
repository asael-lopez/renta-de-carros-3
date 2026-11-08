import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Fleet } from './pages/Fleet';
import { Dashboard } from './pages/Dashboard';
import { Reports } from './pages/Reports';

function AppContent() {
    // Función para obtener la pestaña desde el parámetro ?tab= de la URL
    const getTabFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('tab') || 'dashboard';
    };

    const [activeTab, setActiveTab] = useState(getTabFromUrl);
    const { currentUser, logout } = useApp();

    // Escuchar constantemente los cambios en la URL (por si vienen de index.html o usan los botones del navegador)
    useEffect(() => {
        const handleLocationChange = () => {
            setActiveTab(getTabFromUrl());
        };

        // Actualiza al cargar o navegar
        handleLocationChange();

        window.addEventListener('popstate', handleLocationChange);
        return () => window.removeEventListener('popstate', handleLocationChange);
    }, []);

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        // Actualizar la URL sin recargar la página completa
        window.history.pushState({}, '', `/?tab=${tabName}`);
    };

    return (
        <div style={{ background: '#0a0a0a', color: '#e5e5e5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {/* Header Corporativo Global */}
            <header style={{ background: '#000000', borderBottom: '1px solid #222', padding: '12px 32px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                    {/* Logo exacto al diseño original de la imagen */}
                    <a href="/index.html" style={{ textDecoration: 'none', display: 'inline-block' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1', fontFamily: "'Libre Baskerville', 'Times New Roman', serif" }}>

                            {/* SANTA (Blanco arriba) */}
                            <span style={{
                                color: '#FFFFFF',
                                fontSize: '1.4rem',
                                fontWeight: '700',
                                letterSpacing: '1px',
                                textTransform: 'uppercase'
                            }}>
      SANTA
    </span>

                            <span style={{
                                color: '#DC2626',
                                fontSize: '1.75rem',
                                fontWeight: '700',
                                letterSpacing: '0.5px',
                                marginTop: '-2px',
                                textTransform: 'uppercase'
                            }}>
      LUCÍA
    </span>

                            <span style={{
                                color: '#DC2626',
                                fontSize: '0.55rem',
                                fontWeight: '700',
                                letterSpacing: '5.5px',
                                marginTop: '2px',
                                textTransform: 'uppercase'
                            }}>
      ALQUILER
    </span>

                        </div>
                    </a>
                    {/* Menú de Navegación React */}
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <a href="/index.html" style={navLinkStyle}>Inicio</a>
                        <button onClick={() => handleTabChange('fleet')} style={navBtnStyle(activeTab === 'fleet')}>Nuestra Flota</button>
                        <button onClick={() => handleTabChange('dashboard')} style={navBtnStyle(activeTab === 'dashboard')}>Panel de control</button>
                        <button onClick={() => handleTabChange('reports')} style={navBtnStyle(activeTab === 'reports')}>Reportes</button>

                        {currentUser ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '12px', paddingLeft: '16px', borderLeft: '1px solid #333' }}>
                                <span style={{ fontSize: '0.85rem', color: '#a3a3a3' }}>👤 {currentUser.name}</span>
                                <button
                                    onClick={() => {
                                        logout();
                                        window.location.href = '/login-registro.html';
                                    }}
                                    style={{ background: '#262626', color: '#fca5a5', border: '1px solid #404040', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
                                >
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <a
                                href="/login-registro.html"
                                style={{ background: '#dc2626', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem', textDecoration: 'none', marginLeft: '12px' }}
                            >
                                Cerrar Sesión
                            </a>
                        )}
                    </nav>
                </div>
            </header>

            {/* Renderizado de los Módulos Reactivos */}
            <main>
                {activeTab === 'fleet' && <Fleet />}
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'reports' && <Reports />}
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