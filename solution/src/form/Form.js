
import React from 'react';

import './Form.css';

// Component wrapping just the form logic
function Form(props) {

    // These could use some error checking/handling/defaulting if needed
    const { options, nameValidator, onSubmit: onSubmitHandler } = props;

    const [validName, setValidName] = React.useState('');
    const [isNameValid, setIsNameValid] = React.useState(true);

    // Internal form submit handler, prevents refresh, extracts form data and calls the
    // external submit handler, it also attempts to guard against unvalidated submissions.
    const onSubmit = React.useCallback((e) => {
        // Prevent page reload
        e.preventDefault();
    
        // Extract form data and call the external handler
        const formData = new FormData(e.target);
        const resultObject = Object.fromEntries(formData.entries());

        // To avoid a user quickly submitting via enter key while validation is in process
        // We could use the submit button's disabled state, but it looks odd to have the button
        // disable/enable itself too much during validation
        if (resultObject.name !== validName) {
            return;
        }
    
        onSubmitHandler && onSubmitHandler(resultObject);
      }, [onSubmitHandler, validName]);

    // Change handler for the name field, validates asynchronously as the field changes,
    // it also attempts to guard against race conditions with earlier validations coming in later
    const onNameChange = React.useCallback((e) => {
        // Store the name we are validating to later see if it's stale
        const nameToValidate = e.target.value;
        if (nameValidator) {
            nameValidator(nameToValidate).then(result => {
                // Check the value we requested validation for against the current input value,
                // if they are different we can discard the result, ie, no-op
                if (e.target.value === nameToValidate) {
                    setIsNameValid(result);
                    setValidName(nameToValidate);
                }
            });
        } else {
            // If no validator just assume the name is valid for simplicity
            setIsNameValid(true);
            setValidName(nameToValidate);
        }

    }, [nameValidator, setIsNameValid, setValidName]);

    // Basic handler for  when the form is cleared to also reset the valid state
    const onClear = React.useCallback((e) => {
        setIsNameValid(true);
        setValidName('');
     }, [setIsNameValid]);

    // Simple form skeleton wired up to the state/handlers above
    return (
        <div className="FormWrapper">
            <form className="Form" id="formId" onSubmit={onSubmit}>
                <p className="InputRow">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" required minLength="1" maxLength="100" size="20" onChange={onNameChange}/>
                    {!isNameValid && <div className="ErrorMsg">This name has already been taken</div>}
                </p>

                <p className="InputRow">
                    <label htmlFor="location">Location</label>
                    <select id="location" name="location" required>
                        {options.map((option, idx) => {
                            return (<option key={idx}>{option}</option>);
                        })}
                    </select>
                </p>
            </form>
            <div className="ButtonRow">
                <input type="reset" value="Clear" form="formId" onClick={onClear} />
                <input type="submit" value="Add" form="formId" disabled={!isNameValid} />
            </div>
        </div>
    );
}

export default Form;
