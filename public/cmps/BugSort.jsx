
const { useState, useEffect } = React


export function BugSort({ sortBy, onSetSort }) {

    const [sortByToEdit, setSortByToEdit] = useState(sortBy)


    useEffect(() => {
        onSetSort(sortByToEdit)
    }, [sortByToEdit])

    function handleSelect(ev) {
        ev.preventDefault()
        const selectedSort = ev.target.value
        setSortByToEdit((prevSort) => ({ ...prevSort, type: selectedSort }))
    }



    return (
        <select onChange={handleSelect} name="sorts" id="sort-select">
            <option value="" hidden>Sort By:</option>
            <option value="">None</option>
            <option value="title">title</option>
            <option value="minSeverity">minSeverity</option>
            <option value="createdAt">createdAt</option>
        </select>
    )
}