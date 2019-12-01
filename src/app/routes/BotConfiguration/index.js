import React from 'react'
import {
    Card,
    Paper,
    Grid,
    CardHeader,
    Button,
    CardContent,
    FormControl,
    InputLabel,
    Input,
    Avatar,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Switch,
    FormControlLabel,
    Checkbox,
    FormGroup,
    FormHelperText
} from '@material-ui/core'
import { purple } from '@material-ui/core/colors'
import botPlaceHolder from '../../../assets/images/bot.png'
import userPlaceHolder from '../../../assets/images/placeholder.jpg'
import ContainerHeader from 'components/ContainerHeader';
import IntlMessages from 'util/IntlMessages';
import { SketchPicker } from 'react-color'
import axios from 'axios'
import ChatBot from 'react-simple-chatbot';
import EmailPhoneInput from './EmailPhoneInput'
import defaultTheme from './botDefaultStyle'
import gradients from './gradientList'
import { ThemeProvider } from 'styled-components';
import SendIcon from '@material-ui/icons/Send';

let defaultBotConfig = {
    name: 'Bot',
    theme: defaultTheme,
    enableSurvey: false,
    enableLiveChat: true,
    surveyConfig: {
        intro: 'Please introduce yourself',
        requireEmail: true,
        requirePhone: false,
    },
}

const styles = {
    optionTitle: {
        fontSize: '17px',
    },
    surveyContainer: {
        marginTop: '10px',
        width: '100%',
    },
    chatBubble: {

    },
}

let _isMount = false;
let shopId = 0
class BotConfiguration extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            botName: Object.assign({}, defaultBotConfig).name,
            openColorPicker: false,
            theme: Object.assign({}, defaultBotConfig).theme,
            enableSurvey: Object.assign({}, defaultBotConfig).enableSurvey,
            enableLiveChat: Object.assign({}, defaultBotConfig).enableLiveChat,
            showSurveyScreen: true,
            surveyConfig: Object.assign({}, defaultBotConfig).surveyConfig,
            hasConfig: false,
            saveStatus: false,
        }
        var user = JSON.parse(localStorage.getItem('user'))
        if (user && user.shopId) {
            shopId = user.shopId
            console.log("shopId: " + shopId)
        }
    }

    componentDidMount() {
        _isMount = true
        axios.get('http://localhost:3001/api/bot-config/' + shopId).then(res => {
            var config = res.data.botConfig
            console.log(config)
            if (config) {
                var _enableSurvey = (config.requireEmail || config.requirePhone) ? true : false;
                //setting default object to use when reset config
                defaultBotConfig = {
                    ...defaultBotConfig,
                    name: config.botName,
                    theme: {
                        ...defaultBotConfig.theme,
                        headerBgColor: config.backgroundColor,
                        headerFontColor: config.textColor,
                        userBubbleColor: config.backgroundColor,
                        userFontColor: config.textColor
                    },
                    enableSurvey: _enableSurvey,
                    enableLiveChat: config.liveChat,
                    surveyConfig: {
                        ...this.state.surveyConfig,
                        intro: config.intro,
                        requireEmail: (_enableSurvey && !config.requireEmail) ? false : true,
                        requirePhone: (_enableSurvey && config.requirePhone) ? true : false,
                    }
                }
                this.setState({
                    hasConfig: true,
                    botName: Object.assign({}, defaultBotConfig).name,
                    theme: Object.assign({}, defaultBotConfig).theme,
                    enableSurvey: Object.assign({}, defaultBotConfig).enableSurvey,
                    enableLiveChat: Object.assign({}, defaultBotConfig).enableLiveChat,
                    surveyConfig: Object.assign({}, defaultBotConfig).surveyConfig
                })
            }
        })
    }

    componentWillUnmount() {
        _isMount = false
    }

    handleReset = () => {
        this.setState({
            botName: Object.assign({}, defaultBotConfig).name,
            theme: Object.assign({}, defaultBotConfig).theme,
            enableSurvey: Object.assign({}, defaultBotConfig).enableSurvey,
            enableLiveChat: Object.assign({}, defaultBotConfig).enableLiveChat,
            surveyConfig: Object.assign({}, defaultBotConfig).surveyConfig,
        })
    }

    handleSave = () => {
        var config = {
            botName: this.state.botName,
            shopId: shopId,
            textColor: this.state.theme.userFontColor,
            backgroundColor: this.state.theme.userBubbleColor,
            configDate: new Date(),
            intro: this.state.surveyConfig.intro,
            liveChat: this.state.enableLiveChat,
            requireEmail: (this.state.enableSurvey && this.state.surveyConfig.requireEmail) ? true : false,
            requirePhone: (this.state.enableSurvey && this.state.surveyConfig.requirePhone) ? true : false,
        }
        if (this.state.hasConfig) {
            axios.put('http://localhost:3001/api/bot-config/' + shopId, config)
                .then(res => {
                    console.log("update config response")
                    console.log(res.data)
                    this.setState({ saveStatus: true })
                })
        } else {
            axios.post('http://localhost:3001/api/bot-config', config)
                .then(res => {
                    console.log("save config response")
                    console.log(res.data)
                    this.setState({ saveStatus: true })
                })
        }

    }
    handleChangeName = (event) => {
        this.setState({
            botName: event.target.value
        })
    }

    handleChangeBackground = (color) => {
        this.setState({
            theme: {
                ...this.state.theme,
                headerBgColor: color.hex,
                userBubbleColor: color.hex,
            }
        })
    }

    handleChangeTextColor = (color) => {
        this.setState({
            theme: {
                ...this.state.theme,
                headerFontColor: color.hex,
                userFontColor: color.hex,
            }
        })
    }

    handleChangeTheme = (gradient) => {
        this.setState({
            theme: {
                ...this.state.theme,
                headerBgColor: gradient.background,
                headerFontColor: gradient.color,
                userBubbleColor: gradient.background,
                userFontColor: gradient.color,
            }
        })
    }

    handleOpenPicker = () => {
        this.setState({
            openColorPicker: true
        })
    }

    handleClosePicker = () => {
        this.setState({
            openColorPicker: false
        })
    }

    handleCloseSave = () => {
        this.setState({
            saveStatus: false
        })
    }

    handleSurveyScreen = () => {
        this.setState({
            showSurveyScreen: !this.state.showSurveyScreen
        })
    }

    handleEmailRequire = (event) => {
        if (!event.target.checked && this.state.surveyConfig.requireEmail && !this.state.surveyConfig.requirePhone) {
            return;
        }
        this.setState({ surveyConfig: { ...this.state.surveyConfig, requireEmail: event.target.checked } })
    }

    handlePhoneRequire = (event) => {
        if (!event.target.checked && !this.state.surveyConfig.requireEmail && this.state.surveyConfig.requirePhone) {
            return;
        }
        this.setState({ surveyConfig: { ...this.state.surveyConfig, requirePhone: event.target.checked } })
    }

    handleSurveyIntroChange = (event) => {
        this.setState({ surveyConfig: { ...this.state.surveyConfig, intro: event.target.value } })
    }

    handleLiveChat = () => {
        this.setState({ enableLiveChat: !this.state.enableLiveChat })
    }

    handleSurvey = () => {
        this.setState({ enableSurvey: !this.state.enableSurvey })
    }

    render() {
        let emailAndPhoneInput =
            <EmailPhoneInput
                theme={this.state.theme}
                surveyConfig={this.state.surveyConfig}
                onSubmitInfo={this.handleSurvey}
            />;
        let backgroundPicker =
            <div>
                {gradients.map((gradient, i) => (
                    <div
                        key={i}
                        style={{
                            display: 'inline-block',
                            margin: '5px',
                            background: `${gradient.background}`,
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            cursor: 'pointer',
                            boxShadow: this.state.theme.headerBgColor === gradient.background ?
                                'rgba(0, 77, 255, 0.5) 0 0 3px 3px' : ''
                        }}
                        onClick={() => this.handleChangeTheme(gradient)}
                    >
                    </div>
                ))}
            </div>

        let survey =
            <div style={styles.surveyContainer}>
                <FormControl style={{ width: '100%' }}>
                    <InputLabel htmlFor="intro">Introduction line</InputLabel>
                    <Input id="intro"
                        value={this.state.surveyConfig.intro}
                        onChange={this.handleSurveyIntroChange}
                        fullWidth={true} />
                </FormControl>
                <FormControl style={{ width: '100%' }}>
                    <FormGroup>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.surveyConfig.requireEmail}
                                            onChange={this.handleEmailRequire}
                                            value="emailRequire"
                                            color="primary"
                                        />
                                    }
                                    label="Require email"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.surveyConfig.requirePhone}
                                            onChange={this.handlePhoneRequire}
                                            value="phoneRequire"
                                            color="primary"
                                        />
                                    }
                                    label="Require phone"
                                />
                            </Grid>
                        </Grid>
                    </FormGroup>
                    <FormHelperText>You have to choose at least 1 option</FormHelperText>
                </FormControl>
            </div>

        let steps = [
            { id: 'greeting', message: 'Xin chào, Tôi là hệ thống hỗ trợ khách hàng. Tôi có thể giúp gì cho bạn?', trigger: 'user' },
            { id: 'user', message:'mình muốn tìm áo', end: true }
        ]
        return (
            <div className="app-wrapper" >
                <ContainerHeader match={this.props.match} title={<IntlMessages id="Store Management" />} />
                <Grid container spacing={1}>
                    <Grid item xs={8}>
                        <Card style={{ minHeight: '300px' }}>
                            <CardHeader title="Bot information" />
                            <CardContent>
                                <FormControl>
                                    <InputLabel htmlFor="bot-name">Name</InputLabel>
                                    <Input id="bot-name"
                                        value={this.state.botName}
                                        onChange={this.handleChangeName} />
                                </FormControl>
                                <br /><br />
                                <span style={styles.optionTitle}>Background color: </span>
                                {backgroundPicker}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleOpenPicker}
                                >
                                    Style your own color
                                </Button>
                                <br /><br />
                                {/* <span style={styles.optionTitle}>Enable live-chat: </span>
                                <Switch
                                    checked={this.state.enableLiveChat}
                                    onChange={this.handleLiveChat}
                                    value="livechat"
                                    color="primary"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                                <br /><br />
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <span style={styles.optionTitle}>Pre-chat survey: </span>
                                        <Switch
                                            checked={this.state.enableSurvey}
                                            onChange={this.handleSurvey}
                                            value="survey"
                                            color="primary"
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        {
                                            this.state.enableSurvey ?
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={this.state.showSurveyScreen}
                                                            onChange={this.handleSurveyScreen}
                                                            value="showSurveyScreen"
                                                            color="primary"
                                                        />
                                                    }
                                                    label={this.state.showSurveyScreen ? 'Hide survey screen' : 'Open survey screen'}
                                                /> : ''
                                        }
                                    </Grid>
                                </Grid>
                                {this.state.enableSurvey ? survey : ''} */}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                                
                        {/* <ThemeProvider theme={this.state.theme}>
                            <ChatBot
                                headerTitle={this.state.botName}
                                floating={true}
                                hideBotAvatar={true}
                                hideUserAvatar={true}
                                bubbleStyle={{ borderRadius: '18px', margin: '2px 0px', }}
                                steps={steps}
                                hideHeader={true}
                                opened={true}
                            />
                        </ThemeProvider> */}
                        <Card style={{ minHeight: '300px' }}>
                            <div className = "message-area">
                                <strong>{this.state.botName}</strong>
                                <Card style={{
                                    maxWidth: '240px', 
                                    padding: '5px 10px', 
                                    marginBottom:'5px',
                                    borderRadius: '10px'}}>
                                    Xin chào, Tôi là hệ thống hỗ trợ khách hàng. Tôi có thể giúp gì cho bạn?
                                </Card>
                                <Card style={{
                                    maxWidth: '200px', 
                                    float:'right', 
                                    padding:'5px 10px',
                                    marginBottom:'5px',
                                    background: this.state.theme.userBubbleColor,
                                    color: this.state.theme.userFontColor,
                                    borderRadius: '10px'}}>
                                    mình muốn tìm áo
                                </Card>
                            </div>
                            <div className = "text-input">
                                <span className="chat-placeholder">Nhập tin nhắn...</span>
                                <SendIcon className="send-icon"/>
                            </div>
                        </Card>

                    </Grid>
                    <Grid item xs={12} style={{ textAlign: "right" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginRight: '10px' }}
                            onClick={this.handleSave}
                        >
                            Save
                        </Button>
                        <Button
                            variant="contained"
                            onClick={this.handleReset}
                        >
                            Reset
                        </Button>
                    </Grid>
                </Grid>
                {/* open color picker for background */}
                <Dialog
                    open={this.state.openColorPicker}
                    onClose={this.handleClosePicker}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogContent>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <span style={styles.optionTitle}>Background</span>
                                <SketchPicker
                                    color={this.state.theme.headerBgColor}
                                    onChangeComplete={this.handleChangeBackground}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <span style={styles.optionTitle}>Text Color</span>
                                <SketchPicker
                                    color={this.state.theme.headerFontColor}
                                    onChangeComplete={this.handleChangeTextColor}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>

                        <Button onClick={this.handleClosePicker} autoFocus variant="contained">
                            OK
                    </Button>
                    </DialogActions>
                </Dialog >
                {/*saving status*/}
                <Dialog
                    open={this.state.saveStatus}
                    onClose={this.handleCloseSave}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogContent>
                        <span style={styles.optionTitle}>Save success</span>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseSave} autoFocus variant="contained" color="primary">
                            OK
                    </Button>
                    </DialogActions>
                </Dialog >
            </div >
        )
    }
}

export default BotConfiguration