const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const PORT = 8000;
const app = express();


app.use(expressLayouts);
app.set("layout extractStyles", true); 
app.set("layout extractScripts", true); 

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "src", "views"));

app.use('/', require('./src/routes'));

app.listen(PORT, ()=>{
    console.log("Server started on Port:", PORT);
});

