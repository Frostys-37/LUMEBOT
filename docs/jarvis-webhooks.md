# Respuestas de J.A.R.V.I.S. mediante webhooks

En el `.env` del equipo que ejecuta el bot, configura el ID del webhook existente de General:

```env
JARVIS_WEBHOOK_ID=1561873109508956162
```

No se necesita guardar la URL ni el token del webhook. El bot lo obtiene mediante su acceso autenticado a Discord. Concede a LUMEBOT **Administrar webhooks** en General y en los canales donde quieras usar J.A.R.V.I.S., además de los permisos habituales para ver canales y enviar mensajes.

Cuando alguien invoque a Jarvis en un canal, se reutiliza el webhook configurado o uno llamado `J.A.R.V.I.S.` creado por el propio bot. Si no existe, se crea uno con el avatar de General. No se crean webhooks en todos los canales al arrancar. En los hilos se usa el webhook del canal padre y se publica dentro del hilo.

Opcionalmente, `JARVIS_AVATAR_URL` permite elegir la imagen para los nuevos webhooks. Cambiar la imagen de General no actualiza automáticamente los ya creados. Si eliminas el webhook de referencia, actualiza su ID o configura esta URL antes de crear webhooks nuevos.

Las respuestas incluyen un enlace a la consulta original: los webhooks no utilizan la respuesta nativa del bot. Las menciones están desactivadas. Si falla el envío o faltan permisos, LUMEBOT publica un aviso de configuración. No hay integración de voz.

Reinicia el proceso después de cambiar el código o el `.env`. El `.env` local no se sincroniza con GitHub: configura también la variable en el host Linux.

Comprobación local sin conexión a Discord:

```sh
node --test tests/jarvisWebhook.test.js
```
