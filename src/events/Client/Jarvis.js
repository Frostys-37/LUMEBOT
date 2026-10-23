const Groq = require("groq-sdk");
const fs = require("fs");
const path = require("path");
const { responderJarvis } = require("../../services/jarvisWebhook");

const { obtenerEstadoModalidades } = require("../../services/serverMonitor");

let groq = null;

if (process.env.GROQ_API_KEY) {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
}



const JARVIS_PROMPT_PATH = path.join(__dirname, "../../prompts/jarvis.md");

let JARVIS_SYSTEM_INSTRUCTION = "Eres J.A.R.V.I.S., un compañero de conversación de Lumecraft. Responde en español, con cortesía e ironía sutil, en una a tres frases. No generes código, tutoriales ni planes de trabajo. No inventes datos del servidor ni acciones realizadas.";

try {
  JARVIS_SYSTEM_INSTRUCTION = fs.readFileSync(JARVIS_PROMPT_PATH, "utf8");
} catch (error) {
  console.error(
    "[J.A.R.V.I.S.] No se pudo cargar el archivo jarvis.md:",
    error,
  );
}

function necesitaEstadoDelServidor(prompt) {
  const texto = prompt.toLowerCase();

  const palabrasClave = [
    "estado",
    "online",
    "offline",
    "en línea",
    "fuera de línea",
    "caído",
    "caida",
    "caída",
    "conectados",
    "jugadores",
    "jugando",
    "quién está jugando",
    "quienes están jugando",
    "cuántos están jugando",
    "cuantos estan jugando",
    "survival",
    "prision",
    "prisión",
    "bungee",
  ];

  return palabrasClave.some((palabra) => texto.includes(palabra));
}

function construirContextoServidor(resultados) {
  if (!resultados?.length) {
    return `
ESTADO ACTUAL DEL SERVIDOR:

No hay información disponible en este momento.
`;
  }

  const lineas = resultados.map((resultado) => {
    const estado = resultado.enLinea ? "EN LÍNEA" : "FUERA DE LÍNEA";

    let jugadores = "";

    if (
      resultado.enLinea &&
      resultado.jugadores &&
      typeof resultado.jugadores.online === "number"
    ) {
      jugadores = ` | Jugadores: ${resultado.jugadores.online}/${resultado.jugadores.max}`;
    }

    return `- ${resultado.nombre}: ${estado}${jugadores}`;
  });

  return `
ESTADO ACTUAL DEL SERVIDOR:

${lineas.join("\n")}
`;
}

module.exports = {
  name: "messageCreate",

  run: async (client, message) => {
    if (message.author.bot || message.webhookId || !message.guild) return;

    const contenido = message.content.trim();
    const contenidoMinusculas = contenido.toLowerCase();

    // J.A.R.V.I.S. solamente responde cuando es llamado
    if (!contenidoMinusculas.startsWith("jarvis")) return;

    const promptUsuario = contenido.replace(/^jarvis[,.]?\s*/i, "").trim();

    if (!promptUsuario) {
      return responderJarvis(client, message,
        "A su disposición, señor. ¿En qué puedo asistirlo?",
      );
    }

    if (!groq) {
      return responderJarvis(client, message,
        "Mi conexión con el núcleo de procesamiento no está disponible.",
      );
    }

    await message.channel.sendTyping();

    try {

      let contextoServidor = "";

      if (necesitaEstadoDelServidor(promptUsuario)) {
        const resultados = await obtenerEstadoModalidades(client);

        contextoServidor = construirContextoServidor(resultados);
      }

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: JARVIS_SYSTEM_INSTRUCTION,
          },
          ...(contextoServidor ? [{
            role: "system",
            content: `Lectura actual del monitor, solo para consultas de estado. No contiene causas ni acciones realizadas.\n${contextoServidor}`,
          }] : []),
          {
            role: "user",
            content: promptUsuario,
          },
        ],

        model: "openai/gpt-oss-20b",

        reasoning_effort: "low",

        temperature: 0.7,

        max_tokens: 500,

        include_reasoning: false,
      });

      const textoRespuesta =
        chatCompletion.choices[0]?.message?.content?.trim();

      if (!textoRespuesta) {
        return responderJarvis(client, message,
          "Procesamiento completado. No obtuve una respuesta útil.",
        );
      }

      await responderJarvis(client, message, textoRespuesta);
    } catch (error) {
      console.error("[J.A.R.V.I.S.] Error:", error);

      await responderJarvis(client, message,
        "Parece que algo ha decidido complicar innecesariamente las cosas.",
      );
    }
  },
};
