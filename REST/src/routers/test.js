const jsonBody = {

    username: "username val",
    specialCode: "spc val",
    email: "email@gmail.com",
    password: "pass val",
    displayname: "disp val",
    cartConnection: "cc val"
    
}

console.log(jsonBody)

for (var key in jsonBody) 
{
    console.log(key)
    console.log(jsonBody[key])
}