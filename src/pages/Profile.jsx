
import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

export function Profile() {
  const { currentUser, updateProfile } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    avatar: ''
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        avatar: currentUser.avatar || ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setLoading(true);

    try {
      const result = await updateProfile(formData);

      if (result?.ok) {
        setMessage('Tu perfil se actualizó correctamente.');
        setMessageType('success');
      } else {
        setMessage(result?.message || 'No se pudo actualizar el perfil.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Ocurrió un error al actualizar el perfil.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginTop: '8px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#181818',
    color: '#fff',
    outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div style={{
      maxWidth: '750px',
      margin: '0 auto',
      padding: '30px 20px',
      color: '#fff'
    }}>
      <h1 style={{ marginBottom: '8px' }}>Mi perfil</h1>

      <p style={{ color: '#aaa', marginBottom: '30px' }}>
        Administra tu información personal y los datos de tu cuenta.
      </p>

      <div style={{
        background: '#151515',
        border: '1px solid #292929',
        borderRadius: '14px',
        padding: '25px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          marginBottom: '30px'
        }}>
          <div style={{
            width: '75px',
            height: '75px',
            borderRadius: '50%',
            background: '#292929',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            fontSize: '30px',
            flexShrink: 0
          }}>
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt="Avatar"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              '👤'
            )}
          </div>

          <div>
            <h2 style={{ margin: 0 }}>
              {formData.name || 'Usuario'}
            </h2>
            <p style={{ color: '#999', margin: '6px 0 0' }}>
              {currentUser?.role === 'admin' ? 'Administrador' : 'Cliente'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label>Nombre completo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              style={inputStyle}
              required
              minLength={3}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>Correo electrónico</label>
            <input
              type="email"
              value={currentUser?.email || ''}
              style={{
                ...inputStyle,
                opacity: 0.6,
                cursor: 'not-allowed'
              }}
              disabled
            />
            <small style={{ color: '#888' }}>
              El correo electrónico no se puede modificar.
            </small>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>Teléfono</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Tu número de teléfono"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label>URL de fotografía de perfil</label>
            <input
              type="url"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              style={inputStyle}
            />
            <small style={{ color: '#888' }}>
              Puedes colocar el enlace de una imagen para utilizarla como avatar.
            </small>
          </div>

          {message && (
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              background: messageType === 'success'
                ? '#12351f'
                : '#3a1717',
              color: messageType === 'success'
                ? '#75e69a'
                : '#ff8585'
            }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              border: 'none',
              borderRadius: '8px',
              background: '#7c6cff',
              color: '#fff',
              fontWeight: 'bold',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}
