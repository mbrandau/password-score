import React from 'react';
import './App.scss';
import PasswordField from './components/PasswordField';
import {FullField} from './components/Forms';
import {Field, Form, Formik} from "formik";
import zxcvbn from 'zxcvbn';
import styled from 'styled-components';

export const styledButton = tag => styled(tag)`
  display: block;
  width: 100%;
  background: #77c563;
  color: white;
  padding: .75em 1.5em;
  border-radius: 4px;
  font-size: 1em;
  transition: all .2s ease-in-out;
  cursor: pointer;
  font-weight: 700;
  
  &:hover, &:focus {
    background: #67b058;
  }
  
  &[disabled] {
    background: transparent;
    border: 1px solid #ccc;
    color: #aaa;
    cursor: not-allowed;
  }
`;

const Button = styledButton('button');

function App() {
    return <>
        <header>
            <p>This my attempt at a non-frustrating sign up form. It uses <a
                href="https://github.com/dropbox/zxcvbn">zxcvbn</a> and <a
                href="https://haveibeenpwned.com/API/v3#PwnedPasswords">"Have I Been Pwned"s password API</a> to check
                the passwords and generates secure passwords using <a
                    href="https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases">EFFs diceware
                    wordlist</a>.</p>
        </header>
        <main>
            <div className="App">
                <h1>Create Account</h1>
                <Formik
                    initialValues={{email: '', password: ''}}
                    validate={async values => {
                        let errors = {};
                        if (!values.email) {
                            errors.email = 'Required';
                        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                            errors.email = 'Invalid email address';
                        }
                        if (!values.password) {
                            errors.password = 'Required';
                        } else if (zxcvbn(values.password).score < 3) {
                            errors.password = 'Not safe enough'
                        }
                        return errors;
                    }}
                    onSubmit={(values, {setSubmitting}) => {
                        setSubmitting(true);
                        setTimeout(() => {
                            alert(JSON.stringify(values, null, 2));
                            setSubmitting(false);
                        }, 400);
                    }}
                >
                    {({isSubmitting,isValid}) => (
                        <Form>
                            <Field component={FullField} name="email" placeholder="Enter your email adress"
                                   label="Email"/>
                            <Field component={PasswordField} name="password"/>
                            <Button type="submit" disabled={isSubmitting || !isValid}>
                                Submit
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </main>
    </>;
}

export default App;
