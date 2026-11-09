import { useState, useEffect } from 'react';
import './App.css';
import { AppProvider } from './context/AppContext';
import { Fleet } from './pages/Fleet';
import { Dashboard } from './pages/Dashboard';
import { Reports } from './pages/Reports';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';

function AppContent() {
    // Función para obtener la pestaña desde el parámetro ?tab= de la URL
    const getTabFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('tab') || 'dashboard';
    };

    const [activeTab, setActiveTab] = useState(getTabFromUrl);

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
        <div className="app-shell">
            <SiteHeader activeTab={activeTab} onTabChange={handleTabChange} />

            {/* Renderizado de los Módulos Reactivos */}
            <main>
                {activeTab === 'fleet' && <Fleet />}
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'reports' && <Reports />}
            </main>
            <SiteFooter onTabChange={handleTabChange} />
        </div>
    );
}

export default function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}
