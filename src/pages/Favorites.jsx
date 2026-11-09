
import React from 'react';
import { useApp } from '../context/AppContext';

export function Favorites() {
  const { cars, savedVehicleIds, toggleFavorite } = useApp();

  const favoriteCars = (cars || []).filter((car) =>
    (savedVehicleIds || []).includes(String(car.id))
  );

  const handleRemoveFavorite = (vehicleId) => {
    const result = toggleFavorite(vehicleId);

    if (!result?.ok) {
      alert('No se pudo actualizar tu lista de favoritos.');
    }
  };

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString('es-SV', {
      style: 'currency',
      currency: 'USD'
    });

  return (
    <section style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '30px 20px',
      color: '#fff'
    }}>
      <h1 style={{ marginBottom: '8px' }}>Mis favoritos</h1>

      <p style={{ color: '#aaa', marginBottom: '28px' }}>
        Aquí encontrarás los vehículos que has guardado.
      </p>

      {favoriteCars.length === 0 ? (
        <div style={{
          background: '#151515',
          border: '1px solid #292929',
          borderRadius: '14px',
          padding: '45px 20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '45px', marginBottom: '12px' }}>♡</div>

          <h2 style={{ margin: '0 0 10px' }}>
            Todavía no tienes favoritos
          </h2>

          <p style={{ color: '#999', margin: 0 }}>
            Explora nuestra flota y guarda los vehículos que más te interesen.
          </p>
        </div>
      ) : (
        <>
          <p style={{ color: '#aaa', marginBottom: '18px' }}>
            {favoriteCars.length} vehículo(s) guardado(s)
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {favoriteCars.map((car) => (
              <article
                key={car.id}
                style={{
                  background: '#151515',
                  border: '1px solid #292929',
                  borderRadius: '14px',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  height: '190px',
                  position: 'relative',
                  background: '#222'
                }}>
                  <img
                    src={car.imagen || car.image}
                    alt={car.nombre || car.name || 'Vehículo'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveFavorite(car.id)}
                    title="Eliminar de favoritos"
                    aria-label="Eliminar de favoritos"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: 'none',
                      background: '#fff',
                      color: '#e53955',
                      fontSize: '23px',
                      cursor: 'pointer'
                    }}
                  >
                    ♥
                  </button>
                </div>

                <div style={{ padding: '18px' }}>
                  <h3 style={{ margin: '0 0 8px' }}>
                    {car.nombre || car.name || 'Vehículo'}
                  </h3>

                  <p style={{ color: '#aaa', margin: '0 0 12px' }}>
                    {car.categoria || car.category || 'Sin categoría'}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '10px',
                    marginBottom: '15px',
                    color: '#ccc',
                    fontSize: '14px'
                  }}>
                    <span>{car.pasajeros || car.passengers || '—'} pasajeros</span>
                    <span>{car.transmision || car.transmission || '—'}</span>
                  </div>

                  <p style={{
                    color: '#a99cff',
                    fontSize: '19px',
                    fontWeight: 'bold',
                    margin: '0'
                  }}>
                    {formatPrice(car.precioDia || car.price)}
                    <span style={{
                      color: '#999',
                      fontSize: '13px',
                      fontWeight: 'normal'
                    }}>
                      {' '} / día
                    </span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
