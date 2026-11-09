
import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';

export function Clients() {
  const { currentUser } = useApp();

  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const loadClients = () => {
    try {
      const users = window.DataManager?.getUsers() || [];

      // Solo se muestran cuentas de clientes.
      // Nunca se incluyen contraseñas en la interfaz.
      const clientList = users
        .filter(user => user.role === 'cliente')
        .map(user => ({
          email: user.email,
          name: user.name || '',
          phone: user.phone || ''
        }));

      setClients(clientList);
    } catch (error) {
      setMessage('No se pudieron cargar los clientes.');
      setMessageType('error');
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return clients;

    return clients.filter(client =>
      client.name.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.phone.toLowerCase().includes(term)
    );
  }, [clients, search]);

  const handleEdit = (client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      phone: client.phone
    });
    setMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(previous => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const phone = formData.phone.trim();

    if (name.length < 3 || name.length > 80) {
      setMessage('El nombre debe tener entre 3 y 80 caracteres.');
      setMessageType('error');
      return;
    }

    const phoneDigits = phone.replace(/[^0-9]/g, '');

    if (
      phone.length > 25 ||
      !/^\+?[0-9().\s-]+$/.test(phone) ||
      phoneDigits.length < 8 ||
      phoneDigits.length > 15
    ) {
      setMessage('Ingresa un teléfono válido con entre 8 y 15 dígitos.');
      setMessageType('error');
      return;
    }

    try {
      const dataManager = window.DataManager;

      if (!dataManager?.findUserByEmail(selectedClient.email)) {
        setMessage('No se encontró el cliente seleccionado.');
        setMessageType('error');
        return;
      }

      const success = dataManager.updateUserData(
        selectedClient.email,
        { name, phone }
      );

      if (!success) {
        setMessage('No se pudieron guardar los cambios.');
        setMessageType('error');
        return;
      }

      setMessage('Los datos del cliente se actualizaron correctamente.');
      setMessageType('success');

      loadClients();

      setSelectedClient({
        ...selectedClient,
        name,
        phone
      });
    } catch (error) {
      setMessage('Ocurrió un error al actualizar los datos.');
      setMessageType('error');
    }
  };

  const closeEditor = () => {
    setSelectedClient(null);
    setMessage('');
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div style={{
        maxWidth: '700px',
        margin: '60px auto',
        padding: '25px',
        color: '#fff',
        textAlign: 'center'
      }}>
        <h2>Acceso restringido</h2>
        <p style={{ color: '#aaa' }}>
          No tienes permisos para administrar clientes.
        </p>
      </div>
    );
  }

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginTop: '8px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#181818',
    color: '#fff',
    boxSizing: 'border-box',
    outline: 'none'
  };

  return (
    <section style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '30px 20px',
      color: '#fff'
    }}>
      <h1 style={{ marginBottom: '8px' }}>Gestión de clientes</h1>

      <p style={{ color: '#aaa', marginBottom: '28px' }}>
        Consulta y administra la información de los clientes registrados.
      </p>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        marginBottom: '22px'
      }}>
        <div style={{
          background: '#151515',
          border: '1px solid #292929',
          borderRadius: '10px',
          padding: '18px 22px',
          minWidth: '180px'
        }}>
          <p style={{ color: '#aaa', margin: '0 0 8px' }}>
            Clientes registrados
          </p>
          <h2 style={{ margin: 0, color: '#a99cff' }}>
            {clients.length}
          </h2>
        </div>
      </div>

      <input
        type="search"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar por nombre, correo o teléfono..."
        style={{
          ...inputStyle,
          marginTop: 0,
          marginBottom: '20px'
        }}
      />

      <div style={{
        background: '#151515',
        border: '1px solid #292929',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {filteredClients.length === 0 ? (
          <div style={{
            padding: '35px 20px',
            textAlign: 'center',
            color: '#999'
          }}>
            No se encontraron clientes.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '650px'
            }}>
              <thead>
                <tr style={{
                  background: '#202020',
                  color: '#aaa',
                  textAlign: 'left'
                }}>
                  <th style={{ padding: '15px' }}>Nombre</th>
                  <th style={{ padding: '15px' }}>Correo electrónico</th>
                  <th style={{ padding: '15px' }}>Teléfono</th>
                  <th style={{ padding: '15px' }}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredClients.map(client => (
                  <tr
                    key={client.email}
                    style={{ borderTop: '1px solid #292929' }}
                  >
                    <td style={{ padding: '15px' }}>
                      {client.name || 'Sin nombre'}
                    </td>

                    <td style={{
                      padding: '15px',
                      color: '#aaa'
                    }}>
                      {client.email}
                    </td>

                    <td style={{
                      padding: '15px',
                      color: '#aaa'
                    }}>
                      {client.phone || 'Sin teléfono'}
                    </td>

                    <td style={{ padding: '15px' }}>
                      <button
                        type="button"
                        onClick={() => handleEdit(client)}
                        style={{
                          background: '#292929',
                          color: '#c4baff',
                          border: '1px solid #444',
                          borderRadius: '6px',
                          padding: '8px 13px',
                          cursor: 'pointer'
                        }}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedClient && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '480px',
            background: '#181818',
            border: '1px solid #333',
            borderRadius: '14px',
            padding: '25px',
            boxSizing: 'border-box'
          }}>
            <h2 style={{ marginTop: 0 }}>Editar cliente</h2>

            <p style={{
              color: '#aaa',
              fontSize: '13px',
              overflowWrap: 'anywhere'
            }}>
              {selectedClient.email}
            </p>

            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '18px' }}>
                <label>Nombre completo</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                  minLength={3}
                  maxLength={80}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label>Teléfono</label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              {message && (
                <p style={{
                  color: messageType === 'success'
                    ? '#75e69a'
                    : '#ff8585',
                  fontSize: '14px'
                }}>
                  {message}
                </p>
              )}

              <div style={{
                display: 'flex',
                gap: '10px',
                marginTop: '22px'
              }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#7c6cff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Guardar cambios
                </button>

                <button
                  type="button"
                  onClick={closeEditor}
                  style={{
                    padding: '12px 18px',
                    background: '#333',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
