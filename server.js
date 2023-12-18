import express from 'express'
import { loggerService } from './services/logger.service.js'
import { bugService } from './services/bug.service.js'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())

// Get Bugs (READ)
app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

//Get Bug (READ)
app.get('/api/bug/save', (req, res) => {
    const bugToSave = {

        title: req.query.title,
        severity: +req.query.severity,
        _id: req.query._id
    }
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

//Get Bug(READ)
app.get('/api/bug/:bugId', (req, res) => {
    let visitedBugs = req.cookies.visitedBugs || [];

    if (visitedBugs.length >= 3) {
        return res.status(401).send('Wait for a bit');
    }

    if (visitedBugs && !visitedBugs.includes(req.params.bugId)) {
        visitedBugs.push(req.params.bugId);
    }

    res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 });

    const bugId = req.params.bugId
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})
//Remove Bug (DELETE)
app.get('/api/bug/:bugId/remove', (req, res) => {
    const bugId = req.params.bugId
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
