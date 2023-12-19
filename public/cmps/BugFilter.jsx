
const { useState, useEffect } = React


export function BugFilter({ filterBy, onSetFilter }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function onSetFilterBy(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }



    const { title, minSeverity } = filterByToEdit
    return (
        <section className="car-filter main-layout full">
            <form onSubmit={onSetFilterBy} >
                <label htmlFor="title">search: </label>
                <input value={title} onChange={handleChange} type="text" id="title" name="title" />
                <label htmlFor="minSeverity">minSeverity: </label>
                <input value={minSeverity} onChange={handleChange} type="number" id="minSeverity" name="minSeverity" />
            </form>
        </section>
    )
}