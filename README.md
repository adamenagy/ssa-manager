# ssa-manager
SSA manager

# Accounts

Just provide the name of the account you want to create and click the **Create Account With Name:** button.

# Keys

When you create a key a **secret key** will also be provided that you **cannot request later on**, but it's needed in order to generate an **access token**. Therefore the app will enable you to save the content of that on your computer named `<key id>.pem`. When you want to use it to generate an **access token** you can use the **Load From File** button which will also store the value for the duration of the session.

# Access Tokens

You can specify the **scopes** you want to use as a list of values separated by space, e.g. `data:read data:write`. \
You can use **Copy Token** to copy just the value of `access_token` to the clipboard in order to use it somewhere else. \
You can also click **Open On jwt.io** to investigate the properties of the generated **access token**.
