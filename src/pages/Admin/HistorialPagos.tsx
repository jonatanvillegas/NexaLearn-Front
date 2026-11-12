import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { useAuth } from "../../hooks/useAuth";
import { obtenerPagos, type PagoAdmin } from "../../services/adminService";
import "./Admin.css";

export default function HistorialPagos() {
  const token = useAuth((state) => state.token);
  const [pagos, setPagos] = useState<PagoAdmin[]>([]);
  const [pagina, setPagina] = useState(0);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (token)
      obtenerPagos(token, pagina * 6).then((respuesta) => {
        setPagos(respuesta.data);
        setTotal(respuesta.recordsFiltered);
      });
  }, [pagina, token]);
  const paginas = Math.ceil(total / 6);
  return (
    <AdminLayout title="Historial de pagos">
      <div className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Curso</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago) => (
              <tr key={`${pago.guidId}-${pago.cursoId}`}>
                <td>{pago.cliente}</td>
                <td>{pago.curso}</td>
                <td>
                  {pago.moneda} {pago.montoPagado.toFixed(2)}
                </td>
                <td>
                  <span className="status">{pago.estado}</span>
                </td>
                <td>
                  {pago.fechaPago
                    ? new Date(pago.fechaPago).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
            {pagos.length === 0 && (
              <tr>
                <td colSpan={5}>No hay pagos registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
        {paginas > 1 && (
          <div className="admin-pagination">
            <button
              disabled={pagina === 0}
              onClick={() => setPagina(pagina - 1)}
            >
              Anterior
            </button>
            <span>
              {pagina + 1} / {paginas}
            </span>
            <button
              disabled={pagina + 1 === paginas}
              onClick={() => setPagina(pagina + 1)}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
