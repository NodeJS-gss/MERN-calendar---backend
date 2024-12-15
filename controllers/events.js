const { response } = require('express');
const Event = require('../models/Event');

const getEvents = async(req, res = response) => {

    const events = await Event.find().populate('user', 'name');

    res.json({
        ok: true,
        events
    });
}

const createEvent = async(req, res = response) => {

    const eventReq = new Event(req.body);
    const user = req.user;
    
    try {

        eventReq.user = user.uid;

        const event = await eventReq.save();

        res.json({
            ok: true,
            event
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        });
    }
}

const updateEvent = async(req, res = response) => {

    const eventId = req.params.id;
    const user = req.user;

    try {

        const eventDB = await Event.findById(eventId);

        if(!eventDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Event not found'
            });
        }

        if( eventDB.user.toString() !== user.uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'Event cannot be updated'
            });
        }

        const newEventData = {
            ...req.body,
            user: user.uid
        }

        const eventUpdated = await Event.findByIdAndUpdate(eventId, newEventData, { new: true });

        res.json({
            ok: true,
            event: eventUpdated
        });    
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        });
    }
}

const deleteEvent = async(req, res = response) => {

    const eventId = req.params.id;
    const user = req.user;


    try {

        const event = await Event.findById(eventId);

        if(!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Event not found'
            });
        }

        if( event.user.toString() !== user.uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'Event cannot be deleted'
            });
        }

        await Event.findByIdAndDelete(eventId);

        res.json({
            ok: true,
            msg: "Event deleted"
        });    
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        });
    }
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}
