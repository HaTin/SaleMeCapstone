import React from 'react'
import {
    Grid,
    Button,
    InputLabel,
    Dialog,
    DialogContent,
    DialogActions,
} from '@material-ui/core'
import { SketchPicker } from 'react-color'
import axios from 'axios'
import { bot } from '../../../services/api'
import { Chat } from '@progress/kendo-react-conversational-ui';
import '@progress/kendo-theme-default/dist/all.css';
import defaultTheme from './botDefaultStyle'
import gradients from './gradientList'
import { connect } from 'react-redux'
import Swal from 'sweetalert2'
import ChipInput from 'material-ui-chip-input'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

let defaultBotConfig = {
    name: 'Bot',
    theme: defaultTheme,
    // enableSurvey: false,
    // enableLiveChat: true,
    // surveyConfig: {
    //     intro: 'Please introduce yourself',
    //     requireEmail: true,
    //     requirePhone: false,
    // },
}

const styles = {
    optionTitle: {
        fontSize: '17px',
    },
    surveyContainer: {
        marginTop: '10px',
        width: '100%',
    },
    keywordHint: {
        fontSize: 'small',
        color: 'rgba(0,0,0,0.7)'
    }
}

class BotConfiguration extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            botName: Object.assign({}, defaultBotConfig).name,
            openColorPicker: false,
            theme: Object.assign({}, defaultBotConfig).theme,
            hasConfig: false,
            messages: [],
            config: null,
            saveStatus: false,
            shopKeyword: []
        }
        this.MessageTemplate = this.MessageTemplate.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDeleteKeyword = this.handleDeleteKeyword.bind(this)
        this.handleAddKeyword = this.handleAddKeyword.bind(this)
    }

    async componentDidMount() {
        const { shopId } = this.props.authUser
        const [botRes, keyWordRes] = await Promise.all([
            bot.getBotConfig(shopId),
            bot.getKeyWord(shopId)])
        const config = botRes.data.botConfig
        const theme = {
            userBubbleColor: config.backgroundColor,
            userFontColor: config.textColor
        }
        const keywords = keyWordRes.data.keywords.map((k) => { return k.keyword })
        if (config) {
            this.setState({
                botName: config.botName,
                messages: [{
                    author: { id: 0, name: config.botName },
                    text: `Xin chào, Tôi là ${config.botName || 'Bot'}. Tôi có thể giúp gì cho bạn?`
                },
                {
                    author: { id: 1 },
                    text: 'Tôi muốn tìm áo'
                }],
                theme,
                config: config,
                shopKeyword: keywords
            })
        }
    }

    handleReset = () => {
        const { config, theme, messages } = this.state
        const botName = config.botName
        theme.userBubbleColor = config.backgroundColor
        theme.userFontColor = bot.textColor
        messages[0].author.name = botName
        messages[0].text = `Xin chào, Tôi là ${botName}. Tôi có thể giúp gì cho bạn?`
        this.setState({
            botName,
            theme: theme,
            messages
        })
    }

    // handleSave = () => {
    //     var config = {
    //         botName: this.state.botName,
    //         shopId: shopId,
    //         textColor: this.state.theme.userFontColor,
    //         backgroundColor: this.state.theme.userBubbleColor,
    //         configDate: new Date(),
    //         // intro: this.state.surveyConfig.intro,
    //         // liveChat: this.state.enableLiveChat,
    //         // requireEmail: (this.state.enableSurvey && this.state.surveyConfig.requireEmail) ? true : false,
    //         // requirePhone: (this.state.enableSurvey && this.state.surveyConfig.requirePhone) ? true : false,
    //     }
    //     if (this.state.hasConfig) {
    //         axios.put('http://localhost:3001/api/bot-config/' + shopId, config)
    //             .then(res => {
    //                 console.log("update config response")
    //                 console.log(res.data)
    //                 this.setState({ saveStatus: true })
    //             })
    //     } else {
    //         axios.post('http://localhost:3001/api/bot-config', config)
    //             .then(res => {
    //                 console.log("save config response")
    //                 console.log(res.data)
    //                 this.setState({ saveStatus: true })
    //             })
    //     }

    // }
    handleChangeName = (event) => {
        this.setState({
            botName: event.target.value
        })
    }

    handleChangeBackground = (color) => {
        this.setState({
            theme: {
                ...this.state.theme,
                // headerBgColor: color.hex,
                userBubbleColor: color.hex,
            }
        })
    }

    handleSubmit() {
        const { shopId } = this.props.authUser
        const { botName, theme } = this.state
        const config = {
            botName,
            shopId,
            textColor: theme.userFontColor,
            backgroundColor: theme.userBubbleColor,
            configDate: new Date(),
        }
        bot.updateBotConfig({ shopId, config }).then(res => {
            Swal.fire({
                icon: 'success',
                title: `Lưu cấu hình thành công`,
            })
            this.setState({
                config
            })
        }).catch(err => {
            Swal.fire({
                icon: 'error',
                title: `Đã có lỗi xảy ra, vui lòng thử lại`,
            })
        })
    }

    handleChangeTextColor = (color) => {
        this.setState({
            theme: {
                ...this.state.theme,
                // headerFontColor: color.hex,
                userFontColor: color.hex,
            }
        })
    }

    handleChangeTheme = (gradient) => {
        this.setState({
            theme: {
                ...this.state.theme,
                // headerBgColor: gradient.background,
                // headerFontColor: gradient.color,
                userBubbleColor: gradient.background,
                userFontColor: gradient.color,
            },
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



    handleAddKeyword(chip) {
        //check exist


        const { shopId } = this.props.authUser
        if (this.state.shopKeyword.indexOf(chip.toLowerCase()) < 0) {
            var keyword = {
                shopId,
                keyword: chip.toLowerCase(),
                isActive: true,
            }
            bot.addKeyWord(keyword).then(res => {
                this.setState({ shopKeyword: [...this.state.shopKeyword, chip.toLowerCase()] })
            }).catch(res => {
                console.log(res)
                Swal.fire({
                    icon: 'error',
                    title: `Đã có lỗi xảy ra, vui lòng thử lại`,
                })
            })
        }

    }

    handleDeleteKeyword = (chip, index) => {
        Swal.fire({
            icon: 'question',
            title: `Xóa từ khóa?`,
            text: `Bạn có chắc muốn xóa từ khóa này? Hành động này không thể hoàn tác`,
            showCancelButton: true,
            cancelButtonText: 'Hủy',
            confirmButtonText: 'Xóa'
        }).then(result => {
            if (result.value) {
                const { shopId } = this.props.authUser
                let keywords = [...this.state.shopKeyword]
                keywords.splice(index, 1)
                const keyword = { keyword: chip }
                bot.deleteKeyWord({ shopId, keyword }).then(res => {
                    Swal.fire({
                        icon: 'success',
                        title: `Xóa từ khóa thành công`,
                    })
                    this.setState({ shopKeyword: keywords })
                }).catch(res => {
                    console.log(res)
                    Swal.fire({
                        icon: 'error',
                        title: `Đã có lỗi xảy ra, vui lòng thử lại`,
                    })
                })
            }
        })
        // axios.put("http://localhost:3001/api/keyword/" + shopId, { keyword })
    }

    MessageTemplate(props) {
        const isUser = props.item.author.id === 1 ? true : false
        const bubbleStyle = isUser ?
            {
                background: this.state.theme.userBubbleColor,
                color: this.state.theme.userFontColor,
                display: 'inline-block',
                border: 'none',
            } : {}
        return (
            <div>
                <div className="k-bubble" style={bubbleStyle}>
                    <div>{props.item.text}</div>
                </div>
            </div>
        );
    }

    render() {
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
                            boxShadow: this.state.theme.userBubbleColor === gradient.background ?
                                'rgba(0, 77, 255, 0.5) 0 0 3px 3px' : ''
                        }}
                        onClick={() => this.handleChangeTheme(gradient)}
                    >
                    </div>
                ))}
            </div>
        return (
            <div className="app-wrapper" >
                <h1 className="header-title mb-3 mb-sm-0 .text-primary">Cấu hình bot</h1>
                {/* <ContainerHeader match={this.props.match} title={'Cấu hình bot'} /> */}
                <Grid container
                    justify="flex-end"
                    spacing={3}>
                    <Grid item xs={6}>
                        <ValidatorForm className="validator-form" ref="form" onSubmit={this.handleSubmit} onError={errors => console.log(errors)}>
                            <TextValidator
                                label="Tên Bot"
                                onChange={(event) => {
                                    const messages = [...this.state.messages]
                                    messages[0].author.name = event.target.value
                                    messages[0].text = `Xin chào, Tôi là ${event.target.value.trim()}. Tôi có thể giúp gì cho bạn?`
                                    this.setState({ botName: event.target.value })
                                }}
                                fullWidth
                                value={this.state.botName}
                                validators={['required']}
                                errorMessages={['Vui lòng nhập tên bot']}
                                margin="normal"
                                className="mt-1 my-sm-3"
                            />
                            <InputLabel className="input-choose-color" >Màu nền</InputLabel>

                            {backgroundPicker}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleOpenPicker}
                            >
                                Tự chọn màu
                                    </Button>
                            {/* <InputLabel className="input-choose-color" >Từ khoá</InputLabel>
                                    <div style={styles.keywordHint}>Hãy nhập từ khóa để chatbot có thể trả lời chính xác hơn. Ví dụ: "Áo", "Quần"</div>
                                    <br />
                                    <div style={styles.keywordHint}>Để tạo từ khóa hãy nhập 1 từ bất kỳ và nhấn enter</div>
                                    <br /> */}
                            <ChipInput
                                className="keyword-input"
                                label="Từ khóa"
                                fullWidth
                                helperText="Nhập từ khóa để hệ thống có thể trả lời chính xác hơn"
                                value={this.state.shopKeyword}
                                onAdd={(chip) => this.handleAddKeyword(chip)}
                                onDelete={(chip, index) => this.handleDeleteKeyword(chip, index)}
                            />
                            <Grid item xs={12} style={{ textAlign: "right", marginTop: 40 }}>
                                <Button
                                    variant="contained"
                                    onClick={this.handleReset}
                                    style={{ marginRight: '10px' }}
                                >
                                    Khôi phục
                        </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    style={{ width: '108px' }}
                                    width={100}
                                // onClick={this.handleSave}
                                >
                                    Lưu
                        </Button>
                            </Grid>
                        </ValidatorForm>

                    </Grid>
                    <Grid container direction="row-reverse" justify="center" item xs={6}>
                        {/* <Card style={{ minHeight: '300px' }}> */}
                        {/* <div className="message-area">
                            <strong>{this.state.botName}</strong>
                            <Card style={{
                                maxWidth: '240px',
                                padding: '5px 10px',
                                marginBottom: '5px',
                                borderRadius: '10px'
                            }}>
                                Xin chào, Tôi là hệ thống hỗ trợ khách hàng. Tôi có thể giúp gì cho bạn?
                                </Card>
                            <Card style={{
                                maxWidth: '200px',
                                float: 'right',
                                padding: '5px 10px',
                                marginBottom: '5px',
                                background: this.state.theme.userBubbleColor,
                                color: this.state.theme.userFontColor,
                                borderRadius: '10px'
                            }}>
                                mình muốn tìm áo
                                </Card>
                        </div>
                        <div className="text-input">
                            <span className="chat-placeholder">Nhập tin nhắn...</span>
                            <SendIcon className="send-icon" />
                        </div> */}
                        {/* </Card> */}
                        <div className="chat-container">
                            <Chat
                                ref="chatRef"
                                user={{ id: 1 }}
                                messages={this.state.messages}
                                // onMessageSend={this.addNewMessage}
                                placeholder={"Nhập tin nhắn..."}
                                // onActionExecute={this.onAction}
                                messageTemplate={this.MessageTemplate}
                                // attachmentTemplate={this.аttachmentTemplate}
                                width={400}>
                            </Chat>
                        </div>
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
                                <span style={styles.optionTitle}>Màu nền</span>
                                <SketchPicker
                                    color={this.state.theme.userBubbleColor}
                                    onChangeComplete={this.handleChangeBackground}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <span style={styles.optionTitle}>Màu chữ</span>
                                <SketchPicker
                                    color={this.state.theme.userFontColor}
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
                        <span style={styles.optionTitle}>Lưu thành công</span>
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

const mapStateToProps = ({ chatData, settings, auth }) => {
    const { authUser } = auth
    return {
        authUser
    }
};

export default connect(mapStateToProps, {})(BotConfiguration);

