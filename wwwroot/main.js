const jwt = window.jwt;

let accessToken = null;

// Authentication

function getAccessToken() {
    const clientId = document.getElementById("client-id").value;
    const clientSecret = document.getElementById("client-secret").value;
    const ssaScopes =
        "application:service_account:read application:service_account:write application:service_account_key:read application:service_account_key:write";

    return new Promise(async (resolve, reject) => {
        let res = await fetch(
            "https://developer.api.autodesk.com/authentication/v2/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials&scope=${ssaScopes}`,
            }
        );

        let data = await res.json();

        resolve(data.access_token);
    });
}
const login = document.getElementById("login");
login.onclick = async () => {
    accessToken = await getAccessToken();

    listAccounts();
};

// Accounts

const accountsList = document.getElementById("accounts-list");

async function listAccounts() {
    const res = await fetch(
        "https://developer.api.autodesk.com/authentication/v2/service-accounts",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const data = await res.json();

    accountsList.innerHTML = "";
    data.serviceAccounts.forEach((account) => {
        let option = document.createElement("option");
        option.value = account.serviceAccountId;
        option.text = account.email;
        option.data = account;
        accountsList.appendChild(option);
    });
    accountsList.onchange = () => {
        const accountData =
            accountsList.options[accountsList.selectedIndex].data;
        document.getElementById("account-details").innerHTML = JSON.stringify(
            accountData,
            null,
            2
        );

        listKeys(accountData.serviceAccountId);
    };
}

function addAccount(account) {
    let option = document.createElement("option");
    option.value = account.serviceAccountId;
    option.text = account.email;
    option.data = account;
    accountsList.appendChild(option);
}

function removeAccount() {
    accountsList.remove(accountsList.selectedIndex);
}

const createAccount = document.getElementById("create-account");
createAccount.onclick = async () => {
    const accountName = document.getElementById("account-name").value;

    try {
        const res = await fetch(
            "https://developer.api.autodesk.com/authentication/v2/service-accounts",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    name: accountName,
                }),
            }
        );

        const data = await res.json();
        console.log(data);

        addAccount(data);
    } catch (error) {
        alert(error);
    }
};

// Keys

const keysList = document.getElementById("keys-list");

async function listKeys(accountId) {
    const res = await fetch(
        `https://developer.api.autodesk.com/authentication/v2/service-accounts/${accountId}/keys`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const data = await res.json();

    keysList.innerHTML = "";
    data.keys.forEach((key) => {
		addKey(key);
	});
    keysList.onchange = () => {
        const keyData = keysList.options[keysList.selectedIndex].data;
        document.getElementById("key-details").innerHTML = JSON.stringify(
            keyData,
            null,
            2
        );

        showPrivateKey(keyData.kid);
    };
}

function addKey(key) {
    let option = document.createElement("option");
    option.value = key.kid;
    option.text = key.kid;
    option.data = key;
    keysList.appendChild(option);
}

async function showPrivateKey(kid) {
    const accountData = accountsList.options[accountsList.selectedIndex].data;

    const privateKey = accountData[kid]?.privateKey || "";

    document.getElementById("private-key").value = privateKey;
}

const loadPem = document.getElementById("load-pem");
loadPem.onclick = () => {
    const fileInput = document.getElementById("file-input");
    fileInput.click();

    fileInput.onchange = function () {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            document.getElementById("private-key").value = reader.result;
            fileInput.value = "";
        };
    };
};

// Tokens

const createToken = document.getElementById("create-token");
createToken.onclick = async () => {
    const accountData = accountsList.options[accountsList.selectedIndex].data;

    const keyData = keysList.options[keysList.selectedIndex].data;

    const privateKey = document.getElementById("private-key").value;

    const clientId = document.getElementById("client-id").value;
    const clientSecret = document.getElementById("client-secret").value;

    const scopes = document.getElementById("scopes").value;

    const payload = {
        kid: keyData.kid,
        privateKey,
        clientId,
        clientSecret,
        accountId: accountData.serviceAccountId,
        scope: scopes,
    };

    try {
        const token = await fetch(`/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!token.ok)
            throw new Error(`HTTP error! status: ${await token.text()}`);

        const tokenData = await token.json();

        document.getElementById("access-token").innerHTML = JSON.stringify(
            tokenData,
            null,
            2
        );
    } catch (error) {
        alert(error);
    }
};
