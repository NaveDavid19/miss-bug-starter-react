import fs from 'fs'
import { utilService } from './util.service.js'


export const bugService = {
    query,
    save,
    getById,
    remove
}

const bugs = utilService.readJsonFile('data/bug.json')


function query(filterBy, sortBy) {
    let bugsToReturn = bugs
    if (filterBy.title) {
        const regExp = new RegExp(filterBy.title, 'i')
        bugsToReturn = bugsToReturn.filter(bug => regExp.test(bug.title))
    }
    if (filterBy.minSeverity) {
        bugsToReturn = bugsToReturn.filter(bug => bug.severity >= filterBy.minSeverity)
    }
    if (sortBy.type) {
        bugsToReturn = sortByBugs(sortBy)
        if (sortBy.sortDir) bugsToReturn = bugsToReturn.reverse()
    }
    return Promise.resolve(bugsToReturn)
}

function sortByBugs(sortBy) {
    let bugsToSort = bugs;

    if (sortBy.type === 'title') {
        return bugsToSort.sort((bug1, bug2) => bug1.title.localeCompare(bug2.title))
    }
    if (sortBy.type === 'minSeverity') {
        return bugsToSort.sort((bug1, bug2) => bug1.severity - bug2.severity);
    }

    if (sortBy.type === 'createdAt') {
        return bugsToSort.sort((bug1, bug2) => bug1.createdAt - bug2.createdAt);
    }
    if (sortBy.type === 'none') {
        return bugsToSort
    }
    return bugsToSort;
}




function save(bug, loggedInUser) {
    if (bug._id) {
        const bugToUpdate = bugs.find(currBug => currBug._id === bug._id)
        if (!loggedInUser.isAdmin && bugToUpdate.creator._id !== loggedInUser._id) {
            return Promise.reject('Not your car')
        }
        bugToUpdate.title = bug.title
        bugToUpdate.severity = bug.severity
    } else {
        bug._id = utilService.makeId()
        bug.createdAt = Date.now()
        bug.creator._id = loggedInUser._id
        bug.creator.fullname = loggedInUser.fullname
        bugs.unshift(bug)
    }
    return _saveBugsToFile().then(() => bug)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Bug dosent exist!')
    return Promise.resolve(bug)
}

function remove(bugId, loggedInUser) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx === -1) return Promise.reject('No Such Car')
    const bug = bugs[bugIdx]
    if (!loggedInUser.isAdmin && bug.creator._id === loggedInUser._id) {
        return Promise.reject('Not your bug')
    }
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}


function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                console.log(err);
                return reject(err)

            }
            resolve()
        })
    })
}

