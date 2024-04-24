import React from 'react';

import './Grid.css';

// Component wrapping just the grid logic
function Grid(props) {

    // Could use error checking/handling/defaulting if needed
    const { entries, minRows } = props;

    // Insert some empty rows if there aren't enough entries to make the table have some height
    // even when it has no entries
    const entriesToRender = React.useMemo(() => {
        if (entries.length < minRows) {
            const toRender = entries.slice();
            for (let i = toRender.length; i < minRows; i++) {
                toRender.push({name: '', location: ''});
            }

            return toRender;
        }
        return entries;
    }, [entries, minRows])

    // Simple table with header and alternating row styles
    return (
        <div className="GridWrapper">
            <table className="Table">
                <thead className="TableHeader">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Location</th>
                    </tr>
                </thead>
                <tbody>
                    {entriesToRender.map((entry, idx) => {
                        // Alternate the row styles
                        return (<tr key={idx} className={idx % 2 === 0 ? 'DarkRow' : 'LightRow'}>
                            <td>{entry.name}</td>
                            <td>{entry.location}</td>
                        </tr>);
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Grid;
