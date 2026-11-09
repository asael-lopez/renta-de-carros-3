
import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialCars } from '../data/initialCars';

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    // AUTENTICACIÓN
    const [currentUser, setCurrentUser] = useState(() =>
        window.DataManager?.getCurrentUserData() || null
    );

    const [role, setRole] = useState(() =>
        currentUser?.role === 'admin' ? 'ADMIN' : 'CLIENTE'
    );

    const userEmail = currentUser?.email || '';

    const login = (credentials) => {
        const manager = window.DataManager;

        if (!manager) {
            return { ok: false, message: 'No se pudo cargar el sistema de usuarios.' };
        }

        const result = manager.authenticateUser(
            credentials.email,
            credentials.password
        );

        if (!result.ok) return result;

        const user = manager.getCurrentUserData() || result.user;

        setCurrentUser(user);
        setRole(user.role === 'admin' ? 'ADMIN' : 'CLIENTE');

        return { ok: true, user };
    };

    const register = (userData) => {
        const manager = window.DataManager;

        if (!manager) {
            return { ok: false, message: 'No se pudo cargar el sistema de usuarios.' };
        }

        const result = manager.registerUser({
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            password: userData.password,
            role: 'cliente'
        });

        if (!result.ok) return result;

        manager.setSession(result.user.email);

        const user = manager.getCurrentUserData() || result.user;

        setCurrentUser(user);
        setRole('CLIENTE');

        return { ok: true, user };
    };

    const logout = () => {
        window.DataManager?.logout();
        setCurrentUser(null);
        setRole('CLIENTE');
        setSavedVehicleIds([]);
    };

    const toggleRole = () => {
        if (currentUser?.role !== 'admin') return;

        setRole((prev) => prev === 'ADMIN' ? 'CLIENTE' : 'ADMIN');
    };

    // PERFIL DE USUARIO
    const updateProfile = (updatedData) => {
        const manager = window.DataManager;

        if (!manager || !userEmail) {
            return {
                ok: false,
                message: 'No se pudo identificar al usuario actual.'
            };
        }

        const allowedFields = {
            name: String(updatedData.name ?? currentUser.name ?? '').trim(),
            phone: String(updatedData.phone ?? currentUser.phone ?? '').trim(),
            avatar: updatedData.avatar ?? currentUser.avatar ?? ''
        };

        if (allowedFields.name.length < 3) {
            return {
                ok: false,
                message: 'El nombre debe contener al menos 3 caracteres.'
            };
        }

        manager.updateUserData(userEmail, allowedFields);

        const updatedUser = manager.getCurrentUserData();

        if (updatedUser) {
            setCurrentUser(updatedUser);
        }

        return {
            ok: true,
            user: updatedUser || { ...currentUser, ...allowedFields }
        };
    };

    // VEHÍCULOS FAVORITOS
    const [savedVehicleIds, setSavedVehicleIds] = useState([]);

    const refreshFavorites = () => {
        const manager = window.DataManager;

        if (!manager || !userEmail) {
            setSavedVehicleIds([]);
            return [];
        }

        try {
            const ids = manager.getSavedVehicleIds(userEmail);
            setSavedVehicleIds(ids.map(String));
            return ids;
        } catch (error) {
            console.error('Error cargando favoritos:', error);
            setSavedVehicleIds([]);
            return [];
        }
    };

    useEffect(() => {
        refreshFavorites();
    }, [userEmail]);

    const toggleFavorite = (vehicleId) => {
        const manager = window.DataManager;

        if (!manager || !userEmail) {
            return {
                ok: false,
                message: 'Debes iniciar sesión para guardar favoritos.'
            };
        }

        try {
            const result = manager.toggleSavedVehicle(userEmail, vehicleId);

            setSavedVehicleIds(result.ids.map(String));

            return {
                ok: true,
                saved: result.saved,
                ids: result.ids
            };
        } catch (error) {
            console.error('Error actualizando favoritos:', error);

            return {
                ok: false,
                message: 'No se pudo actualizar la lista de favoritos.'
            };
        }
    };

    // VEHÍCULOS
    const [cars, setCars] = useState(() => {
        const saved = localStorage.getItem('santa_lucia_cars');

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return parsed.length >= 8 ? parsed : initialCars;
            } catch {
                return initialCars;
            }
        }

        return initialCars;
    });

    // RESERVAS
    const [reservations, setReservations] = useState(() => {
        const saved = localStorage.getItem('santa_lucia_reservations');

        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return [];
            }
        }

        return [
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

    // MANTENIMIENTOS
    const [maintenances, setMaintenances] = useState(() => {
        const saved = localStorage.getItem('santa_lucia_maintenance');

        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return [];
            }
        }

        return [];
    });

    // PERSISTENCIA DE DATOS
    useEffect(() => {
        localStorage.setItem('santa_lucia_cars', JSON.stringify(cars));
    }, [cars]);

    useEffect(() => {
        localStorage.setItem('santa_lucia_reservations', JSON.stringify(reservations));
    }, [reservations]);

    useEffect(() => {
        localStorage.setItem('santa_lucia_maintenance', JSON.stringify(maintenances));
    }, [maintenances]);

    // CRUD VEHÍCULOS
    const addCar = (newCar) => {
        setCars((prev) => [
            ...prev,
            {
                ...newCar,
                id: Date.now(),
                status: 'Disponible',
                disponible: true
            }
        ]);
    };

    const updateCar = (id, updatedData) => {
        setCars((prev) =>
            prev.map((c) => c.id === id ? { ...c, ...updatedData } : c)
        );
    };

    const deleteCar = (id) => {
        setCars((prev) => prev.filter((c) => c.id !== id));
    };

    // CRUD RESERVAS
    const addReservation = (newRes) => {
        const resObj = {
            ...newRes,
            id: newRes.id || `RES-${Math.floor(1000 + Math.random() * 9000)}`,
            usuario: newRes.usuario || userEmail,
            estado: newRes.estado || 'Activa',
            date: new Date().toISOString()
        };

        setReservations((prev) => [...prev, resObj]);

        setCars((prev) =>
            prev.map((c) =>
                c.id === newRes.carId
                    ? { ...c, status: 'Alquilado', disponible: false }
                    : c
            )
        );
    };

    const updateReservationStatus = (id, newStatus) => {
        setReservations((prev) =>
            prev.map((r) =>
                r.id === id ? { ...r, estado: newStatus } : r
            )
        );
    };

    const deleteReservation = (id) => {
        const resToCancel = reservations.find((r) => r.id === id);

        if (resToCancel) {
            setCars((prev) =>
                prev.map((c) =>
                    c.id === resToCancel.carId
                        ? { ...c, status: 'Disponible', disponible: true }
                        : c
                )
            );
        }

        setReservations((prev) => prev.filter((r) => r.id !== id));
    };

    // CRUD MANTENIMIENTO
    const createMaintenance = (maintData) => {
        const newMaint = {
            ...maintData,
            id: `MNT-${Date.now()}`,
            estado: 'En curso'
        };

        setMaintenances((prev) => [...prev, newMaint]);

        setCars((prev) =>
            prev.map((c) =>
                c.id === parseInt(maintData.vehicleId, 10)
                    ? { ...c, status: 'En Mantenimiento', disponible: false }
                    : c
            )
        );
    };

    const completeMaintenance = (maintId) => {
        const maint = maintenances.find((m) => m.id === maintId);

        if (maint) {
            setCars((prev) =>
                prev.map((c) =>
                    c.id === parseInt(maint.vehicleId, 10)
                        ? { ...c, status: 'Disponible', disponible: true }
                        : c
                )
            );
        }

        setMaintenances((prev) =>
            prev.map((m) =>
                m.id === maintId
                    ? {
                        ...m,
                        estado: 'Finalizado',
                        fechaFinalizacion: new Date().toLocaleDateString()
                    }
                    : m
            )
        );
    };

    return (
        <AppContext.Provider
            value={{
                // Autenticación
                currentUser,
                login,
                register,
                logout,

                // Roles
                role,
                toggleRole,
                userEmail,

                // Perfil
                updateProfile,

                // Favoritos
                savedVehicleIds,
                toggleFavorite,
                refreshFavorites,

                // Vehículos
                cars,
                addCar,
                updateCar,
                deleteCar,

                // Reservas
                reservations,
                addReservation,
                updateReservationStatus,
                deleteReservation,

                // Mantenimiento
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
