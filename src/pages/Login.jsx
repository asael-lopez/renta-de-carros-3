
import React, { useState } from 'react';

export const Login = ({ onLogin, onRegister }) => {
    const [isRegister, setIsRegister] = useState(false);

    const [form, setForm] = useState({
        nombre: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (loading) return;

        if (!form.email.trim() || !form.password) {
            setError('Completa todos los campos obligatorios.');
            return;
        }

        if (isRegister) {
            if (!form.nombre.trim()) {
                setError('Ingresa tu nombre completo.');
                return;
            }

            if (!form.phone.trim()) {
                setError('Ingresa tu número de teléfono.');
                return;
            }

            if (form.password !== form.confirmPassword) {
                setError('Las contraseñas no coinciden.');
                return;
            }

            if (form.password.length < 6) {
                setError('La contraseña debe tener al menos 6 caracteres.');
                return;
            }
        }

        setLoading(true);

        try {
            const result = isRegister
                ? onRegister({
                    name: form.nombre,
                    email: form.email,
                    phone: form.phone,
                    password: form.password
                })
                : onLogin({
                    email: form.email,
                    password: form.password
                });

            if (!result?.ok) {
                setError(result?.message || 'No se pudo completar la operación.');
            }
        } catch (err) {
            console.error('Error de autenticación:', err);
            setError('Ocurrió un error inesperado. Inténtalo nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                <h1 style={styles.logo}>SANTA LUCÍA</h1>

                <p style={styles.subtitle}>
                    Sistema de renta de vehículos
                </p>

                <h2 style={styles.title}>
                    {isRegister ? 'Crear cuenta' : 'Bienvenido'}
                </h2>

                <p style={styles.description}>
                    {isRegister
                        ? 'Regístrate para comenzar a utilizar nuestros servicios.'
                        : 'Inicia sesión para continuar.'}
                </p>

                <form onSubmit={handleSubmit}>

                    {isRegister && (
                        <>
                            <div style={styles.field}>
                                <label>Nombre completo</label>
                                <input
                                    name="nombre"
                                    type="text"
                                    placeholder="Tu nombre completo"
                                    value={form.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div style={styles.field}>
                                <label>Teléfono</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    placeholder="+503 7000 0000"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div style={styles.field}>
                        <label>Correo electrónico</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="correo@ejemplo.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label>Contraseña</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Tu contraseña"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {isRegister && (
                        <div style={styles.field}>
                            <label>Confirmar contraseña</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="Repite tu contraseña"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    {error && (
                        <p style={styles.error}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        style={{
                            ...styles.button,
                            opacity: loading ? 0.7 : 1
                        }}
                        disabled={loading}
                    >
                        {loading
                            ? 'Procesando...'
                            : isRegister
                                ? 'Registrarme'
                                : 'Iniciar sesión'}
                    </button>

                </form>

                <p style={styles.switchText}>
                    {isRegister
                        ? '¿Ya tienes una cuenta?'
                        : '¿No tienes una cuenta?'}
                    {' '}

                    <button
                        type="button"
                        style={styles.link}
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setError('');
                        }}
                    >
                        {isRegister
                            ? 'Inicia sesión'
                            : 'Regístrate'}
                    </button>
                </p>

            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f1f5f9',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    },

    card: {
        width: '100%',
        maxWidth: '420px',
        background: '#ffffff',
        padding: '35px',
        borderRadius: '14px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
    },

    logo: {
        textAlign: 'center',
        color: '#1e3a5f',
        letterSpacing: '2px',
        marginBottom: '5px'
    },

    subtitle: {
        textAlign: 'center',
        color: '#64748b',
        fontSize: '13px',
        marginBottom: '30px'
    },

    title: {
        color: '#1e293b',
        marginBottom: '5px'
    },

    description: {
        color: '#64748b',
        fontSize: '14px',
        marginBottom: '25px'
    },

    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '7px',
        marginBottom: '17px'
    },

    error: {
        color: '#dc2626',
        fontSize: '13px'
    },

    button: {
        width: '100%',
        padding: '13px',
        background: '#1e3a5f',
        color: '#ffffff',
        border: 'none',
        borderRadius: '7px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '10px'
    },

    switchText: {
        textAlign: 'center',
        fontSize: '14px',
        color: '#64748b',
        marginTop: '22px'
    },

    link: {
        border: 'none',
        background: 'none',
        color: '#2563eb',
        cursor: 'pointer',
        fontWeight: 'bold'
    }
};
