module.exports = async (client, node, error) => {

	client.logger.log(`Node "${node.options.identifier}" encontramos un error: ${error.message}.`, "error");

}