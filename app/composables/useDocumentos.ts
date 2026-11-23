import type { DocumentoCliente, TipoDocumento } from '~/types/expediente'

// Documentos del expediente: listar, descargar con el token y subir (multipart).
export function useDocumentos() {
  const api = useApi()

  return {
    listar: (clienteId: string) =>
      api.get<DocumentoCliente[]>(`/clientes/${clienteId}/documentos`),
    tipos: () => api.get<TipoDocumento[]>('/catalogos/tipos-documento'),
    // El cuerpo es un FormData con tipo_documento_id, archivo y, opcionales, numero_referencia y observaciones.
    subir: (clienteId: string, datos: FormData) =>
      api.post<DocumentoCliente>(`/clientes/${clienteId}/documentos`, datos),
    // Revisión parcial: estatus, observaciones y número de referencia.
    revisar: (
      clienteId: string,
      documentoId: string,
      datos: Record<string, unknown>
    ) =>
      api.patch<DocumentoCliente>(
        `/clientes/${clienteId}/documentos/${documentoId}`,
        datos
      ),
    // Para la vista previa: el contenido del archivo sin guardarlo.
    obtenerArchivo: (clienteId: string, documento: DocumentoCliente) =>
      api.obtenerArchivo(
        `/clientes/${clienteId}/documentos/${documento.id}/descargar`,
        documento.nombre_archivo_original
      ),
    descargar: (clienteId: string, documento: DocumentoCliente) =>
      api.descargar(
        `/clientes/${clienteId}/documentos/${documento.id}/descargar`,
        documento.nombre_archivo_original
      )
  }
}
