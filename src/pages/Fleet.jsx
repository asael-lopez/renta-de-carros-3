import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CarCard } from '../components/CarCard';

export const Fleet = () => {
    const { cars } = useApp();
    const [filterCategory, setFilterCategory] = useState('Todos');

    const filteredCars = filterCategory === 'Todos'
        ? cars
        : cars.filter((car) => {
            if (filterCategory === 'Sedán') return car.categoria === 'Sedán';
            if (filterCategory === 'SUV') return car.categoria === 'SUV';
            if (filterCategory === 'Pickup') return car.categoria === 'Pickup' || car.categoria === 'Vans';
            if (filterCategory === 'Lujo') return car.categoria === 'Lujo';
            return true;
        });

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px', fontFamily: 'system-ui, sans-serif' }}>

            {/* Banner Principal */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.6rem', fontWeight: '900', color: '#ffffff', margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>
                    Nuestra Flota de Vehículos
                </h1>
                <p style={{ color: '#a3a3a3', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
                    Selecciona el vehículo ideal con disponibilidad inmediata y la tarifa más transparente de El Salvador.
                </p>
            </div>

            {/* Botones de Filtro Elegantes */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
                {['Todos', 'Sedán', 'SUV', 'Pickup', 'Lujo'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        style={{
                            padding: '10px 24px',
                            borderRadius: '30px',
                            border: filterCategory === cat ? '1px solid #dc2626' : '1px solid #333',
                            background: filterCategory === cat ? '#dc2626' : '#141414',
                            color: filterCategory === cat ? '#ffffff' : '#a3a3a3',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            boxShadow: filterCategory === cat ? '0 4px 14px rgba(220, 38, 38, 0.4)' : 'none',
                            transition: 'all 0.25s ease'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid de 8 Vehículos Completo */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '28px' }}>
                {filteredCars.map((car) => (
                    <CarCard key={car.id} car={car} />
                ))}
            </div>
        </div>
    );
};