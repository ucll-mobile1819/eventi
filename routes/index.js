const express = require('express');
const router = express.Router();
const fs = require('fs');

// No direct routes should be written in this file

function getAllRoutes(pathToRoute){
    fs.readdirSync(__dirname+pathToRoute).forEach(function(file) {
        if(!file.endsWith('.js')){
            getAllRoutes(pathToRoute+'/'+file);
        }else if(file === 'index.js'){
            return;
        }else{
            file = pathToRoute + '/' + file.slice(0,file.length-3);
            router.use(file, require('.'+file));
        }
    })
}

getAllRoutes('');

module.exports = router;
