const Event = require("../Models/eventModel");
const ErrorHander = require("../utils/errorHandler");
const catchAsyncErrors = require("../Middlewares/catchAsyncErrors");
const Registeration= require("../Models/registerationModel");

exports.registerForEvent = catchAsyncErrors(async (req, res) => {
    const eventId  = req.params.id;

    const registeration = {
        user: req.user._id,
        event: eventId,
    };

    const existingRegistration = await Registeration.findOne(registeration);
    if(!existingRegistration){
        await Registeration.create(registeration);
    }
    const registerationCount = await Registeration.countDocuments({ event: eventId });

    await Event.findByIdAndUpdate(
        eventId, 
        { numberOfRegisterations: registerationCount },
        { new: true }
    );
    res.status(200).json({
        success: true,
        message: "Registered For the Event!"
    });
});

exports.getUserEvents = catchAsyncErrors(async (req,res, next)=>{
    const registerations = await Registeration.find({ user: req.user._id }).populate("event");
    const events = registerations.map(registeration => registeration.event);

    res.status(200).json({
        success: true,
        events,
    });
});