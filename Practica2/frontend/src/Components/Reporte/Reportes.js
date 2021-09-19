import React, { useEffect, useState, useRef } from 'react';
import { withRouter, Link } from 'react-router-dom';
import '@rmwc/typography/styles';
import 'react-toastify/dist/ReactToastify.css';
import Table from '../Table/Table'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import Button from '@material-ui/core/Button';
import Reporte from './Reporte';


function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

const Reportes = () => {

    const child1 = useRef();
    const [filtro, setFiltro] = useState('');
    const listaOriginal = [];
    const [open, setOpen] = useState(false);
    const [reporte, setReporte] = useState({});

    const vaciarListaOriginal = () => {
        for(let i = 0; i < listaOriginal.length ; i++)
            listaOriginal.pop();
    }

    useEffect(() => {
        // Aqui la peticion para obtener el listado de proyectos y asignarlos como se hace abajo con el ejemplo

        vaciarListaOriginal();
        procs.forEach(element => {
            listaOriginal.push(element);
        });
        if (child1.current != null) {
            child1.current.removeRow();
            child1.current.agregar_datos(listaOriginal);
        }
    },[]);

    const handleChange = (event) => {
        setFiltro(event.target.value);
    };
    const handleClick = (event) => {
        event.preventDefault()

        let filtered = listaOriginal.filter(function (el) {
            return el.Carnet.includes(filtro)
        });
        if (child1.current != null) {
            child1.current.removeRow();
            child1.current.agregar_datos(filtered);
        }
    };

    const showReport = (data) => {
        data.isReport = "false";
        setReporte(data);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <div style={{ marginTop: "50px", margin: "0 auto", marginBottom: "10px", maxWidth: "90%" }}>
                <div className="card-header">
                    <h2>Lista de Reportes</h2>
                </div>
                <div className="card-body">
                    <form>
                    <TextField
                      label="Buscar Reporte"
                      onChange={handleChange}
                      required
                      id="outlined-required"
                      style={{width: "90%", height: "55px"}}
                      variant="outlined"
                    />
                    <button className ="btn btn-secondary my-2 my-sm-0" type ="submit" style={{height: "55px", width: "10%"}} onClick={handleClick}>Search</button>
                    </form>
                    <div className="table-responsive" style={{ marginTop: "25px"}}>
                        <Table data={headersTable} ref={child1} handleClick={showReport}/>
                    </div>
                </div>
            </div>
            <Dialog style={{height:'1000px'}}
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
                fullWidth={true}
                maxWidth="md"
                scroll="paper"
            >
                <DialogContent>
                    <DialogContentText>
                        <Reporte reporte={reporte}/>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default withRouter(Reportes);
var headersTable = ["Carnet", "Nombre", "Proyecto", "Fecha", "Servidor"]
var procs = [
    { "Carnet": "201812499", "Nombre": "Fernando", "Proyecto": "DTT", "Fecha": "08/01/2021", "Servidor": 201612219 },
    { "Carnet": "201824198", "Nombre": "Carlos", "Proyecto": "ECYS", "Fecha": "08/01/2022", "Servidor": 201612499 },
]