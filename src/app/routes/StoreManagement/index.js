import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import purple from '@material-ui/core/colors/purple';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const PurpleSwitch = withStyles({
    switchBase: {
      color: purple[300],
      '&$checked': {
        color: purple[400],
      },
      '&$checked + $track': {
        backgroundColor: purple[500],
      },
    },
    checked: {},
    track: {},
  })(Switch);

  const PurpleButton = withStyles(theme => ({
    root: {
      color: theme.palette.getContrastText(purple[400]),
      backgroundColor: purple[400],
      '&:hover': {
        backgroundColor: purple[500],
      },
    },
  }))(Button);

function createData(name, url, installDate, status) {
    return { name, url, installDate, status };
}

var today = new Date()
var date = (today.getMonth()+1)+"/"+today.getDate()+"/"+today.getFullYear()
// var date = today
const rows = [
    createData('Store 1', 'url1', date, true),
    createData('Store 2', 'url2', date, true),
    createData('Store 3', 'url3', date, false),
    createData('Store 4', 'url4', date, false),
    createData('Store 5', 'url5', date, true),
    createData('Store 6', 'url6', date, true),
    createData('Store 7', 'url7', date, false),
    createData('Store 8', 'url8', date, true),
    createData('Store 9', 'url9', date, false),
    createData('Store 10', 'url10', date, false),
    createData('Store 11', 'url11', date, true),
    createData('Store 12', 'url12', date, false),
    createData('Store 13', 'url13', date, true),
    createData('Store 14', 'url14', date, true),
    createData('Store 15', 'url15', date, true),
];

class StoreManagement extends React.Component {
    
    constructor(props) {
        super(props)
        this.state={
            data: rows, 
            page: 0, 
            rowsPerPage: 5, 
            openDeleteDialog: false, 
            deleteId:'', 
            openUpdateDialog: false, 
            updateId:'', 
            updateStore:{},
        }

        this.addStore = this.addStore.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeUrl = this.handleChangeUrl.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this)
    }

    handleChangeDate(event) {
        let storeToUpdate = Object.assign({},this.state.updateStore)
        storeToUpdate.installDate = (event.getMonth()+1)+"/"+event.getDate()+"/"+event.getFullYear()
        this.setState({
            updateStore:storeToUpdate
        })
    }

    handleChangeName(event) {
        let storeToUpdate = Object.assign({},this.state.updateStore)
        storeToUpdate.name = event.target.value
        this.setState({
            updateStore:storeToUpdate
        })
    }

    handleChangeUrl(event) {
        let storeToUpdate = Object.assign({},this.state.updateStore)
        storeToUpdate.url = event.target.value
        this.setState({
            updateStore:storeToUpdate
        })
    }

    handleClickDelete(id) {
        this.setState({openDeleteDialog: true, deleteId: id})
    };

    handleCloseDelete = () => {
        this.setState({openDeleteDialog: false, deleteId: ''})
    };

    handleDelete = () => {
        this.setState({
            data: this.state.data.filter(d => d.name !== this.state.deleteId),
            deleteId:'',
            openDeleteDialog: false,
        })
    }

    handleClickUpdate(id) {
        var storeToUpdate
        this.state.data.forEach(store => {
            if(store.name === id) {
                storeToUpdate = store
            }
        })
        this.setState({openUpdateDialog: true, updateId: id, updateStore: storeToUpdate})
    };

    handleCloseUpdate = () => {
        this.setState({openUpdateDialog: false, updateId: '', updateStore: {}})
    };

    handleUpdate = () => {
        var currentData = this.state.data
        currentData.forEach(s => {
            if(s.name === this.state.updateId) {
                s.name = this.state.updateStore.name
                s.url = this.state.updateStore.url
                s.installDate = this.state.updateStore.installDate
            }
        })
        this.setState({
            data: currentData,
            updateStore:{},
            updateId:'',
            openUpdateDialog: false,
        })
    }

    handleChangePage = (event, newPage) => {
        this.setState({page: newPage})
    };

    handleChangeRowsPerPage = event => {
        this.setState({
            rowsPerPage: event.target.value,
            page:0
        })
        
    };

    addStore() {
        var store = {
            name: "test",
            url: 'storeUrl',
            installDate:'',
            status:true
        }
        var newData = this.state.data;
        newData.push(store)
        this.setState({
            data: newData
        })
        console.log(this.state.data)
    }

    

  render() {
    return (
      <div className="app-wrapper">
        <Grid container>
            <Grid item xs={11}>
                <h1>View stores</h1>
            </Grid>
            <Grid item xs={1}>
                <Tooltip title="Add Store">
                    <PurpleButton 
                        variant="contained" 
                        onClick={this.addStore}
                    >
                        <i className="zmdi zmdi-plus zmdi-hc-2x"></i>
                    </PurpleButton>
                </Tooltip>
            </Grid>
        </Grid>
        
            <div style={{marginTop: 5}}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Website URL</TableCell>
                            <TableCell align="left">Installed Date</TableCell>
                            <TableCell align="left">Status</TableCell>
                            <TableCell align="left">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        
                    {this.state.data.slice(this.state.page * this.state.rowsPerPage, 
                        this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row, index) => {
                        return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                <TableCell>{index}</TableCell>
                                <TableCell component="th" scope="row" align="left">
                                    {row.name}
                                </TableCell>
                                <TableCell align="left">{row.url}</TableCell>
                                <TableCell align="left">{row.installDate}</TableCell>
                                <TableCell align="left">
                                    <PurpleSwitch checked={row.status}/>
                                </TableCell>
                                <TableCell align="left">
                                    <Tooltip title="Update">
                                        <div style={{display:'inline', marginRight: 10}} onClick={() => {this.handleClickUpdate(row.name)}}>
                                            <i className="zmdi zmdi-edit zmdi-hc-lg mdc-text-purple" 
                                                style={{ color: purple[400], cursor:'pointer'}}></i>
                                        </div>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <div style={{display:'inline'}} onClick={()=>{this.handleClickDelete(row.name)}}>
                                            <i className="zmdi zmdi-delete zmdi-hc-lg mdc-text-red" 
                                                style={{ color: purple[400], cursor: 'pointer'}}></i>
                                        </div>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
            </div>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={this.state.data.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                backIconButtonProps={{
                'aria-label': 'previous page',
                }}
                nextIconButtonProps={{
                'aria-label': 'next page',
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />

            {/* delete popup */}
            <Dialog
                open={this.state.openDeleteDialog}
                onClose={this.handleCloseDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Delete confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure that you want to delete this store?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={this.handleCloseDelete} variant="contained">
                    Cancel
                </Button>
                <PurpleButton onClick={this.handleDelete} autoFocus variant="contained">
                    Yes
                </PurpleButton>
                </DialogActions>
            </Dialog>
            {/* update dialog */}
            <Dialog
                open={this.state.openUpdateDialog}
                onClose={this.handleCloseUpdate}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Update store</DialogTitle>
                <DialogContent>
                    <div style={{width: 500}}>
                        <FormControl variant="outlined" fullWidth style={{marginBottom: 10}}>
                            <InputLabel htmlFor="component-outlined">
                                Name
                            </InputLabel>
                            <OutlinedInput
                                id="storename"
                                value={this.state.updateStore.name}
                                onChange={this.handleChangeName}
                                labelWidth={50}
                                fullWidth
                            />
                        </FormControl>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel htmlFor="component-outlined">
                                URL
                            </InputLabel>
                            <OutlinedInput
                                id="storename"
                                value={this.state.updateStore.url}
                                onChange={this.handleChangeUrl}
                                labelWidth={50}
                                fullWidth
                            />
                        </FormControl>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker"
                            label="Install date"
                            value={this.state.updateStore.installDate}
                            onChange={this.handleChangeDate}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        </MuiPickersUtilsProvider>
                        
                    </div>
                </DialogContent>
                <DialogActions>
                <Button onClick={this.handleCloseUpdate} variant="contained">
                    Cancel
                </Button>
                <PurpleButton onClick={this.handleUpdate} variant="contained" autoFocus>
                    Update
                </PurpleButton>
                </DialogActions>
            </Dialog>
      </div>
      
    );
  }
  
}

export default StoreManagement;