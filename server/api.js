const express = require('express');
const { getFromDatabaseById, getAllFromDatabase, addToDatabase, updateInstanceInDatabase, deleteFromDatabasebyId, deleteAllFromDatabase, createMeeting, isValidIdea, isValidMinion} = require('./db');
const apiRouter = express.Router();
const checkMillionDollarIdea = require('./checkMillionDollarIdea');

//Params 

apiRouter.param('minionId', (req, res, next, id) => {
    const minion = getFromDatabaseById('minions', id);
    if (minion) {
        req.minion = minion
        next();
    } else {
        const err = new Error('Minion not found!')
        err.status = 404;
        next(err);
    }
});

apiRouter.param('ideaId', (req, res, next, id) => {
    const idea = getFromDatabaseById('ideas', id);
    if (idea) {
        req.idea = idea;
        next();
    } else {
        const err = new Error('Idea not found!');
        err.status = 404;
        next(err);
    }
});

//Check valid formats for put/post requests 

const checkValidMinion = (req, res, next) => {
    try { 
        isValidMinion(req.body);
        next();
    } catch (error) {
        error.status = 400;
        return next(error);
    }
};

const checkValidIdea = (req, res, next ) => {
    try {
        isValidIdea(req.body);
        next();
    } catch (error) {
        error.status = 400;
        return next(error);
    }
};

//Minions routes

apiRouter.get('/minions', (req, res, next) => {
    const minions = getAllFromDatabase('minions');
    res.status(200).send(minions);
});

apiRouter.post('/minions', checkValidMinion, (req, res, next) => {
    const newMinion = addToDatabase('minions', req.body);
    res.status(201).send(newMinion);
});

apiRouter.get('/minions/:minionId', (req, res, next) => {
    res.status(200).send(req.minion);
});

apiRouter.put('/minions/:minionId', checkValidMinion, (req, res, next) => {
    const updatedMinion = updateInstanceInDatabase('minions', req.body);
    if (updatedMinion) {
        res.status(200).send(updatedMinion);
    } else {
        const error = new Error('Minion not found!');
        error.status = 404;
        next(error);
    }
});

apiRouter.delete('/minions/:minionId', (req, res, next) => {
    const deletedMinion = deleteFromDatabasebyId('minions', req.params.minionId);
    if (deletedMinion) {
        res.status(204).send();
    } else {
        const error = new Error('Minion not found!');
        error.status = 404;
        next(error);
    }
});

//Ideas Routes

apiRouter.get('/ideas', (req, res, next) => {
    const ideas = getAllFromDatabase('ideas');
    res.status(200).send(ideas);
});
apiRouter.post('/ideas', checkValidIdea, checkMillionDollarIdea, (req, res, next) => {
    const newIdea = addToDatabase('ideas', req.body);
    res.status(201).send(newIdea);
});
apiRouter.get('/ideas/:ideaId', (req, res, next) => {
    res.status(200).send(req.idea);
});
apiRouter.put('/ideas/:ideaId', checkValidIdea, checkMillionDollarIdea, (req, res, next) => {
    const updatedIdea = updateInstanceInDatabase('ideas', req.body);
    if (updatedIdea) {
        res.status(200).send(updatedIdea);
    } else {
        const error = new Error('Idea not found!')
        error.status = 404;
        next(error);
    }
});
apiRouter.delete('/ideas/:ideaId', (req, res, next) => {
    const deletedIdea = deleteFromDatabasebyId('ideas', req.params.ideaId);
    if (deletedIdea) {
        res.status(204).send();
    } else {
        const error = new Error('Idea not found!');
        error.status = 404;
        next(error);
    }
});

//Meetings Routes

apiRouter.get('/meetings', (req, res, next) => {
    const meetings = getAllFromDatabase('meetings');
    res.status(200).send(meetings);
});

apiRouter.post('/meetings', (req, res, next) => {
    const meeting = createMeeting();
    addToDatabase('meetings', meeting);
    res.status(201).send(meeting);
});

apiRouter.delete('/meetings', (req, res, next) => {
    deleteAllFromDatabase('meetings');
    res.status(204).send();
});

apiRouter.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).send(err.message);
})

module.exports = apiRouter;
