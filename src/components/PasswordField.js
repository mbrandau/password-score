import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import zxcvbn from 'zxcvbn'
import {FormField, styleErrorMessage} from './Forms';
import {haveIBeenPwned} from "../utils/hibp";
import {generatePassword} from "../utils/diceware";

const MeterSegment = styled.div`
    height: 7px;
    border-radius: 2px;
    background: ${({color}) => color};
`;
const MeterWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 4px;
    margin-bottom: 8px;
`;

const getColor = (level, segment) => {
    if (level !== undefined) {
        // All red
        if (level === 0) return '#ff6678';

        if (level === 1 && segment === 0) return '#ff6678';
        if (level === 2 && segment <= 1) return '#ffaf21';
        if (level === 3 && segment <= 2) return '#f8e024';
        if (level === 4 && segment <= 3) return '#81d068';
        if (level === 5) return '#81d068';
    }
    return '#e7e7e7';
};

const PasswordMeter = ({level}) => {
    return <MeterWrapper>
        <MeterSegment color={getColor(level, 0)}/>
        <MeterSegment color={getColor(level, 1)}/>
        <MeterSegment color={getColor(level, 2)}/>
        <MeterSegment color={getColor(level, 3)}/>
        <MeterSegment color={getColor(level, 4)}/>
    </MeterWrapper>
};

const Suggestions = styled.p`
  color: #888;
  font-size: .9em;
  margin: 8px 0 1.5em;
`;

const ErrMsg = styleErrorMessage('div');

export const PasswordField = ({field: {onChange, ...field}, form: {values: {name, email}, ...form}}) => {
    const [visible, setVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [result, setResult] = useState();
    const [error, setError] = useState();
    const [meterLevel, setMeterLevel] = useState();
    useEffect(() => {
        let userInputs = [];
        if (name) userInputs = [...userInputs,name,...name.split(' ')];
        if (email) userInputs = [...userInputs,email,...email.split(/[.@]/)];

        const result = zxcvbn(password, userInputs);
        console.log({userInputs,result});
        setResult(result);
        setError(result.feedback.warning || undefined);
        setMeterLevel(result.score === 0 ? 1 : (result.guesses_log10 >= 20 ? 5 : result.score));
        let discard = false;
        if (result.score > 2) {
            haveIBeenPwned(password).then(pwned => {
                if (!discard && pwned) {
                    setResult({
                        score: 0,
                        guesses_log10: 0,
                        feedback: {warning: '', suggestions: ['Use a different password']}
                    });
                    setError('This password has been leaked before');
                    setMeterLevel(0);
                }
            });
        }
        return () => discard = true;
    }, [password, name, email]);
    return <FormField>
        <label htmlFor="password" style={{display: 'flex', justifyContent: 'space-between'}}>
            Password
            <div>
                <button style={{fontWeight: 'normal'}} href="#" onClick={() => {
                    const pw = generatePassword();
                    setPassword(pw);
                    form.setFieldValue(field.name, pw);
                    setVisible(true);
                }}>generate</button>{' '}
                <button style={{fontWeight: 'normal'}} href="#"
                   onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'show'}</button>
            </div>
        </label>

        <input id="password" type={visible ? 'text' : 'password'} placeholder="Enter a strong password" onChange={e => {
            setPassword(e.target.value);
            onChange(e);
        }} {...field} />
        <PasswordMeter level={meterLevel}/>
        {error && <ErrMsg>{error}</ErrMsg>}
        {result && result.feedback.suggestions.length > 0 && <Suggestions>
            <b>Tips:</b><br/>
            {result.feedback.suggestions.map((w, i) => <>{w}<br/></>)}
        </Suggestions>}
    </FormField>
};

export default PasswordField