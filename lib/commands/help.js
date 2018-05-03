
module.exports = () => {
  let helpStr = `
email-endpoint create           Create an endpoint.
email-endpoint list             List your endpoints.
email-endpoint test [name]      Send a test email to the endpoint with the given name.
email-endpoint destroy [name]   Destroy the named endpoint by deleting the resources on AWS.
email-endpoint help             Display this message.
`;
  console.log(helpStr);
};