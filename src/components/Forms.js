import React from 'react';
import styled from 'styled-components'
import * as formik from "formik";

export const FormField = styled.div`
    width: 100%;
    margin-bottom: 1.5em;
`;

const ErrorMessage = props=><formik.ErrorMessage component={'div'} {...props}/>;

export const styleErrorMessage = comp => styled(comp)`
  color: red;
  font-size: .9em;
`;

export const ErrorMessageContainer = styleErrorMessage(ErrorMessage);

export const FullField = ({ name, label, placeholder, type, ...props }) => {
    return <FormField>
        <label htmlFor={name}>{label}</label>
        <input name={name} id={name} placeholder={placeholder} type={type} {...props.field} />
        <ErrorMessageContainer name={props.field.name}/>
    </FormField>
};