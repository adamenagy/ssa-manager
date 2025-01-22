const { AuthenticationClient, Scopes } = require("@aps_sdk/authentication");

const authenticationClient = new AuthenticationClient();

const service = (module.exports = {});

service.login = async function (clientId, clientSecret) {
    const credentials = await authenticationClient.getTwoLeggedToken(
        clientId,
        clientSecret,
        [
            "application:service_account:read",
			"application:service_account:write",
			"application:service_account_key:read", 
			"application:service_account_key:write"
        ]
    );
    return credentials.access_token;
}

service.listAccounts = async function (authorization) {
    const res = await fetch(
        "https://developer.api.autodesk.com/authentication/v2/service-accounts",
        {
            method: "GET",
            headers: {
                Authorization: authorization,
            },
        }
    );

    const data = await res.json();

    return data.serviceAccounts;
};
