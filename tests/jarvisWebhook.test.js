const { test } = require("node:test");
const assert = require("node:assert/strict");
const { responderJarvis } = require("../src/services/jarvisWebhook");

test("webhooks: reutilización, creación concurrente, hilos y errores", async () => {
  const original = process.env.JARVIS_WEBHOOK_ID;
  process.env.JARVIS_WEBHOOK_ID = "general";
  try {
    const enviados = [];
    let creados = 0;
    const webhook = { type: 1, token: "test", id: "general", send: async (p) => enviados.push(p) };
    const lista = [];
    const canal = {
      id: "canal", guild: { id: "servidor" }, isThread: () => false,
      fetchWebhooks: async () => lista,
      createWebhook: async (datos) => {
        creados++;
        assert.equal(datos.avatar, "https://example.com/avatar.png");
        const nuevo = { ...webhook, id: "nuevo", name: datos.name, owner: { id: "bot" } };
        lista.push(nuevo);
        return nuevo;
      },
    };
    const client = { user: { id: "bot" }, fetchWebhook: async () => ({ avatarURL: () => "https://example.com/avatar.png" }) };
    const avisos = [];
    const message = { channel: canal, url: "https://discord.com/channels/s/c/m", reply: async (p) => avisos.push(p) };
    lista.push(webhook);
    await responderJarvis(client, message, "Hola @everyone");
    assert.equal(creados, 0);
    assert.deepEqual(enviados[0].allowedMentions, { parse: [] });
    lista.length = 0;
    await Promise.all([
      responderJarvis(client, message, "Primera"),
      responderJarvis(client, message, "Segunda"),
    ]);
    assert.equal(creados, 1);
    await responderJarvis(client, message, "Tercera");
    assert.equal(creados, 1);
    const hilo = { ...message, channel: { id: "hilo", parent: canal, isThread: () => true } };
    await responderJarvis(client, hilo, "😀".repeat(2200));
    assert.equal(enviados.at(-1).threadId, "hilo");
    assert.ok(enviados.every((p) => p.content.length <= 2000));
    canal.fetchWebhooks = async () => { throw Object.assign(new Error("Sin permisos"), { code: 50013 }); };
    await responderJarvis(client, message, "No enviado");
    assert.equal(avisos.length, 1);
    assert.equal(avisos[0].allowedMentions.repliedUser, false);
  } finally {
    if (original === undefined) delete process.env.JARVIS_WEBHOOK_ID;
    else process.env.JARVIS_WEBHOOK_ID = original;
  }
});
