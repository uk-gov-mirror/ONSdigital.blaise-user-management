import express, {NextFunction, Request, Response} from "express";
import axios, {AxiosResponse} from "axios";
import path from "path";
import ejs from "ejs";
import dotenv from "dotenv";
import {getEnvironmentVariables} from "./Config";
import {Instrument, Survey} from "../Interfaces";


// @ts-ignore
import multer from "multer";
const upload = multer();


const server = express();

server.use(upload.array());
axios.defaults.timeout = 10000;

if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

// where ever the react built package is
const buildFolder = "../../build";

// load the .env variables in the server
const {VM_EXTERNAL_CLIENT_URL, VM_EXTERNAL_WEB_URL, BLAISE_API_URL, CATI_DASHBOARD_URL} = getEnvironmentVariables();

const configHeaders = {
    "content-type": "application/json",
    "Accept": "application/json"
};

// treat the index.html as a template and substitute the values at runtime
server.set("views", path.join(__dirname, buildFolder));
server.engine("html", ejs.renderFile);
server.use(
    "/static",
    express.static(path.join(__dirname, `${buildFolder}/static`)),
);

server.get("/api/serverparks", async function (req: Request, res: Response) {
    axios.get("http://" + BLAISE_API_URL + "/api/v1/serverparks")
        .then(function (response: AxiosResponse) {
            const instruments: Instrument[] = response.data;
            // Add interviewing link and date of instrument to array objects

            return res.json(instruments);
        })
        .catch(function (error) {
            // handle error
            console.error("Failed to retrieve instrument list");
            console.error(error);
            return res.status(500).json(error);
        });
});

server.get("/api/roles", async function (req: Request, res: Response) {
    axios.get("http://" + BLAISE_API_URL + "/api/v1/userroles")
        .then(function (response: AxiosResponse) {
            const instruments: Instrument[] = response.data;
            // Add interviewing link and date of instrument to array objects

            return res.json(instruments);
        })
        .catch(function (error) {
            // handle error
            console.error("Failed to retrieve instrument list");
            console.error(error);
            return res.status(500).json(error);
        });
});

server.get("/api/users", async function (req: Request, res: Response) {
    axios.get("http://" + BLAISE_API_URL + "/api/v1/users")
        .then(function (response: AxiosResponse) {
            const instruments: Instrument[] = response.data;
            // Add interviewing link and date of instrument to array objects

            return res.json(instruments);
        })
        .catch(function (error) {
            // handle error
            console.error("Failed to retrieve instrument list");
            console.error(error);
            return res.status(500).json(error);
        });
});

server.get("/api/change_password/:user", (req, res) => {
    console.log("change_password");
    const {user} = req.params;
    const {password} = req.headers;
    axios({
        method: "patch",
        headers: configHeaders,
        url: "http://" + BLAISE_API_URL + "/api/v1/users/" + user + "/password",
        data: {
            "password": password
        },
    })
        .then(function (response) {
            // Add interviewing link and date of instrument to array object
            // console.log("Retrieved instrument list, " + response.data.length + " item/s");
            return res.json(response.data);
        })
        .catch(function (error) {
            // handle error
            console.error("Failed to retrieve instrument list");
            console.error(error);
            return res.status(500).json(error);
        });
});

server.delete("/api/users", (req, res) => {
    console.log("delete_user");
    const {user} = req.headers;

    axios({
        method: "delete",
        headers: configHeaders,
        url: "http://" + BLAISE_API_URL + "/api/v1/users/" + user,
    })
        .then(function (response) {
            // Add interviewing link and date of instrument to array object
            // console.log("Retrieved instrument list, " + response.data.length + " item/s");
            return res.json(response.data);
        })
        .catch(function (error) {
            // handle error
            console.error("Failed to retrieve instrument list");
            console.error(error);
            return res.status(500).json(error);
        });
});


server.post("/api/users", (req, res) => {
    console.log("add user");
    const data = req.body;
    console.log(data);
    // let {authenticationtoken} = req.headers
    // if (authenticationtoken === null) {
    //     return res.status(500).json("No Token");
    // }
    data.serverParks = [data.defaultServerPark];
    axios({
        method: "POST",
        headers: configHeaders,
        url: "http://" + BLAISE_API_URL + "/api/v1/users",
        data: data,
    })
        .then(function (response) {
            // Add interviewing link and date of instrument to array object
            // console.log("Retrieved instrument list, " + response.data.length + " item/s");
            return res.json(response.data);
        })
        .catch(function (error) {
            // handle error
            console.error("Failed to retrieve instrument list");
            console.error(error);
            return res.status(500).json(error);
        });
});

server.post("/api/roles", (req, res) => {
    console.log("add role");
    const data = req.body;
    console.log(data);
    

    // data.permissions = ["Deployment", "Deployment.ServerParkManagement", "Deployment.InstrumentManagement", "AppManagement", "Apps.Appfeatures", "Appfeatures.login", "Appfeatures.getlistofinstruments", "Appfeatures.installsurvey", "Appfeatures.removesurvey", "Appfeatures.startsurvey", "Appfeatures.browsedata", "Appfeatures.deletedata", "Appfeatures.uploaddata", "Appfeatures.downloadcases", "Appfeatures.updatesettings", "Appfeatures.viewsettings", "Appfeatures.viewsurveydetails", "SurveyDataAccess", "SurveyDataAccess.webviewer", "UserManagement", "user.createuser", "user.updateuser", "user.removeuser", "user.createrole", "user.updaterole", "user.removerole", "user.adsync", "SkillManagement", "user.createskill", "user.updateskill", "user.removeskill", "user.updateuserskill", "CustomReports", "CR.viewreports", "CR.setreports", "CR.runreport", "CATI", "CATI.setcatispecification", "CATI.setgeneralparameters", "CATI.setgeneralparameters.setsurveydescription", "CATI.setappointmentparameters", "CATI.setappointmentparameters.setappointmentbuffer", "CATI.setappointmentparameters.setkeeptimeofexpiredappointment", "CATI.setappointmentparameters.settreatexpiredappointmentasmedium", "CATI.setdaybatchparameters", "CATI.setdaybatchparameters.setdaybatchsize", "CATI.setdaybatchparameters.setmaxnumberofcalls", "CATI.setdaybatchparameters.setdaysbetweennoanswers", "CATI.setdaybatchparameters.setdaysbetweenansweringmachine", "CATI.setlaunchersettings", "CATI.setlaunchersettings.setschedulerkind", "CATI.setlaunchersettings.settargetresponserate", "CATI.setlaunchersettings.setworkloadforoneresponse", "CATI.setschedulerparameters", "CATI.setschedulerparameters.setmaxnumberofbusydials", "CATI.setschedulerparameters.setmaxnumberofdials", "CATI.setschedulerparameters.setminimumtimebetweennoanswer", "CATI.setschedulerparameters.setminutesbetweenbusydials", "CATI.setschedulerparameters.setnosamedayansweringmachinecalls", "CATI.setschedulerparameters.setgroupdeactivationdelay", "CATI.setschedulerparameters.setinterviewerdeactivationdelay", "CATI.setschedulerparameters.setonlyexpireondeactiviationdelays", "CATI.setfieldselection", "CATI.setfieldselection.setshowinviewer", "CATI.setfieldselection.setwritetohist", "CATI.setselectfieldsettings", "CATI.setselectfieldsettings.setfields", "CATI.setselectfieldsettings.setfields.setfieldinclude", "CATI.setselectfieldsettings.setfields.setfieldvalues", "CATI.setselectfieldsettings.setactive", "CATI.setsortfieldsettings", "CATI.setsortfieldsettings.setactive", "CATI.settimezonesettings", "CATI.settimezonesettings.setappointmentgrace", "CATI.settimezonesettings.setdonotcallbefore", "CATI.settimezonesettings.setdonotcallafter", "CATI.setquotasettings", "CATI.setquotasettings.setactive", "CATI.setsurveydaysettings", "CATI.createdaybatch", "CATI.createdaybatchwithautorevoke", "CATI.extenddaybatch", "CATI.revokecase", "CATI.makesuperappointment", "CATI.adddaybatchrecord", "CATI.updatedaybatchentry", "CATI.removefromdaybatch", "CATI.setdialednumber", "CATI.backupinstrumentdata", "CATI.clearinstrumentdata", "CATI.setoperationtimesettings", "CATI.setdialresult", "CATI.setnotes", "CATI.setcasedeliveryoptions", "CATI.setcasedeliveryoptions.setenabled", "CATI.setcasedeliveryoptions.setweightfactor", "CATI.viewcatispecificationpage", "CATI.viewappointments", "CATI.selectfromcaseinfo", "CATI.selectfromdaybatch", "Deployment", "Deployment.ServerParkManagement", "Deployment.InstrumentManagement", "AppManagement", "Apps.Appfeatures", "Appfeatures.login", "Appfeatures.getlistofinstruments", "Appfeatures.installsurvey", "Appfeatures.removesurvey", "Appfeatures.startsurvey", "Appfeatures.browsedata", "Appfeatures.deletedata", "Appfeatures.uploaddata", "Appfeatures.downloadcases", "Appfeatures.updatesettings", "Appfeatures.viewsettings", "Appfeatures.viewsurveydetails", "SurveyDataAccess", "SurveyDataAccess.webviewer", "UserManagement", "user.createuser", "user.updateuser", "user.removeuser", "user.createrole", "user.updaterole", "user.removerole", "user.adsync", "SkillManagement", "user.createskill", "user.updateskill", "user.removeskill", "user.updateuserskill", "CustomReports", "CR.viewreports", "CR.setreports", "CR.runreport", "CATI", "CATI.setcatispecification", "CATI.setgeneralparameters", "CATI.setgeneralparameters.setsurveydescription", "CATI.setappointmentparameters", "CATI.setappointmentparameters.setappointmentbuffer", "CATI.setappointmentparameters.setkeeptimeofexpiredappointment", "CATI.setappointmentparameters.settreatexpiredappointmentasmedium", "CATI.setdaybatchparameters", "CATI.setdaybatchparameters.setdaybatchsize", "CATI.setdaybatchparameters.setmaxnumberofcalls", "CATI.setdaybatchparameters.setdaysbetweennoanswers", "CATI.setdaybatchparameters.setdaysbetweenansweringmachine", "CATI.setlaunchersettings", "CATI.setlaunchersettings.setschedulerkind", "CATI.setlaunchersettings.settargetresponserate", "CATI.setlaunchersettings.setworkloadforoneresponse", "CATI.setschedulerparameters", "CATI.setschedulerparameters.setmaxnumberofbusydials", "CATI.setschedulerparameters.setmaxnumberofdials", "CATI.setschedulerparameters.setminimumtimebetweennoanswer", "CATI.setschedulerparameters.setminutesbetweenbusydials", "CATI.setschedulerparameters.setnosamedayansweringmachinecalls", "CATI.setschedulerparameters.setgroupdeactivationdelay", "CATI.setschedulerparameters.setinterviewerdeactivationdelay", "CATI.setschedulerparameters.setonlyexpireondeactiviationdelays", "CATI.setfieldselection", "CATI.setfieldselection.setshowinviewer", "CATI.setfieldselection.setwritetohist", "CATI.setselectfieldsettings", "CATI.setselectfieldsettings.setfields", "CATI.setselectfieldsettings.setfields.setfieldinclude", "CATI.setselectfieldsettings.setfields.setfieldvalues", "CATI.setselectfieldsettings.setactive", "CATI.setsortfieldsettings", "CATI.setsortfieldsettings.setactive", "CATI.settimezonesettings", "CATI.settimezonesettings.setappointmentgrace", "CATI.settimezonesettings.setdonotcallbefore", "CATI.settimezonesettings.setdonotcallafter", "CATI.setquotasettings", "CATI.setquotasettings.setactive", "CATI.setsurveydaysettings", "CATI.createdaybatch", "CATI.createdaybatchwithautorevoke", "CATI.extenddaybatch", "CATI.revokecase", "CATI.makesuperappointment", "CATI.adddaybatchrecord", "CATI.updatedaybatchentry", "CATI.removefromdaybatch", "CATI.setdialednumber", "CATI.backupinstrumentdata", "CATI.clearinstrumentdata", "CATI.setoperationtimesettings", "CATI.setdialresult", "CATI.setnotes", "CATI.setcasedeliveryoptions", "CATI.setcasedeliveryoptions.setenabled", "CATI.setcasedeliveryoptions.setweightfactor", "CATI.viewcatispecificationpage", "CATI.viewappointments", "CATI.selectfromcaseinfo", "CATI.selectfromdaybatch", "CATI.selectfromdaybatchmeta", "CATI.selectfromdialhistory", "CATI.selectfromevents", "CATI.modifyclock"];
    data.permissions = ["Root", "Deployment", "Deployment.ServerParkManagement", "Deployment.InstrumentManagement", "Apps", "AppManagement", "Apps.Appfeatures", "Appfeatures.login", "Appfeatures.getlistofinstruments", "Appfeatures.installsurvey", "Appfeatures.removesurvey", "Appfeatures.startsurvey", "Appfeatures.browsedata", "Appfeatures.deletedata", "Appfeatures.uploaddata", "Appfeatures.downloadcases", "Appfeatures.updatesettings", "Appfeatures.viewsettings", "Appfeatures.viewsurveydetails", "SurveyDataAccess", "SurveyDataAccess.webviewer", "UserManagement", "user.createuser", "user.updateuser", "user.removeuser", "user.createrole", "user.updaterole", "user.removerole", "user.adsync", "SkillManagement", "user.createskill", "user.updateskill", "user.removeskill", "user.updateuserskill", "CustomReports", "CR.viewreports", "CR.setreports", "CR.runreport", "CATI", "CATI.setcatispecification", "CATI.setgeneralparameters", "CATI.setgeneralparameters.setsurveydescription", "CATI.setappointmentparameters", "CATI.setappointmentparameters.setappointmentbuffer", "CATI.setappointmentparameters.setkeeptimeofexpiredappointment", "CATI.setappointmentparameters.settreatexpiredappointmentasmedium", "CATI.setdaybatchparameters", "CATI.setdaybatchparameters.setdaybatchsize", "CATI.setdaybatchparameters.setmaxnumberofcalls", "CATI.setdaybatchparameters.setdaysbetweennoanswers", "CATI.setdaybatchparameters.setdaysbetweenansweringmachine", "CATI.setlaunchersettings", "CATI.setlaunchersettings.setschedulerkind", "CATI.setlaunchersettings.settargetresponserate", "CATI.setlaunchersettings.setworkloadforoneresponse", "CATI.setschedulerparameters", "CATI.setschedulerparameters.setmaxnumberofbusydials", "CATI.setschedulerparameters.setmaxnumberofdials", "CATI.setschedulerparameters.setminimumtimebetweennoanswer", "CATI.setschedulerparameters.setminutesbetweenbusydials", "CATI.setschedulerparameters.setnosamedayansweringmachinecalls", "CATI.setschedulerparameters.setgroupdeactivationdelay", "CATI.setschedulerparameters.setinterviewerdeactivationdelay", "CATI.setschedulerparameters.setonlyexpireondeactiviationdelays", "CATI.setfieldselection", "CATI.setfieldselection.setshowinviewer", "CATI.setfieldselection.setwritetohist", "CATI.setselectfieldsettings", "CATI.setselectfieldsettings.setfields", "CATI.setselectfieldsettings.setfields.setfieldinclude", "CATI.setselectfieldsettings.setfields.setfieldvalues", "CATI.setselectfieldsettings.setactive", "CATI.setsortfieldsettings", "CATI.setsortfieldsettings.setactive", "CATI.settimezonesettings", "CATI.settimezonesettings.setappointmentgrace", "CATI.settimezonesettings.setdonotcallbefore", "CATI.settimezonesettings.setdonotcallafter", "CATI.setquotasettings", "CATI.setquotasettings.setactive", "CATI.setsurveydaysettings", "CATI.createdaybatch", "CATI.createdaybatchwithautorevoke", "CATI.extenddaybatch", "CATI.revokecase", "CATI.makesuperappointment", "CATI.adddaybatchrecord", "CATI.updatedaybatchentry", "CATI.removefromdaybatch", "CATI.setdialednumber", "CATI.backupinstrumentdata", "CATI.clearinstrumentdata", "CATI.setoperationtimesettings", "CATI.setdialresult", "CATI.setnotes", "CATI.setcasedeliveryoptions", "CATI.setcasedeliveryoptions.setenabled", "CATI.setcasedeliveryoptions.setweightfactor", "CATI.viewcatispecificationpage", "CATI.viewappointments", "CATI.selectfromcaseinfo", "CATI.selectfromdaybatch", "CATI.selectfromdaybatchmeta", "CATI.selectfromdialhistory", "CATI.selectfromevents", "CATI.modifyclock"]
    axios({
        method: "POST",
        headers: configHeaders,
        url: "http://" + BLAISE_API_URL + "/api/v1/userroles",
        data: data,
    })
        .then(function (response) {
            // Add interviewing link and date of instrument to array object
            // console.log("Retrieved instrument list, " + response.data.length + " item/s");
            return res.json(response.data);
        })
        .catch(function (error) {
            // handle error
            console.error("Failed to post new role");
            console.error(error);
            return res.status(500).json(error);
        });
});

// Health Check endpoint
server.get("/health_check", async function (req: Request, res: Response) {
    console.log("Heath Check endpoint called");
    res.status(200).json({status: 200});
});

server.get("*", function (req: Request, res: Response) {
    res.render("index.html", {
        VM_EXTERNAL_CLIENT_URL, CATI_DASHBOARD_URL
    });
});

server.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);
    res.render("../views/500.html", {});
});
export default server;
