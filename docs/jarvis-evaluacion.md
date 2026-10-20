# Evaluación de conversación

Se revisó `Respuestas.txt` aportado por el usuario y se ejecutaron seis consultas independientes con el prompt anterior, `openai/gpt-oss-20b`, temperatura 0.7 y los parámetros actuales del bot. Las respuestas están en `artifacts/jarvis-before.json`. No se publicaron mensajes en Discord.

## Hallazgos

- «Cancela el lunes» se convirtió en soporte para un evento inexistente.
- «Webo con salchicha» se interpretó como una posible web de recetas.
- El creeper provocó consejos sobre `/claim` sin evidencia sobre su protección contra explosiones.
- La ironía del «genio» acabó en consejos en vez de una réplica.
- El bot describió sus reglas y ofreció tareas fuera de su función.
- La IP exacta fue correcta. La respuesta empática de la muestra era razonable. Rechazar una petición de acoso es correcto; el tono se puede mejorar.

Cada llamada es independiente: repetir no enseña al bot. La variación puede proceder del muestreo; estas pruebas no identifican una causa única ni permiten atribuir todo al prompt.

## Cambios

Se compactó la personalidad y se priorizó reconocer intención (meme, información, malestar o daño real). Se añadieron reglas para escritura fonética, coherencia del humor y ausencia de ofertas ficticias. La información oficial existente se preservó íntegra. El mensaje de usuario ahora viaja separado del estado verificado del monitor. Se conservaron modelo, temperatura y límite de tokens para no mezclar cambios de parámetros con la evaluación del prompt.

## Validación pendiente

El primer intento de evaluar el prompt nuevo recibió HTTP 429 de Groq. No hay resultados nuevos que permitan afirmar una mejora medida. La sintaxis JavaScript y el diff se comprobaron localmente.

Tras disponer de cuota y reiniciar el bot, repetir los seis casos anteriores tres veces e incluir variantes nuevas: «perdí al ajedrez, jubila al rey», «asme unas tortiyas», «mi esqueleto favorito merece un despido». Incluir controles de IP exacta, estado real, frustración y riesgo real. Revisar intención, naturalidad, veracidad y ausencia de consejos no pedidos. No basta con acertar las frases incluidas en los ejemplos.

Si sigue fallando con frecuencia, comparar otro modelo con los mismos casos y parámetros antes de seguir añadiendo reglas. La memoria conversacional es una mejora separada, no un sustituto de entender una broma en el primer turno.
