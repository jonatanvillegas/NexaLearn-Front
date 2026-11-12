import { API_URL } from "./api";
import type { Curso } from "../types/curso";
import type { ResultadoPaginado } from "../types/datatable";
import type { Leccion } from "../types/leccion";

export const cursoEndpoint = `${API_URL}/api/cursos`;

async function obtenerError(response: Response) {
  const error = (await response.json().catch(() => ({}))) as {
    detail?: string;
    mensaje?: string;
  };
  return error.detail ?? error.mensaje ?? "No se pudo completar la solicitud.";
}

export async function obtenerCursos(start = 0) {
  const response = await fetch(`${cursoEndpoint}?start=${start}&length=6`);
  if (!response.ok) throw new Error(await obtenerError(response));
  return response.json() as Promise<ResultadoPaginado<Curso>>;
}

export async function obtenerCurso(id: number) {
  const response = await fetch(`${cursoEndpoint}/${id}`);
  if (!response.ok) throw new Error(await obtenerError(response));
  return response.json() as Promise<Curso>;
}

export async function obtenerLecciones(cursoId: number) {
  const response = await fetch(
    `${cursoEndpoint}/${cursoId}/lecciones?length=6`,
  );
  if (!response.ok) throw new Error(await obtenerError(response));
  return response.json() as Promise<ResultadoPaginado<Leccion>>;
}

export async function obtenerMisLecciones(cursoId: number, token: string) {
  const response = await fetch(
    `${cursoEndpoint}/${cursoId}/mis-lecciones?length=6`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!response.ok) throw new Error(await obtenerError(response));
  return response.json() as Promise<ResultadoPaginado<Leccion>>;
}

export async function obtenerMiInscripcion(cursoId: number, token: string) {
  const response = await fetch(`${cursoEndpoint}/${cursoId}/mi-inscripcion`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(await obtenerError(response));
  return response.json() as Promise<{ inscrito: boolean; estado?: string }>;
}

export async function crearOrdenPago(cursoId: number, token: string) {
  const response = await fetch(`${API_URL}/api/pagos/crear-orden`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ cursoId }),
  });
  if (!response.ok) throw new Error(await obtenerError(response));
  return response.json() as Promise<{ orderId: string; approvalUrl: string }>;
}

export async function capturarOrdenPago(orderId: string, token: string) {
  const response = await fetch(`${API_URL}/api/pagos/capturar-orden`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId }),
  });
  if (!response.ok) throw new Error(await obtenerError(response));
  return response.json() as Promise<{ cursoId: number; estado: string }>;
}

export async function reanudarOrdenPago(cursoId: number, token: string) {
  const response = await fetch(`${API_URL}/api/pagos/reanudar-orden`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ cursoId }),
  });
  if (!response.ok) throw new Error(await obtenerError(response));
  return response.json() as Promise<{
    completado: boolean;
    cursoId: number;
    estado: string;
    approvalUrl?: string;
  }>;
}
