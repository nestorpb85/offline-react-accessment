import React from 'react';

import './Demo.css';
import Form from '../form/Form';
import Grid from '../grid/Grid';
import { isNameValid, getLocations } from '../mock-api/apis';


// Component wrapping the form and grid, holds state updated/used by both
function Demo(props) {

    const [locationNames, setLocationNames] = React.useState([]);
    const [tableEntries, setTableEntries] = React.useState([]);
    const [formKey, setFormKey] = React.useState(0);
    
    // Fetch the location names using the mock API
    React.useEffect(() => {
        getLocations().then(result => {
            setLocationNames(result);
        });
    }, [setLocationNames]);

    const submitHandler = React.useCallback((formData) => {
        // This generates a new array to trigger a prop change on the grid component
        const newEntries = tableEntries.slice();
        newEntries.push(formData);

        setTableEntries(newEntries);

        // Force a new form component to be mounted, this is just a hacky way to "reinstantiate"
        // the form and avoid having to make all the form inputs/dropdowns managed and reset them manually
        // In a real project the form could handle resetting all its input values internally
        // The locations have already been fetched and the form doesn't make API calls, the performance
        // impact in this case is minimal, I'm just saving some implementation time
        setFormKey(Date.now());

    }, [tableEntries, setTableEntries, setFormKey]);

    return (
        <div className="DemoWrapper">
            <Form key={formKey} options={locationNames} nameValidator={isNameValid} onSubmit={submitHandler} />
            <Grid entries={tableEntries} minRows={5} />
        </div>
    );
}

export default Demo;

