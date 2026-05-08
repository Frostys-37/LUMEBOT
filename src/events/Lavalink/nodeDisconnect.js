module.exports = async (client, node, reason) => {

	client.logger.log(`Node "${node.options.identifier}" desconectado por: ${reason}.`, "warn");

}