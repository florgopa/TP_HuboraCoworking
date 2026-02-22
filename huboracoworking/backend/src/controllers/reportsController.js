import { pool } from "../config/db.js";

/**
 * Precios “hardcodeados” por ahora (después si querés los movemos a .env)
 */
const PRECIO_BASICO = 40000;
const PRECIO_PREMIUM = 60000;

/**
 * GET /api/admin/reports/plans-estimate
 * Estimación de ingresos mensuales por planes (solo usuarios activos)
 */
export const getPlansEstimate = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT plan_contratado, COUNT(*) AS total
      FROM usuario
      WHERE activo = 1
      GROUP BY plan_contratado
    `);

    let basico = 0;
    let premium = 0;

    for (const r of rows) {
      if (r.plan_contratado === "basico") basico = Number(r.total) || 0;
      if (r.plan_contratado === "premium") premium = Number(r.total) || 0;
    }

    const ingresoBasico = basico * PRECIO_BASICO;
    const ingresoPremium = premium * PRECIO_PREMIUM;

    return res.json({
      ok: true,
      precios: { basico: PRECIO_BASICO, premium: PRECIO_PREMIUM },
      basico,
      premium,
      ingresoBasico,
      ingresoPremium,
      ingresoTotal: ingresoBasico + ingresoPremium,
    });
  } catch (error) {
    console.error("REPORTS getPlansEstimate ERROR:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};

/**
 * GET /api/admin/reports/kpis
 * KPIs rápidos: usuarios activos, reservas totales, reservas por estado
 */
export const getKpis = async (req, res) => {
  try {
    const [[u]] = await pool.query(`
      SELECT
        COUNT(*) AS totalUsuarios,
        SUM(activo = 1) AS activos
      FROM usuario
    `);

    const [[r]] = await pool.query(`
      SELECT
        COUNT(*) AS totalReservas,
        SUM(estado = 'pendiente_pago') AS pendientes,
        SUM(estado = 'confirmada') AS confirmadas,
        SUM(estado = 'cancelada') AS canceladas
      FROM reserva
    `);

    return res.json({
      ok: true,
      usuarios: {
        total: Number(u?.totalUsuarios) || 0,
        activos: Number(u?.activos) || 0,
      },
      reservas: {
        total: Number(r?.totalReservas) || 0,
        pendientes: Number(r?.pendientes) || 0,
        confirmadas: Number(r?.confirmadas) || 0,
        canceladas: Number(r?.canceladas) || 0,
      },
    });
  } catch (error) {
    console.error("REPORTS getKpis ERROR:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};

/**
 * GET /api/admin/reports/reservations-by-month?months=6
 * Reservas por mes (últimos N meses)
 * Devuelve { month: '2026-02', total: 12, confirmadas: 5, pendientes: 6, canceladas: 1 }
 */
export const getReservationsByMonth = async (req, res) => {
  try {
    const months = Math.max(1, Math.min(24, Number(req.query.months) || 6));

    const [rows] = await pool.query(
      `
      SELECT
        DATE_FORMAT(fecha, '%Y-%m') AS month,
        COUNT(*) AS total,
        SUM(estado = 'confirmada') AS confirmadas,
        SUM(estado = 'pendiente_pago') AS pendientes,
        SUM(estado = 'cancelada') AS canceladas
      FROM reserva
      WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
      GROUP BY DATE_FORMAT(fecha, '%Y-%m')
      ORDER BY month ASC
      `,
      [months]
    );

    return res.json({ ok: true, months, data: rows });
  } catch (error) {
    console.error("REPORTS getReservationsByMonth ERROR:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};

/**
 * GET /api/admin/reports/top-spaces?limit=5
 * Top espacios por cantidad de reservas (excluye canceladas si querés: acá las cuenta igual, lo hago configurable)
 */
export const getTopSpaces = async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(20, Number(req.query.limit) || 5));
    const excludeCancelled = String(req.query.excludeCancelled || "1") === "1";

    const whereEstado = excludeCancelled ? `WHERE r.estado <> 'cancelada'` : "";

    const [rows] = await pool.query(
      `
      SELECT
        e.id,
        e.nombre,
        e.tipo,
        COUNT(*) AS total
      FROM reserva r
      JOIN espacio e ON e.id = r.espacio_id
      ${whereEstado}
      GROUP BY e.id, e.nombre, e.tipo
      ORDER BY total DESC
      LIMIT ?
      `,
      [limit]
    );

    return res.json({ ok: true, limit, excludeCancelled, data: rows });
  } catch (error) {
    console.error("REPORTS getTopSpaces ERROR:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};