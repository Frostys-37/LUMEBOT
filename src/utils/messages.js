const messages = require('../messages.json');

function get(category, key) {
    const template = messages?.[category]?.[key];
    if(template === undefined) {
        console.warn(`[messages] No existe el mensaje para la categoría "${category}" y la clave "${key}"`);
        return `Mensaje no encontrado: ${category}.${key}`;
    }
    return template;
}

function format(template, vars = {}) {
    return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => 
        Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : `{{${key}}}`
    );
}

module.exports = {
    error: (key, vars) => format(get('errors', key), vars),
    success: (key, vars) => format(get('success', key), vars),
};