require('dotenv').config();

const required = ['TOKEN', 'CLIENT_ID', 'MONGO_URI'];

let allGood = true;

for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ Falta: ${key}`);
    allGood = false;
  } else {
    console.log(`✅ ${key} = ${process.env[key].slice(0, 6)}...`); // Muestra solo los primeros caracteres
  }
}

if (allGood) console.log('\n🟢 .env listo');
else console.log('\n🔴 Faltan variables');