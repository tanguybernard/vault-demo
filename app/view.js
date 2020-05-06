module.exports.display = ({message, token, secrets}) => {
    let mydAta = secrets ? JSON.stringify(secrets.data) : "Get out !!!!"

    return `
<html>
<head>
     <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
    <h1>${message}</h1>
    <table  id="vaultinfo">
        <tr>
            <th>Key</th>
            <th>Value</th>
        </tr>
        <tr>
            <td>Token</td>
            <td>${token}</td>
        </tr>
        <tr>
            <td>Data</td> 
            <td>${mydAta}</td>
        </tr>
    </table>
</body>

</html>

`;
}

