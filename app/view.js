module.exports.display = ({message, wrap_token, client_token, secrets}) => {

    let myData = ''
    if(secrets){
        for (const [key, val] of Object.entries(secrets.data)) {
            myData+=`<tr><td>${key}</td><td>${val}</td></tr>`;

        }
    }
    else{
        myData='<tr><td>Data</td><td>Nope !!!</td></tr>';
    }

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
            <td>Wrap Token</td>
            <td>${wrap_token}</td>
        </tr>
        <tr>
            <td>Client Token</td>
            <td>${client_token}</td>
        </tr>
        ${myData}
    </table>
</body>

</html>

`;
}

