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
    DialogActions
} from '@material-ui/core'
import { purple } from '@material-ui/core/colors'
import botPlaceHolder from '../../../assets/images/bot.png'
import userPlaceHolder from '../../../assets/images/placeholder.jpg'
import ContainerHeader from 'components/ContainerHeader';
import IntlMessages from 'util/IntlMessages';
import { SketchPicker } from 'react-color'
import axios from 'axios'

const defaultBotConfig = {
    name: '',
    color: purple[400],
    textColor: 'white',
    image: botPlaceHolder,
}
class BotConfiguration extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            botConfig: Object.assign({}, defaultBotConfig),
            openBackgroundColorPicker: false,
            openTextColorPicker: false,
        }
        this.handleChangeName = this.handleChangeName.bind(this)
        this.handleChangeBackground = this.handleChangeBackground.bind(this)
        this.handleChangeText = this.handleChangeText.bind(this)
        this.handleChangeImage = this.handleChangeImage.bind(this)
        this.handleOpenBackgroundPicker = this.handleOpenBackgroundPicker.bind(this)
        this.handleCloseBackgroundPicker = this.handleCloseBackgroundPicker.bind(this)
        this.handleOpenTextPicker = this.handleOpenTextPicker.bind(this)
        this.handleCloseTextPicker = this.handleCloseTextPicker.bind(this)
        this.handleReset = this.handleReset.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }

    componentDidMount() {
        axios.get('http://localhost:3001/api/botConfig/2').then(res => {
            console.log(res)
        })
    }

    handleReset() {
        this.setState({
            botConfig: defaultBotConfig
        })
    }

    handleSave() {
        alert("Success")
        console.dir(this.state.botConfig)
    }
    handleChangeName(event) {
        let config = this.state.botConfig
        config.name = event.target.value
        this.setState({
            botConfig: config
        })
    }

    handleChangeBackground(color) {
        let config = this.state.botConfig
        config.color = color.hex
        this.setState({
            botConfig: config
        })
    }

    handleChangeText(color) {
        let config = this.state.botConfig
        config.textColor = color.hex
        this.setState({
            botConfig: config
        })
    }

    handleChangeImage(e) {
        let reader = new FileReader()
        let imgFile = e.target.files[0]
        var test = this.state.botConfig
        reader.onloadend = () => {
            test.image = reader.result
            this.setState({
                botConfig: test
            })
        }
        reader.readAsDataURL(imgFile)

    }

    handleOpenBackgroundPicker() {
        this.setState({
            openBackgroundColorPicker: true
        })
    }

    handleCloseBackgroundPicker() {
        this.setState({
            openBackgroundColorPicker: false
        })
    }

    handleOpenTextPicker() {
        console.log("testttttt")
        this.setState({
            openTextColorPicker: true
        })
    }

    handleCloseTextPicker() {
        this.setState({
            openTextColorPicker: false
        })
    }
    render() {
        return (
            <div className="app-wrapper">
                <ContainerHeader match={this.props.match} title={<IntlMessages id="Store Management" />} />
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Card style={{ height: '460px' }}>
                            <CardHeader title="Bot information" />
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <Avatar style={{ width: 100, height: 100, marginLeft: 20 }}
                                            src={this.state.botConfig.image} />
                                        <input
                                            accept="image/*"
                                            id="raised-button-file"
                                            style={{ opacity: '0' }}
                                            multiple
                                            type="file"
                                            onChange={(e) => this.handleChangeImage(e)}
                                        />
                                        <label htmlFor="raised-button-file">
                                            <Button
                                                component="span"
                                                variant="contained"
                                                style={{
                                                    backgroundColor: this.state.botConfig.color,
                                                    color: this.state.botConfig.textColor
                                                }}
                                            >
                                                Upload avatar
                                        </Button>
                                        </label>

                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControl>
                                            <InputLabel htmlFor="bot-name">Name</InputLabel>
                                            <Input id="bot-name"
                                                value={this.state.botConfig.name}
                                                onChange={this.handleChangeName} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Paper style={{ padding: 25 }}>
                                            <p>Background</p>
                                            <Grid container alignItems="center">
                                                <Grid item style={{ marginRight: 5 }}>
                                                    <Paper style={{ background: this.state.botConfig.color, height: 40, width: 40, }}></Paper>
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        style={{
                                                            backgroundColor: this.state.botConfig.color,
                                                            color: this.state.botConfig.textColor
                                                        }}
                                                        onClick={this.handleOpenBackgroundPicker}
                                                    >
                                                        Choose color
                                                </Button>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Paper style={{ padding: 25 }}>
                                            <p>Text</p>
                                            <Grid container alignItems="center">
                                                <Grid item style={{ marginRight: 5 }}>
                                                    <Paper style={{ background: this.state.botConfig.textColor, height: 40, width: 40, }}></Paper>
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        style={{
                                                            backgroundColor: this.state.botConfig.color,
                                                            color: this.state.botConfig.textColor
                                                        }}
                                                        onClick={this.handleOpenTextPicker}
                                                    >
                                                        Choose color
                                                </Button>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Card style={{ height: '460px' }}>
                            <CardHeader title="Preview" />
                            <CardContent>
                                <Card style={{ height: '350px' }}>
                                    <CardHeader
                                        title={this.state.botConfig.name !== '' ? this.state.botConfig.name : 'Bot name'}
                                        style={{ backgroundColor: this.state.botConfig.color, color: this.state.botConfig.textColor }}
                                    />
                                    <CardContent>
                                        <div>
                                            <Grid container
                                                spacing={1}
                                                wrap="nowrap"
                                                alignItems="center">
                                                <Grid item>
                                                    <Avatar src={this.state.botConfig.image} />
                                                </Grid>
                                                <Grid item>

                                                    <Paper
                                                        style={{
                                                            paddingLeft: '5px',
                                                            paddingRight: '5px',
                                                            backgroundColor: this.state.botConfig.color,
                                                            color: this.state.botConfig.textColor
                                                        }}>
                                                        <Typography>
                                                            Hello, can i help you?
                                                        </Typography>
                                                    </Paper>

                                                </Grid>
                                            </Grid>

                                        </div>
                                        <div>
                                            <Grid container
                                                spacing={1}
                                                wrap="nowrap"
                                                direction="row-reverse"
                                                justify="flex-start"
                                                alignItems="center">
                                                <Grid item>
                                                    <Avatar src={userPlaceHolder} />
                                                </Grid>
                                                <Grid item>
                                                    <Paper style={{ paddingLeft: '5px', paddingRight: '5px' }}>
                                                        <Typography>
                                                            Im looking for a T-shirt
                                                        </Typography>
                                                    </Paper>
                                                </Grid>
                                            </Grid>

                                        </div>
                                        <div>

                                        </div>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} style={{ textAlign: "right" }}>
                        <Button
                            variant="contained"
                            style={{ marginRight: 10 }}
                            onClick={this.handleReset}
                        >
                            Reset
                        </Button>
                        <Button
                            style={{
                                backgroundColor: this.state.botConfig.color,
                                color: this.state.botConfig.textColor
                            }}
                            onClick={this.handleSave}
                        >
                            Save
                        </Button>
                    </Grid>
                </Grid>
                {/* open color picker for background */}
                <Dialog
                    open={this.state.openBackgroundColorPicker}
                    onClose={this.handleCloseBackgroundPicker}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Pick your color</DialogTitle>
                    <DialogContent>
                        <SketchPicker
                            color={this.state.botConfig.color}
                            onChangeComplete={this.handleChangeBackground}
                        />
                    </DialogContent>
                    <DialogActions>

                        <Button onClick={this.handleCloseBackgroundPicker} autoFocus variant="contained">
                            OK
                    </Button>
                    </DialogActions>
                </Dialog>
                {/* open color picker for text */}
                <Dialog
                    open={this.state.openTextColorPicker}
                    onClose={this.handleCloseTextPicker}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Pick your color</DialogTitle>
                    <DialogContent>
                        <SketchPicker
                            color={this.state.botConfig.textColor}
                            onChangeComplete={this.handleChangeText}
                        />
                    </DialogContent>
                    <DialogActions>

                        <Button onClick={this.handleCloseTextPicker} autoFocus variant="contained">
                            OK
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default BotConfiguration