

export function BugPreview({ bug }) {
    console.log("bug:", bug)

    return <article>
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>Severity: <span>{bug.severity}</span></p>
        <p>Creator: <span>{bug.creator.fullname}</span></p>
    </article>
}