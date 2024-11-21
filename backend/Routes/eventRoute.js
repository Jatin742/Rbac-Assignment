const express = require("express");
const {
    createEvent,
    getAllEvents,
    getAdminEvents,
    getEventDetails,
    updateEvent,
    deleteEvent
} = require("../Controllers/eventController");
const { isAuthenticatedUser, authorizeRoles } = require("../Middlewares/auth");
const { registerForEvent } = require("../Controllers/registerationController");

const Router = express.Router();

Router.route("/events").get(getAllEvents);

Router
    .route("/admin/events").get(isAuthenticatedUser, authorizeRoles("admin"), getAdminEvents);

Router.route("/event/:id")
    .get(getEventDetails)
    .put(isAuthenticatedUser, registerForEvent);

Router
    .route("/admin/event/new")
    .post(isAuthenticatedUser, authorizeRoles("admin"), createEvent);

Router.route("/admin/event/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateEvent)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteEvent);


module.exports = Router;