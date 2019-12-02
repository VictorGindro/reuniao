var http = require('http');
const url = require('url');
const axios = require('axios');
const qs = require('querystring')
http.createServer(function (req, res) {
    var params = url.parse(req.url, true).query;

    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    if (params.code) {
        let data = {
            "client_id": "11393fd4-e348-4bf9-b110-6a709af54548",
            "client_secret": "qs5MlcNHObzFF[_4RcTJ.@Mqy7CuOha1",
            "code": params.code,
            "redirect_uri": "http://localhost:8080",
            "grant_type": "authorization_code",
            "scope" : "Calendars.ReadWrite"
        };
        console.log('passou ' + JSON.stringify(data));
        res.write('your code is : ' + params.code);
        axios.post('https://login.microsoftonline.com/3835863a-ce23-4ec5-bb68-eee13552e3b1/oauth2/v2.0/token', qs.stringify(data), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then((response) => {
            console.log(response.data.access_token);
            axios.get("https://graph.microsoft.com/v1.0/me/events", {
                headers: {
                    Authorization : "Bearer " + response.data.access_token,
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }).then((response) => {
                console.log(response.data.value[0]);
                let eventos = response.data.value;
                for (i=0;i<eventos.length;i++){
                    
                    if(eventos[i].start.substring(11,19)){

                    }
                }
            }).catch(console.log);
        }).catch((e) => {
            console.log(e);
        });
    } else {
        res.write('Oi krl');
    }
    res.end();
}).listen(8080);