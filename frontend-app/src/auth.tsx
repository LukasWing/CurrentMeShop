import { useEffect, useState } from "react"
import { Button, Form, FormControl, Modal } from "react-bootstrap"
import { useHistory } from "react-router-dom"
interface LoginErrors {
    email?: string,
    pw?: string,
}
interface EnrolData {
    firstName: string;
    lastName: string;
    email: string;
    pw: string;
    pw2: string;
};
interface EnrolErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    pw?: string;
    pw2?: string;
};
interface IAuth {
    setLoggedIn: (loggedIn: boolean) => void,
    setUserId: (userId: number) => void,
}
interface ILoginForm {
    setValid: (valid: boolean) => void,
    email: string,
    setEmail: (valid: string) => void,
    setFirstName: (valid: string) => void,
    setLastName: (valid: string) => void
}
interface IEnrolForm {
    setValid: (valid: boolean) => void,
    setEmail: (valid: string) => void,
    setFirstName: (valid: string) => void,
    setLastName: (valid: string) => void
}

let falseInput = {color: "red"};
export const Auth = function({setLoggedIn, setUserId}:IAuth){
    const history = useHistory();
    const [valid, setValid] = useState(false);
    const handleClose = () => history.push("/");
    const [signUp, setSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const tryLogIn = async function() {    
        // add check on server
        console.log("email"+email);
        let reqObj = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify({'email': email})
        };
        let response = await fetch(`http://localhost:3000/customers/id/`, reqObj)
        try {
            let res: Promise<{customerId: number}> = await response.json();
            let cusId = (await res).customerId;
            alert("You have succesfully logged in. We did not bother checking your password. We trust you :)");
            setLoggedIn(true);
            console.log("cus"+cusId);
            setUserId(cusId);
            handleClose();
        } catch (err: any){
            alert("Error on login, see fields for info.");
            setLoggedIn(false);
            console.log(err.message);
        } 
    }
    const trySignUp = async () => {
        console.log(JSON.stringify({'email': email}));
        let response = await fetch("http://localhost:3000/customers", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify({'firstname':firstName, 'lastname':lastName,'email': email}),
        });
        try {
            let res: Promise<{customerId: number}> = await response.json();
            let cusId = (await res).customerId;
            setUserId(cusId);
            alert("Your user is set up and ready to go, happy shopping.")
            handleClose();
            setSignUp(false);
            setLoggedIn(true);
        } catch (err: any){
            alert("Error on sign up, check your input.");
        }
    }
    return (
        <Modal className="leftAligned" show={true} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                {signUp ? "Sign Up" : "Sign In"} to CurrentMe
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {signUp ? 
                <EnrolForm setValid={setValid} setEmail={setEmail}setFirstName={setFirstName} setLastName={setLastName} /> :
                <LoginForm setValid={setValid} email={email} setEmail={setEmail} setFirstName={setFirstName}  setLastName={setLastName} />}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={e => {setSignUp(!signUp)}} variant="secondary">
                    {signUp ? "Existing User" : "Create user"}
                </Button>
                <Button 
                    className="btn btn-primary"
                    disabled={!valid} 
                    onClick={signUp ? trySignUp : tryLogIn}
                >
                    {signUp ? "Sign Up" : "Sign In"}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
 /**
     * Validates email as non white space seperated by @ and .
     * visualisation: https://regexper.com/#%2F%5CS%2B%40%5CS%2B%5C.%5CS%2B%2F
     * @param email attempted email
     * @returns error description in {}
     */
let validateEmail = function (email: string) : LoginErrors{
    // 
    const gfgReg = /\S+@\S+\.\S+/; 
    const loweredEmail = String(email).toLowerCase();
    if(!gfgReg.test(loweredEmail)){
        return {email: "Invalid email, format should be you@domain.com"};
    } else {
        return {email: undefined}
    }
}
/**
 * Validate the password length
 * @param pass attempted pasword
 * @returns error description in {}
 */
let validatePassword = function(pass: string) : LoginErrors {
    if(pass.length > 256){
        return {pw: "Password too long"}
    } else {
        return {pw: undefined};
    }
}

export const LoginForm = function ({ setValid, email, setEmail} : ILoginForm){
    const [pw, setPW] = useState("");
    const [errors, setErrors] = useState<LoginErrors>({});
    const handleEmailInput = (e : React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setErrors(prev => ({...prev, ...validateEmail(e.target.value)}));
    }
    const handlePWInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPW(e.target.value);
        setErrors(prev => ({...prev, ...validatePassword(e.target.value)}));
    }
    const validate = () : LoginErrors => {
        return { ...validateEmail(email), ...validatePassword(pw)};
    };
    useEffect(() => {
        const allValid = validate().pw === undefined && validate().email === undefined;
        setValid(allValid);
    },[pw, email]);
    return ( 
        <Form>
            <Form.Label >Email</Form.Label>
            <FormControl type="email" placeholder="you@web.com" onChange={handleEmailInput}></FormControl>
            {errors.email ? <span style={falseInput}>{errors.email}</span> : null}
            <br></br>
            <Form.Label>Password</Form.Label>
            <FormControl type="password" onChange={handlePWInput}></FormControl>
            {errors.pw ? <span style={falseInput}>{errors.pw}</span> : null}
        </Form>
    )
}



export const EnrolForm = ({setValid, setEmail, setFirstName, setLastName} : IEnrolForm) => {
    useEffect(() => {
        setValid(false)
    }, []);

    const [state, setState] = useState<EnrolData>({firstName: "", lastName: "", email: "", pw: "", pw2: ""});
    const [errors, setErrors] = useState<EnrolErrors>({});

    /* section First name */
    // Validating and handling the first name entry in the form
    const validateFirstName = (value: string): EnrolErrors => {
        const regName: RegExp = /^([a-zA-Z]{2,}\s*)+$/;
        if (!regName.test(value)) {
            return {
                firstName: "Not a last valid name. " +
                    "Use of Non-character input not permitted."
};
        } else if (value.length > 15) {
            return {firstName: "Must be 15 characters or less"};
        }
        return {firstName: undefined};
    };

    const handleFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState((prev) => ({...prev, ...{firstName: event.target.value}}));
        setErrors((prev) => ({...prev, ...validateFirstName(event.target.value)}));
    };

    /* section Last name*/
    // Validating and handling the last name entry in the form
    const validateLastName = (value: string): EnrolErrors => {
        const regName: RegExp = /^([a-zA-Z]{2,}\s*)+$/;
        if (!regName.test(value)) {
            return {lastName: "Not a last valid name. " +
                              "Use of Non-character input not permitted."};
        } else if (value.length > 30) {
            return {lastName: "Must be 30 characters or less"};
        }
        return {lastName: undefined};
    };

    const handleLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState((prev) => ({...prev, ...{lastName: event.target.value}}));
        setErrors((prev) => ({...prev, ...validateLastName(event.target.value)}));
    };

    /* section Email */
    const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState((prev) => ({...prev, ...{email: event.target.value}}));
        setErrors((prev) => ({...prev, ...validateEmail(event.target.value)}));
    };

    /* section Password */
    // Validating and handling the password entry in the form
    const validatePassword = (value: string): EnrolErrors => {
        const regName: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        if (!regName.test(value)) {
            return {
                pw: "Not a valid password. " +
                    "It must be between 6 to 20 characters long, " +
                    "contain at least one numeric digit, " +
                    "one uppercase and one lowercase letter"
            };
        }
        return {pw: undefined};
    };

    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState((prev) => ({...prev, ...{pw: event.target.value}}));
        setErrors((prev) => ({...prev, ...validatePassword(event.target.value)}));
    };

    /* section Password recheck and match */
    // Validating and handling the password entry in the form
    const validatePasswordRecheck = (value: string): EnrolErrors => {
        const regName: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        if (value !== state.pw && value.length >= 0) {
            return {
                pw2: "Non-matching passwords"
            };
        }
        return {pw2: undefined};
    };

    const handlePasswordRecheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState((prev) => ({...prev, ...{pw2: event.target.value}}));
        setErrors((prev) => ({...prev, ...validatePasswordRecheck(event.target.value)}));
    };

    /* section Overall validation */
    const validate = (): EnrolErrors => {
        return {
            ...validateFirstName(state.firstName),
            ...validateLastName(state.lastName),
            ...validateEmail(state.email),
            ...validatePassword(state.pw),
            ...validatePasswordRecheck(state.pw2)
        };
    };

    // Create a new user on valid input
    useEffect(() => {
        const valErrors = validate();
        if (valErrors.firstName ||
            valErrors.lastName ||
            valErrors.email ||
            valErrors.pw ||
            valErrors.pw2) {
            setValid(false);
        } else {
            setValid(true);
            setEmail(state.email);
            setFirstName(state.firstName);
            setLastName(state.lastName);
        }
    },[state]);

    return (
        <Form>
            <Form.Label>First name</Form.Label>
            <FormControl type="text" placeholder="John" id={"firstName-input"} className={"firstname"}
                         value={state.firstName} onChange={handleFirstName} ></FormControl>
            {errors.firstName ? (<span style={{color: "red"}}>{errors.firstName}</span>) : null}
            <br></br>
            <Form.Label>Family name</Form.Label>
            <FormControl type="text" placeholder="Doe" id={"lastName-input"} className={"lastName"}
                         value={state.lastName} onChange={handleLastName} ></FormControl>
            {errors.lastName ? (<span style={{color: "red"}}>{errors.lastName}</span>) : null}
            <br></br>
            <Form.Label>Email</Form.Label>
            <FormControl type="email" placeholder="you@web.com" id={"email-input"} className={"email"}
                         value={state.email} onChange={handleEmail} ></FormControl>
            {errors.email ? (<span style={{color: "red"}}>{errors.email}</span>) : null}
            <br></br>
            <Form.Label>Password</Form.Label>
            <FormControl type="password" id={"pw-input"} className={"pw"}
                         value={state.pw} onChange={handlePassword} ></FormControl>
            {errors.pw ? (<span style={{color: "red"}}>{errors.pw}</span>) : null}
            <br></br>
            <Form.Label>Repeat Password</Form.Label>
            <FormControl type="password" id={"pw2-input"} className={"pw2"}
                         value={state.pw2} onChange={handlePasswordRecheck} ></FormControl>
            {errors.pw2 ? (<span style={{color: "red"}}>{errors.pw2}</span>) : null}
        </Form>
    )
}