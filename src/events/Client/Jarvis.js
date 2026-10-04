const Groq = require("groq-sdk");
const fs = require("fs");
const path = require("path");

const { obtenerEstadoModalidades } = require("../../services/serverMonitor");

let groq = null;

if (process.env.GROQ_API_KEY) {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
}

/*
|--------------------------------------------------------------------------
| PROMPT DE J.A.R.V.I.S.
|--------------------------------------------------------------------------
*/

const JARVIS_PROMPT_PATH = path.join(__dirname, "../../prompts/jarvis.md");

let JARVIS_SYSTEM_INSTRUCTION = "";

try {
  JARVIS_SYSTEM_INSTRUCTION = fs.readFileSync(JARVIS_PROMPT_PATH, "utf8");
} catch (error) {
  console.error(
    "[J.A.R.V.I.S.] No se pudo cargar el archivo jarvis.md:",
    error,
  );
}

/*
|--------------------------------------------------------------------------
| DETECCIÓN DE CONSULTAS SOBRE EL ESTADO DEL SERVIDOR
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| CONSTRUIR CONTEXTO DEL ESTADO DEL SERVIDOR
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| EVENTO
|--------------------------------------------------------------------------
*/

module.exports = {
  name: "messageCreate",

  run: async (client, message) => {
    // Ignorar bots y mensajes fuera de servidores
    if (message.author.bot || !message.guild) return;

    const contenido = message.content.trim();
    const contenidoMinusculas = contenido.toLowerCase();

    // J.A.R.V.I.S. solamente responde cuando es llamado
    if (!contenidoMinusculas.startsWith("jarvis")) return;

    const promptUsuario = contenido.replace(/^jarvis[,.]?\s*/i, "").trim();

    /*
        |--------------------------------------------------------------------------
        | LLAMADA SIN PETICIÓN
        |--------------------------------------------------------------------------
        */

    if (!promptUsuario) {
      return message.reply(
        "`J.A.R.V.I.S.:` A su disposición, señor. ¿En qué puedo asistirlo?",
      );
    }

    /*
        |--------------------------------------------------------------------------
        | GROQ NO CONFIGURADO
        |--------------------------------------------------------------------------
        */

    if (!groq) {
      return message.reply(
        "`J.A.R.V.I.S.:` Mi conexión con el núcleo de procesamiento no está disponible.",
      );
    }

    /*
        |--------------------------------------------------------------------------
        | TYPING
        |--------------------------------------------------------------------------
        */

    await message.channel.sendTyping();

    try {
      /*
            |--------------------------------------------------------------------------
            | OBTENER ESTADO DEL SERVIDOR SI ES NECESARIO
            |--------------------------------------------------------------------------
            */

      let contextoServidor = "";

      if (necesitaEstadoDelServidor(promptUsuario)) {
        const resultados = await obtenerEstadoModalidades(client);

        contextoServidor = construirContextoServidor(resultados);
      }

      /*
            |--------------------------------------------------------------------------
            | CONTEXTO PARA GROQ
            |--------------------------------------------------------------------------
            */

      const mensajeUsuario = `
Usuario: ${message.author.username}

${contextoServidor}

Solicitud del usuario:
"${promptUsuario}"
`;

      /*
            |--------------------------------------------------------------------------
            | GROQ
            |--------------------------------------------------------------------------
            */

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: JARVIS_SYSTEM_INSTRUCTION,
          },
          {
            role: "user",
            content: mensajeUsuario,
          },
        ],

        model: "openai/gpt-oss-20b",

        reasoning_effort: "low",

        temperature: 0.7,

        max_tokens: 200,

        include_reasoning: false,
      });

      /*
            |--------------------------------------------------------------------------
            | RESPUESTA
            |--------------------------------------------------------------------------
            */

      const textoRespuesta =
        chatCompletion.choices[0]?.message?.content?.trim();

      if (!textoRespuesta) {
        return message.reply(
          "`J.A.R.V.I.S.:` Procesamiento completado. No obtuve una respuesta útil.",
        );
      }

      await message.reply(`\`J.A.R.V.I.S.:\` ${textoRespuesta}`);
    } catch (error) {
      console.error("[J.A.R.V.I.S.] Error:", error);

      await message.reply(
        "`J.A.R.V.I.S.:` Parece que algo ha decidido complicar innecesariamente las cosas.",
      );
    }
  },
};
