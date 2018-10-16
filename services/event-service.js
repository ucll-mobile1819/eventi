const Event = require("../models/event");
const auth = require('../auth/auth');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
function createEvent(name,description,startdate,enddate,locationname,adress,zipcode,city,housenumber){

    return new Promise((resolve, reject) =>{
        
          Event.Event.create({
              name,
              description,
              startdate,
              enddate,
              locationname,
              zipcode,
              city,
              adress,
              housenumber
            }).then((res) => {
            resolve(res);
        }).catch(() => {
            reject(new Error("Something went wrong with creating an event"));
        })
        

    });
}

function getAllEvents(){
    //Change date for timezone?

    return new Promise((res,rej) => {
        Event.Event.findAll({
            where: {
                // usename: usename,
                enddate:{
                    [op.gt]: Date.now,
                }
            }
        }).then(results =>{
            res(results);
        }).catch(rej);
    });
    
}

module.exports = {createEvent,getAllEvents}