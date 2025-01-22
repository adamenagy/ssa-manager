let accessToken = null;

/*
const login = document.getElementById('login');
login.onclick = async function () {
	const resp = await fetch('/api/login', {
		method: 'POST',
		body: new FormData(document.getElementById('login-form'))
	});
	
	accessToken = await resp.json();

	listAccounts();
}

function listAccounts() {
	return fetch('/api/accounts', {
		headers: {	
			Authorization: `Bearer ${accessToken}`
		},
	});
}
	*/

function getAccessToken() {
    const clientId = document.getElementById("clientId").value;
    const clientSecret = document.getElementById("clientSecret").value;
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
login.onclick = async function () {
    accessToken = await getAccessToken();

    listAccounts();
};

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

	const accountsList = document.getElementById('accounts-list');
	accountsList.innerHTML = '';
	data.serviceAccounts.forEach((account) => {
		let option = document.createElement('option');
		option.value = account.serviceAccountId;
		option.text = account.email;
		option.data = account;
		accountsList.appendChild(option);
	});
	accountsList.onchange = function () {
		const selectedAccount = accountsList.options[accountsList.selectedIndex].data;
		document.getElementById('account-details').innerHTML = JSON.stringify(selectedAccount, null, 2);

		listKeys(selectedAccount.serviceAccountId);
	}
}

async function listKeys(accountId) {
	const res = await fetch(`https://developer.api.autodesk.com/authentication/v2/service-accounts/${accountId}/keys`, {
	  method: "GET",
	  headers: {
		Authorization: `Bearer ${accessToken}`,
	  }
	});
  
	const data = await res.json();
  
	const keysList = document.getElementById('keys-list');
	keysList.innerHTML = '';
	data.keys.forEach((key) => {
		let option = document.createElement('option');
		option.value = key.kid;
		option.text = key.kid;
		option.data = key;
		keysList.appendChild(option);
	});
	keysList.onchange = function () {
		const selectedKey = keysList.options[keysList.selectedIndex].data;
		document.getElementById('key-details').innerHTML = JSON.stringify(selectedKey, null, 2);

		listKeys(selectedAccount.serviceAccountId);
	}
  }
