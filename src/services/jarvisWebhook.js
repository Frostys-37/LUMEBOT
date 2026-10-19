const pendientes = new Map();

async function obtenerWebhook(client, canal) {
  const clave = `${canal.guild.id}:${canal.id}`;
  if (pendientes.has(clave)) return pendientes.get(clave);

  const tarea = (async () => {
    const webhooks = await canal.fetchWebhooks();
    const existente = webhooks.find((webhook) =>
      webhook.type === 1 && webhook.token && (
        webhook.id === process.env.JARVIS_WEBHOOK_ID ||
        (webhook.owner?.id === client.user.id && webhook.name === "J.A.R.V.I.S.")
      ),
    );
    if (existente) return existente;

    let avatar = process.env.JARVIS_AVATAR_URL;
    if (!avatar && process.env.JARVIS_WEBHOOK_ID) {
      const referencia = await client.fetchWebhook(process.env.JARVIS_WEBHOOK_ID);
      avatar = referencia.avatarURL({ extension: "png", size: 256 });
    }
    return canal.createWebhook({
      name: "J.A.R.V.I.S.",
      ...(avatar ? { avatar } : {}),
      reason: "Identidad de J.A.R.V.I.S. para respuestas en este canal",
    });
  })();
  pendientes.set(clave, tarea);
  try {
    return await tarea;
  } finally {
    pendientes.delete(clave);
  }
}

async function responderJarvis(client, message, texto) {
  const canal = message.channel.isThread() ? message.channel.parent : message.channel;
  try {
    if (!canal?.fetchWebhooks || !canal?.createWebhook) {
      throw new Error("Canal incompatible con webhooks");
    }
    const webhook = await obtenerWebhook(client, canal);
    const encabezado = `[↪ Consulta](${message.url})\n`;
    const caracteres = Array.from(texto);
    const limite = Math.floor((2000 - encabezado.length) / 2);
    for (let inicio = 0; inicio < caracteres.length; inicio += limite) {
      await webhook.send({
        content: encabezado + caracteres.slice(inicio, inicio + limite).join(""),
        allowedMentions: { parse: [] },
        ...(message.channel.isThread() ? { threadId: message.channel.id } : {}),
      });
    }
  } catch (error) {
    console.warn("[J.A.R.V.I.S.] No se pudo usar el webhook. Código:", error.code || "no disponible");
    await message.reply({
      content: "No pude enviar la respuesta como J.A.R.V.I.S. Revisa el permiso **Administrar webhooks** de LUMEBOT y la configuración del canal.",
      allowedMentions: { parse: [], repliedUser: false },
    });
  }
}

module.exports = { responderJarvis };
