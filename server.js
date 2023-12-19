import express from 'express'
import { loggerService } from './services/logger.service.js'
import { bugService } from './services/bug.service.js'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


// Get Bugs (READ)
app.get('/api/bug', (req, res) => {
    console.log(req.query);
    const filterBy = {
        title: req.query.title || '',
        minSeverity: req.query.minSeverity || 0,
    }
    const sortBy = {
        type: req.query.type,
        sortDir: +req.query.sortDir || 1
    }
    bugService.query(filterBy, sortBy)
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

//Add Bug (CREATE)
app.post('/api/bug', (req, res) => {
    const bugToSave = {
        title: req.body.title,
        severity: +req.body.severity,
    }
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

//Edit Bug(UPDATE)
app.put('/api/bug', (req, res) => {
    const bugToSave = {
        title: req.body.title,
        severity: +req.body.severity,
        _id: req.body._id
    }
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

//Get Bug(READ)
app.get('/api/bug/:id', (req, res) => {
    let visitedBugs = req.cookies.visitedBugs || [];

    if (visitedBugs.length >= 3) {
        return res.status(401).send('Wait for a bit');
    }

    if (visitedBugs && !visitedBugs.includes(req.params.id)) {
        visitedBugs.push(req.params.id);
    }

    res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 });

    const bugId = req.params.id
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})
//Remove Bug (DELETE)
app.delete('/api/bug/:id', (req, res) => {
    const bugId = req.params.id
    bugService.remove(bugId)
        .then(() => res.send(bugId))
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})




const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)
