import React from 'react';
import Swal from 'sweetalert2';
import { useApp } from '../context/AppContext';

export const CarCard = ({ car }) => {
    const { cars, reservations, addReservation } = useApp();

    const isMaintenance = car.status === 'En Mantenimiento';

    const handleOpenReservation = () => {
        if (isMaintenance) {
            Swal.fire({
                icon: 'warning',
                title: 'Vehículo en Mantenimiento',
                text: 'Este vehículo se encuentra actualmente en revisión técnica por mantenimiento y no puede reservarse.',
                background: '#121212',
                color: '#ffffff',
                confirmButtonColor: '#dc2626'
            });
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const next3Days = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const carOptionsHtml = cars
            .map(
                (c) =>
                    `<option value="${c.id}" ${c.id === car.id ? 'selected' : ''} style="background-color: #1e1e1e; color: #ffffff;">
            ${c.nombre} (${c.categoriaLabel || c.categoria}) — $${c.precioDia}/día [${c.status || 'Disponible'}]
          </option>`
            )
            .join('');

        Swal.fire({
            html: `
        <div style="text-align: left; color: #ffffff; font-family: system-ui, sans-serif; padding: 4px;">
          <div style="display: flex; align-items: center; gap: 8px; color: #dc2626; font-size: 0.85rem; font-weight: bold;">
            <span>🚗 SANTA LUCÍA ALQUILER</span>
          </div>
          <h2 style="font-size: 1.5rem; margin: 6px 0 10px 0; color: #fff;">Realizar una Reserva</h2>
          <p style="color: #9ca3af; font-size: 0.85rem; margin-bottom: 18px;">
            Selecciona las fechas de tu viaje para verificar disponibilidad garantizada.
          </p>

          <form id="res-form-swal">
            <div style="margin-bottom: 14px;">
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 6px;">Vehículo seleccionado *</label>
              <select id="swal-car-id" style="width: 100%; padding: 10px; border-radius: 6px; background: #1e1e1e; color: #ffffff; border: 1px solid #333;">
                ${carOptionsHtml}
              </select>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
              <div>
                <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 6px;">Fecha de recogida *</label>
                <input type="date" id="swal-pickup" value="${today}" style="width: 100%; padding: 10px; border-radius: 6px; background: #1e1e1e; color: #ffffff; border: 1px solid #333;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 6px;">Fecha de devolución *</label>
                <input type="date" id="swal-return" value="${next3Days}" style="width: 100%; padding: 10px; border-radius: 6px; background: #1e1e1e; color: #ffffff; border: 1px solid #333;" />
              </div>
            </div>

            <div style="margin-bottom: 14px;">
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 6px;">Lugar de recogida / entrega</label>
              <select id="swal-location" style="width: 100%; padding: 10px; border-radius: 6px; background: #1e1e1e; color: #ffffff; border: 1px solid #333;">
                <option value="San Salvador - Oficina Central (Av. Principal 123)" style="background-color: #1e1e1e; color: #ffffff;">San Salvador - Oficina Central (Av. Principal 123)</option>
                <option value="Aeropuerto Internacional Oscar Arnulfo Romero" style="background-color: #1e1e1e; color: #ffffff;">Aeropuerto Internacional Óscar Arnulfo Romero</option>
                <option value="Santa Tecla - Sucursal Cármenes" style="background-color: #1e1e1e; color: #ffffff;">Santa Tecla - Sucursal Cármenes</option>
              </select>
            </div>

            <div style="margin-bottom: 16px; background: #181818; padding: 12px; border-radius: 8px; border: 1px solid #2a2a2a;">
              <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 8px;">Servicios adicionales opcionales</label>
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem;">
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                  <input type="checkbox" id="extra-seguro" /> Seguro Todo Riesgo (+15$/día)
                </label>
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                  <input type="checkbox" id="extra-gps" /> Navegador GPS (+5$/día)
                </label>
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                  <input type="checkbox" id="extra-silla" /> Silla de Bebé (+8$/día)
                </label>
              </div>
            </div>

            <div style="background: #181818; padding: 14px; border-radius: 8px; border: 1px solid #2a2a2a; margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px; color: #9ca3af;">
                <span>Días calculados:</span>
                <strong id="lbl-days" style="color: #fff;">3 días</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px; color: #9ca3af;">
                <span>Tarifa base por día:</span>
                <strong id="lbl-rate" style="color: #fff;">$${car.precioDia.toFixed(2)} / día</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 8px; color: #9ca3af;">
                <span>Extras seleccionados:</span>
                <strong id="lbl-extras" style="color: #fff;">$0.00 ($0/día)</strong>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #333; padding-top: 10px;">
                <span style="font-size: 0.95rem; font-weight: bold;">TOTAL ESTIMADO:</span>
                <span id="lbl-total" style="font-size: 1.35rem; font-weight: bold; color: #dc2626;">$${(car.precioDia * 3).toFixed(2)}</span>
              </div>
            </div>
          </form>
        </div>
      `,
            showCancelButton: true,
            confirmButtonText: '📅 Confirmar Reserva',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#374151',
            background: '#121212',
            width: '520px',
            didOpen: () => {
                const updateCalculations = () => {
                    const selectedId = parseInt(document.getElementById('swal-car-id').value, 10);
                    const currentCar = cars.find((c) => c.id === selectedId) || car;
                    const pDate = new Date(document.getElementById('swal-pickup').value);
                    const rDate = new Date(document.getElementById('swal-return').value);

                    const diff = rDate - pDate;
                    const days = diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 1;

                    const seguro = document.getElementById('extra-seguro').checked ? 15 : 0;
                    const gps = document.getElementById('extra-gps').checked ? 5 : 0;
                    const silla = document.getElementById('extra-silla').checked ? 8 : 0;
                    const extrasPerDay = seguro + gps + silla;

                    const total = (currentCar.precioDia + extrasPerDay) * days;

                    document.getElementById('lbl-days').innerText = `${days} días`;
                    document.getElementById('lbl-rate').innerText = `$${currentCar.precioDia.toFixed(2)} / día`;
                    document.getElementById('lbl-extras').innerText = `$${(extrasPerDay * days).toFixed(2)} ($${extrasPerDay}/día)`;
                    document.getElementById('lbl-total').innerText = `$${total.toFixed(2)}`;
                };

                ['swal-car-id', 'swal-pickup', 'swal-return', 'extra-seguro', 'extra-gps', 'extra-silla'].forEach((id) => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.addEventListener('change', updateCalculations);
                        el.addEventListener('input', updateCalculations);
                    }
                });
            },
            preConfirm: () => {
                const selectedId = parseInt(document.getElementById('swal-car-id').value, 10);
                const currentCar = cars.find((c) => c.id === selectedId) || car;

                if (currentCar.status === 'En Mantenimiento') {
                    Swal.showValidationMessage('El vehículo seleccionado está en revisión técnica por mantenimiento.');
                    return false;
                }

                const pickupDate = document.getElementById('swal-pickup').value;
                const returnDate = document.getElementById('swal-return').value;
                const location = document.getElementById('swal-location').value;

                const pDate = new Date(pickupDate + 'T00:00:00');
                const rDate = new Date(returnDate + 'T00:00:00');

                if (rDate <= pDate) {
                    Swal.showValidationMessage('La fecha de devolución debe ser posterior a la de recogida.');
                    return false;
                }

                const isOverlapping = (reservations || []).some((res) => {
                    if (res.carId !== currentCar.id && parseInt(res.carId, 10) !== currentCar.id) return false;
                    if (res.estado === 'Cancelada' || res.estado === 'Completada') return false;

                    const existingStart = new Date(res.fechaInicio + 'T00:00:00');
                    const existingEnd = new Date(res.fechaFin + 'T00:00:00');

                    return pDate < existingEnd && rDate > existingStart;
                });

                if (isOverlapping) {
                    Swal.showValidationMessage('⚠️ El vehículo ya tiene una reserva activa en esas fechas. Elige un rango distinto.');
                    return false;
                }

                const days = Math.ceil((rDate - pDate) / (1000 * 60 * 60 * 24));
                const seguro = document.getElementById('extra-seguro').checked ? 15 : 0;
                const gps = document.getElementById('extra-gps').checked ? 5 : 0;
                const silla = document.getElementById('extra-silla').checked ? 8 : 0;
                const extrasPerDay = seguro + gps + silla;

                return {
                    carId: currentCar.id,
                    autoNombre: currentCar.nombre,
                    categoria: currentCar.categoriaLabel || currentCar.categoria,
                    fechaInicio: pickupDate,
                    fechaFin: returnDate,
                    dias: days,
                    lugar: location,
                    monto: (currentCar.precioDia + extrasPerDay) * days,
                    estado: 'Activa'
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                addReservation(result.value);
                Swal.fire({
                    icon: 'success',
                    title: '¡Reserva Confirmada!',
                    html: `Se ha reservado el <strong>${result.value.autoNombre}</strong> del ${result.value.fechaInicio} al ${result.value.fechaFin}.<br/><br/>Total: <strong style="color:#dc2626; font-size:1.2rem;">$${result.value.monto.toFixed(2)}</strong>`,
                    confirmButtonColor: '#dc2626',
                    background: '#121212',
                    color: '#ffffff'
                });
            }
        });
    };

    return (
        <div style={{
            background: '#141414',
            borderRadius: '14px',
            border: '1px solid #262626',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)'
        }}>
            <div style={{ position: 'relative' }}>
                <img
                    src={car.imagen}
                    alt={car.nombre}
                    style={{ width: '100%', height: '210px', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = '/fotos/1.jpg'; }}
                />
                <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: isMaintenance ? '#d97706' : '#16a34a',
                    color: '#ffffff',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                }}>
          {isMaintenance ? 'Mantenimiento' : 'Disponible'}
        </span>
            </div>

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>{car.nombre}</h3>
                        <span style={{ fontSize: '0.75rem', background: '#262626', color: '#a3a3a3', padding: '4px 10px', borderRadius: '6px', fontWeight: '600' }}>
              {car.categoria}
            </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#737373', margin: '0 0 14px 0' }}>
                        {car.categoriaLabel || 'Auto Alquiler'}
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '10px',
                        background: '#1a1a1a',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #262626',
                        fontSize: '0.8rem',
                        color: '#a3a3a3'
                    }}>
                        <span>👤 {car.pasajeros} Pasajeros</span>
                        <span>💼 {car.maletas} Maleta(s)</span>
                        <span>⚙️ {car.transmision}</span>
                        <span>🚗 4 Puertas</span>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #262626' }}>
                    <div>
                        <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#dc2626' }}>${car.precioDia.toFixed(2)}</span>
                        <span style={{ fontSize: '0.8rem', color: '#737373' }}> /día</span>
                    </div>
                    <button
                        onClick={handleOpenReservation}
                        disabled={isMaintenance}
                        style={{
                            background: isMaintenance ? '#404040' : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                            color: '#ffffff',
                            border: 'none',
                            padding: '10px 18px',
                            borderRadius: '8px',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            cursor: isMaintenance ? 'not-allowed' : 'pointer',
                            opacity: isMaintenance ? 0.6 : 1,
                            boxShadow: isMaintenance ? 'none' : '0 4px 12px rgba(220, 38, 38, 0.3)'
                        }}
                    >
                        {isMaintenance ? 'En Taller' : 'Reservar Ahora'}
                    </button>
                </div>
            </div>
        </div>
    );
};