import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialCars } from '../data/initialCars';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [role, setRole] = useState(() => localStorage.getItem('santa_lucia_role') || 'ADMIN');
    const [userEmail] = useState('cliente@santalucia.com');

    // Cargar siempre la flota completa si el storage tiene menos o datos antiguos
    const [cars, setCars] = useState(() => {
        const saved = localStorage.getItem('santa_lucia_cars');
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.length >= 8 ? parsed : initialCars;
        }
        return initialCars;
    });

    const [reservations, setReservations] = useState(() => {
        const saved = localStorage.getItem('santa_lucia_reservations');
        return saved ? JSON.parse(saved) : [
            {
                id: 'RES-101',
                usuario: 'cliente@santalucia.com',
                clienteNombre: 'José Rauda',
                carId: 1,
                autoNombre: 'Nissan Versa',
                categoria: 'Autos (Compacto)',
                fechaInicio: '2026-11-10',
                fechaFin: '2026-11-13',
                dias: 3,
                lugar: 'San Salvador - Oficina Central (Av. Principal 123)',
                monto: 105.00,
                estado: 'Activa',
                date: new Date().toISOString()
            }
        ];
    });

    const [maintenances, setMaintenances] = useState(() => {
        const saved = localStorage.getItem('santa_lucia_maintenance');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('santa_lucia_role', role);
    }, [role]);

    useEffect(() => {
        localStorage.setItem('santa_lucia_cars', JSON.stringify(cars));
    }, [cars]);

    useEffect(() => {
        localStorage.setItem('santa_lucia_reservations', JSON.stringify(reservations));
    }, [reservations]);

    useEffect(() => {
        localStorage.setItem('santa_lucia_maintenance', JSON.stringify(maintenances));
    }, [maintenances]);

    const toggleRole = () => setRole((prev) => (prev === 'ADMIN' ? 'CLIENTE' : 'ADMIN'));

    // Operaciones CRUD Vehículos
    const addCar = (newCar) => {
        setCars((prev) => [...prev, { ...newCar, id: Date.now(), status: 'Disponible', disponible: true }]);
    };

    const updateCar = (id, updatedData) => {
        setCars((prev) => prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c)));
    };

    const deleteCar = (id) => {
        setCars((prev) => prev.filter((c) => c.id !== id));
    };

    // Operaciones CRUD Reservas
    const addReservation = (newRes) => {
        const resObj = {
            ...newRes,
            id: newRes.id || `RES-${Math.floor(1000 + Math.random() * 9000)}`,
            usuario: newRes.usuario || userEmail,
            estado: newRes.estado || 'Activa',
            date: new Date().toISOString()
        };
        setReservations((prev) => [...prev, resObj]);
        setCars((prev) => prev.map((c) => (c.id === newRes.carId ? { ...c, status: 'Alquilado', disponible: false } : c)));
    };

    const updateReservationStatus = (id, newStatus) => {
        setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, estado: newStatus } : r)));
    };

    const deleteReservation = (id) => {
        const resToCancel = reservations.find((r) => r.id === id);
        if (resToCancel) {
            setCars((prev) => prev.map((c) => (c.id === resToCancel.carId ? { ...c, status: 'Disponible', disponible: true } : c)));
        }
        setReservations((prev) => prev.filter((r) => r.id !== id));
    };

    // Operaciones CRUD Mantenimiento
    const createMaintenance = (maintData) => {
        const newMaint = {
            ...maintData,
            id: `MNT-${Date.now()}`,
            estado: 'En curso'
        };
        setMaintenances((prev) => [...prev, newMaint]);
        setCars((prev) => prev.map((c) => (c.id === parseInt(maintData.vehicleId, 10) ? { ...c, status: 'En Mantenimiento', disponible: false } : c)));
    };

    const completeMaintenance = (maintId) => {
        const maint = maintenances.find((m) => m.id === maintId);
        if (maint) {
            setCars((prev) => prev.map((c) => (c.id === parseInt(maint.vehicleId, 10) ? { ...c, status: 'Disponible', disponible: true } : c)));
        }
        setMaintenances((prev) => prev.map((m) => (m.id === maintId ? { ...m, estado: 'Finalizado', fechaFinalizacion: new Date().toLocaleDateString() } : m)));
    };

    return (
        <AppContext.Provider
            value={{
                role,
                toggleRole,
                userEmail,
                cars,
                addCar,
                updateCar,
                deleteCar,
                reservations,
                addReservation,
                updateReservationStatus,
                deleteReservation,
                maintenances,
                createMaintenance,
                completeMaintenance
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);