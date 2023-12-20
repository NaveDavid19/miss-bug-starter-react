const { useState, useEffect } = React;

export function BugSort({ sortBy, onSetSort }) {
    const [sortByToEdit, setSortByToEdit] = useState(sortBy);
    const [sortByDir, setSortByDir] = useState(false);

    useEffect(() => {
        onSetSort(sortByToEdit);
    }, [sortByToEdit, sortByDir]);

    function handleSelect(ev) {
        ev.preventDefault();
        const selectedSort = ev.target.value;
        setSortByToEdit((prevSort) => ({
            ...prevSort,
            sortDir: sortByDir,
            type: selectedSort,
        }));
    }

    return (
        <section>
            <label htmlFor="sort-select">Sort By:</label>
            <select onChange={handleSelect} name="sorts" id="sort-select">
                <option value="">None</option>
                <option value="title">Title</option>
                <option value="minSeverity">Min Severity</option>
                <option value="createdAt">Created At</option>
            </select>
            <label htmlFor="sortDir">Sort Direction</label>
            <input onChange={() => setSortByDir(!sortByDir)} type="checkbox" />
        </section>
    );
}
