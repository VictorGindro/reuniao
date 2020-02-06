const axios = require('axios');
const qs = require('querystring')

const user = {
    "client_id": "11393fd4-e348-4bf9-b110-6a709af54548",
    "client_secret": "qs5MlcNHObzFF[_4RcTJ.@Mqy7CuOha1",
    "grant_type": "client_credentials",
    "resource": "https://graph.microsoft.com",
    "token_type": "Bearer",
    "username": "vgindro@vgindro.onmicrosoft.com",
    "password": "Wavic2516@"
}

function hourToSeconds(str) {
    var p = str.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}


setInterval(() => {
    
    axios.post('https://login.microsoftonline.com/3835863a-ce23-4ec5-bb68-eee13552e3b1/oauth2/token', qs.stringify(user), {
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
}).then((response) => {
    console.log(response.data.access_token);
    var token = response.data.access_token
    axios.get("https://graph.microsoft.com/v1.0/users/vgindro@vgindro.onmicrosoft.com/calendars", {
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/x-www-form-urlencoded",
        }
    }).then((response) => {
        let date = new Date();
        let hourInSecods = hourToSeconds(date.toTimeString());

        
        let calendario = response.data.value[3];  //id do calendário da bcic


        axios.get("https://graph.microsoft.com/v1.0/users/vgindro@vgindro.onmicrosoft.com/calendars/" + calendario.id + "/events", {
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/x-www-form-urlencoded",
            }
        }).then((response) => {
            let eventos = response.data.value;
            axios.get("http://10.97.43.41:8080/bcic").then((response) => {
                let pessoas = response.data.people
                for (i = 0; i < eventos.length; i++) {
                    eventos[i].startHour = eventos[i].start.dateTime.substring(11, 13);
                    eventos[i].day = eventos[i].start.toLocaleString().substring(8, 9)
                    eventos[i].startMin = eventos[i].start.dateTime.substring(14, 16);
                    if (eventos.length > 0) {
                        if (eventos[i].startHour < curr_hour || eventos[i].startMin < curr_min && (pessoas != undefined || pessoas <= 2)) {
                            axios.delete("https://graph.microsoft.com/v1.0/users/vgindro@vgindro.onmicrosoft.com/calendars/" + calendario.id + "/events/" + eventos[i].id, {
                                headers: {
                                    Authorization: "Bearer " + token,
                                    "Content-Type": "application/x-www-form-urlencoded",
                                }
                            }).then((response) => {
                                console.log(response.data);
                            }).catch((e) => {
                                console.log(e)
                            });
                        }
                    }
                }
            }).catch((e) => {
                console.log(e);
            });
        }).catch((e) => {
            console.log(e);
        });
    }).catch((e) => {
        console.log(e);
    });
}).catch((e) => {
    console.log(e)
});

}, 300000);

