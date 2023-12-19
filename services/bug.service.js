import fs from 'fs'
import { utilService } from '../services/utils.service.js'


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
        if (sortBy.sortDir === -1) bugsToReturn = bugsToReturn.reverse()
    }
    return Promise.resolve(bugsToReturn)
}

function sortByBugs(sortBy) {
    let bugsToSort = bugs;

    if (sortBy.type === 'title') {
        return bugsToSort.sort((bug1, bug2) => {
            const nameA = bug1.title.toUpperCase();
            const nameB = bug2.title.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });
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




function save(bug) {
    if (bug._id) {
        const bugIdx = bugs.findIndex(currBug => currBug._id === bug._id)
        bugs[bugIdx] = bug
    } else {
        bug._id = utilService.makeId()
        bug.createdAt = Date.now()
        bugs.unshift(bug)
    }
    return _saveBugsToFile().then(() => bug)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Bug dosent exist!')
    return Promise.resolve(bug)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
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

