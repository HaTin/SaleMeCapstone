import React from 'react';
import {Button, TextField, OutlinedInput} from '@material-ui/core'
import styled from 'styled-components'

const styles = {
    input: {
        margin: '3px'
    },
    geeting: {
        fontWeight:'600',
    },
    container : {
        position: 'fixed',
        height: '100%',
        width: '100%',
        zIndex: 1000,
        background: 'white',
    },
    centerDiv: {
        marginTop: '25%'
    }
}
class EmailPhoneInput extends React.Component {
    constructor(props) {
        super(props)
        // this.state = {
        //     theme: this.props.theme,
        // }
    }

    render(){
        const StyledButton = styled(Button)`
            background: ${this.props.theme.userBubbleColor};
            border-radius: 3px;
            border: 0;
            color: ${this.props.theme.userFontColor} !important;
            height: 48px;
            width: 61%;
            padding: 0 30px;
            `;
        return (
            <div style={styles.container}>
                <center style = {styles.centerDiv}>
                    <p style={styles.geeting}>{this.props.surveyConfig.intro}</p>
                    {
                        this.props.surveyConfig.requireEmail ? 
                        <OutlinedInput
                            id="email-input"
                            placeholder = "Enter your email"
                            style = {styles.input}
                        /> : ''
                    }
                    {
                        this.props.surveyConfig.requirePhone ? 
                        <OutlinedInput
                            id="phone-input"
                            placeholder = "Enter your phone number"
                            style = {styles.input}
                        /> : ''
                    }
                    
                    <br/>
                    <StyledButton onClick = {this.props.onSubmitInfo}>
                        GỬI
                    </StyledButton>
                </center>
            </div>
        )
    }
}
export default EmailPhoneInput