// ============================================================
// Composable para generar PDF de evaluación con pdfmake
// ============================================================

import { ref } from 'vue'
import { NIVELES, calcularPuntajeHabilidades, calcularPuntajeDesempeno, calcularPuntajeTotal } from '~~/shared/evaluations'

export const useEvaluationPdf = () => {
  const generating = ref(false)

  const getNivelLabel = (puntaje: number | null): string => {
    if (puntaje === null) return '—'
    const nivel = NIVELES.find((n) => n.valor === puntaje)
    return nivel ? `${nivel.label} - ${nivel.descripcion}` : String(puntaje)
  }

  const downloadPdf = async (evaluation: any) => {
    generating.value = true

    try {
      const pdfMake = (await import('pdfmake/build/pdfmake')).default
      const pdfFonts = (await import('pdfmake/build/vfs_fonts')).default
      pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs

      // Aplanar habilidades
      const habilidadesPlanas: { habilidad: string; puntaje: number | null }[] = []
      if (evaluation.habilidades) {
        for (const grupo of ['metahabilidades', 'betahabilidades', 'habilidadesOperativas', 'habilidadesInterpersonales', 'habilidadesDirectivas'] as const) {
          if (evaluation.habilidades[grupo]) {
            habilidadesPlanas.push(...evaluation.habilidades[grupo])
          }
        }
      }

      const puntajeHab = calcularPuntajeHabilidades(habilidadesPlanas)
      const puntajeDes = calcularPuntajeDesempeno(evaluation.desempeno ?? [])
      const puntajeTotal = calcularPuntajeTotal(habilidadesPlanas, evaluation.desempeno ?? [])

      // Cargar el logo como base64
      let logoBase64 = ''
      try {
        const logoRes = await fetch('/images/logo.png')
        const logoBlob = await logoRes.blob()
        logoBase64 = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(logoBlob)
        })
      } catch {
        // Si no se puede cargar el logo, continuar sin él
      }

      const docDefinition: any = {
        pageSize: 'LETTER',
        pageMargins: [40, 40, 40, 40],
        content: [
          // Logo y título
          {
            columns: [
              logoBase64 ? { image: logoBase64, width: 120, alignment: 'left' } : null,
              { text: 'Evaluación de Desempeño', style: 'header', alignment: 'right', width: '*', margin: [0, 10, 0, 0] },
            ],
          },
          { text: '', margin: [0, 0, 0, 20] },

          // Datos generales
          {
            table: {
              widths: ['30%', '70%'],
              body: [
                [
                  { text: 'Empleado:', bold: true, fillColor: '#f5f5f5' },
                  evaluation.empleado?.name ?? '—',
                ],
                [
                  { text: 'Cargo:', bold: true, fillColor: '#f5f5f5' },
                  evaluation.cargo ?? '—',
                ],
                [
                  { text: 'Evaluador:', bold: true, fillColor: '#f5f5f5' },
                  evaluation.evaluador?.name ?? '—',
                ],
                [
                  { text: 'Fecha:', bold: true, fillColor: '#f5f5f5' },
                  evaluation.fecha ? new Date(evaluation.fecha).toLocaleDateString('es-CO') : '—',
                ],
              ],
            },
            layout: 'noBorders',
            margin: [0, 0, 0, 20],
          },

          // Habilidades
          { text: 'Habilidades (20%)', style: 'sectionHeader', margin: [0, 0, 0, 8] },
          {
            table: {
              widths: ['*', 'auto'],
              body: [
                [
                  { text: 'Habilidad', bold: true, fillColor: '#1976d2', color: 'white', padding: [4, 4] },
                  { text: 'Puntaje', bold: true, fillColor: '#1976d2', color: 'white', alignment: 'center', padding: [4, 4] },
                ],
                ...habilidadesPlanas.map((h) => [
                  { text: h.habilidad, padding: [4, 4] },
                  { text: getNivelLabel(h.puntaje), alignment: 'center', padding: [4, 4] },
                ]),
              ],
            },
            layout: 'lightHorizontalLines',
            margin: [0, 0, 0, 16],
          },

          // Desempeño
          { text: 'Desempeño (50%)', style: 'sectionHeader', margin: [0, 0, 0, 8] },
          {
            table: {
              widths: ['*', 'auto'],
              body: [
                [
                  { text: 'Criterio', bold: true, fillColor: '#388e3c', color: 'white', padding: [4, 4] },
                  { text: 'Puntaje', bold: true, fillColor: '#388e3c', color: 'white', alignment: 'center', padding: [4, 4] },
                ],
                ...(evaluation.desempeno ?? []).map((d: any) => [
                  { text: d.criterio, padding: [4, 4] },
                  { text: getNivelLabel(d.puntaje), alignment: 'center', padding: [4, 4] },
                ]),
              ],
            },
            layout: 'lightHorizontalLines',
            margin: [0, 0, 0, 16],
          },

          // Puntajes resumen
          { text: 'Resumen de Puntajes', style: 'sectionHeader', margin: [0, 0, 0, 8] },
          {
            table: {
              widths: ['*', 'auto'],
              body: [
                [
                  { text: 'Componente', bold: true, fillColor: '#6a1b9a', color: 'white', padding: [4, 4] },
                  { text: 'Puntaje', bold: true, fillColor: '#6a1b9a', color: 'white', alignment: 'center', padding: [4, 4] },
                ],
                [
                  { text: 'Habilidades (20%)', padding: [4, 4] },
                  { text: puntajeHab.toFixed(2), alignment: 'center', padding: [4, 4] },
                ],
                [
                  { text: 'Desempeño (50%)', padding: [4, 4] },
                  { text: puntajeDes.toFixed(2), alignment: 'center', padding: [4, 4] },
                ],
                [
                  { text: 'Puntaje Total', bold: true, padding: [4, 4] },
                  { text: puntajeTotal.toFixed(2), bold: true, alignment: 'center', color: '#6a1b9a', fontSize: 13, padding: [4, 4] },
                ],
              ],
            },
            layout: 'lightHorizontalLines',
            margin: [0, 0, 0, 16],
          },

          // Recomendaciones
          ...(evaluation.recomendaciones
            ? [
                { text: 'Recomendaciones', style: 'sectionHeader', margin: [0, 0, 0, 8] },
                { text: evaluation.recomendaciones, margin: [0, 0, 0, 16] },
              ]
            : []),
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            color: '#1976d2',
          },
          sectionHeader: {
            fontSize: 13,
            bold: true,
            color: '#333',
          },
        },
        defaultStyle: {
          fontSize: 10,
          font: 'Roboto',
        },
      }

      pdfMake.createPdf(docDefinition).download(`evaluacion-${evaluation.empleado?.name ?? 'desconocido'}.pdf`)
    } catch (err) {
      console.error('Error al generar PDF:', err)
    } finally {
      generating.value = false
    }
  }

  return {
    generating,
    downloadPdf,
  }
}