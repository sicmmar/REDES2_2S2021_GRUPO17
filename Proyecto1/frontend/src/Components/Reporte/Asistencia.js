import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withRouter, Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import { Form, FormGroup, Label } from 'reactstrap';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@rmwc/button";
import FormControl from '@material-ui/core/FormControl';
import clsx from 'clsx';
import 'date-fns';
import '@rmwc/typography/styles';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
const serversAddr = require('../serversAddr');

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    colorCard: {
        backgroundColor: "#F7F7EF",
        borderColor: "#ffffff",
        //width: "500px",
    },
    margin: {
        margin: theme.spacing(1),
        width: '100%',
        justifyContent: 'center'
    },
    textField: {
        width: '35ch',
        backgroundColor: "#FFFFFF",
    },
    centrarContenido: {
        textAlign: 'center',
    },
    registrarse: {
        textAlign: 'right',
        fontSize: 12,
    },
}));

const Asistencia = ({ asistencia }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [server, setServer] = useState(202112209);
    const [imagenReporte, setImagenReporte] = useState("https://i.ytimg.com/vi/qy3g9q7K58Y/hqdefault.jpg");

    const classes = useStyles();
    const [valuesUser, setValues] = useState({
        carnet: '',
        name: '',
        eventName: '',
        idEvento: ''
    });

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const handleChange = (prop) => (event) => {
        setValues({ ...valuesUser, [prop]: event.target.value });
    };

    useEffect(() => {
        if (asistencia.isReport === "false") {
            setValues({
                carnet: asistencia.carnet,
                name: asistencia.name,
                eventName: asistencia.eventName,
                idEvento: asistencia.idEvento
            })
            setServer(asistencia.server)
            setImagenReporte(asistencia.image)
        }
    }, []);

    const getBase64 = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    const handleClick = async (event) => {
        event.preventDefault()
        let valido = true;

        if (valuesUser.carnet === '' || valuesUser.carnet < 0) {
            toast.warn("El Campo Nombre de Usuario es Obligatorio", { position: toast.POSITION.TOP_RIGHT, autoClose: 5000 });
            valido = false;
        }
        if (valuesUser.name === '') {
            toast.warn("El Campo Nombre es Obligatorio", { position: toast.POSITION.TOP_RIGHT, autoClose: 5000 });
            valido = false;
        }
        if (selectedFile == null) {
            toast.warn("No ha subido ninguna imagen", { position: toast.POSITION.TOP_RIGHT, autoClose: 5000 });
            valido = false;
        } else if (selectedFile.type !== 'image/png' && selectedFile.type !== 'image/jpg' & selectedFile.type !== 'image/jpeg') {
            toast.warn("La imagen no tiene un formato valido", { position: toast.POSITION.TOP_RIGHT, autoClose: 5000 });
            valido = false;
        }

        if (valido) {
            await getBase64(selectedFile).then(
                data => {
                    axios.post('https://' + serversAddr.backend.host + ':' + serversAddr.backend.port + '/asistencia', {
                        carnet: valuesUser.carnet,
                        name: valuesUser.name,
                        eventName: valuesUser.eventName,
                        idEvento: valuesUser.idEvento,
                        image: data
                    }).then(response => {
                        if (response.status === 200) {
                            toast.success("Se a enviado correctamente la asistencia", { position: toast.POSITION.TOP_RIGHT, autoClose: 5000 });
                        } else {
                            toast.error("Error al subir la asistencia", { position: toast.POSITION.TOP_RIGHT, autoClose: 5000 });
                        }
                    })
                }
            );
        }
    };

    return (
        <div>
            <div style={{ textAlign: "center" }}>
                <br></br><Label style={{ fontWeight: "bolder", fontSize: "28px", fontFamily: "Verdana", color: "#2c3e50", textAlign: "center", width: '400px' }}> Asistencia </Label>
            </div>
            <Box display="flex" justifyContent="center" m={1} p={1} bgcolor="#FFFFFF">
                <Card variant="outlined" >
                    <CardContent className={classes.colorCard}>
                        <Box display="flex" justifyContent="center" p={1} flexGrow={1} bgcolor="#F7F7EF">
                            <Form onSubmit={handleClick}>
                                <FormGroup>
                                    {asistencia.isReport !== "true" ?
                                    <Box className={clsx(classes.margin, classes.textField)}>
                                        <img width='100%' src={imagenReporte} alt="MDN" />
                                    </Box>
                                    :null
                                    }
                                    <Box>
                                        <TextField
                                            label="Carnet"
                                            onChange={handleChange('carnet')}
                                            required
                                            id="outlined-required"
                                            className={clsx(classes.margin, classes.textField)}
                                            value={valuesUser.carnet}
                                            variant="outlined"
                                        />
                                    </Box>
                                    <Box>
                                        <TextField
                                            label="Nombre Estudiante"
                                            onChange={handleChange('name')}
                                            required
                                            id="outlined-required"
                                            className={clsx(classes.margin, classes.textField)}
                                            value={valuesUser.name}
                                            variant="outlined"
                                        />
                                    </Box>
                                    <Box>
                                        <TextField
                                            label="Nombre Evento"
                                            onChange={handleChange('eventName')}
                                            required
                                            id="outlined-required"
                                            className={clsx(classes.margin, classes.textField)}
                                            value={valuesUser.eventName}
                                            variant="outlined"
                                        />
                                    </Box>
                                    <Box>
                                        <TextField
                                            label="Id Evento"
                                            onChange={handleChange('idEvento')}
                                            required
                                            id="outlined-required"
                                            className={clsx(classes.margin, classes.textField)}
                                            value={valuesUser.idEvento}
                                            variant="outlined"
                                            type="number"
                                        />
                                    </Box>
                                    {asistencia.isReport === "true" ?
                                        <div>
                                            <Box>
                                                <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
                                                    <input type="file" accept=".jpg, .png, .jpeg" onChange={handleFileInput} />
                                                </FormControl>
                                            </Box>
                                            <Box className={classes.centrarContenido}>
                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    style={{ color: '#FFFFFF', backgroundColor: '#0B78F4', width: '95%', justifyContent: 'center', alignItems: 'center', marginTop: "10px", height: "40px" }}
                                                    onClick={handleClick}
                                                >
                                                    Enviar
                                                </Button>
                                            </Box>
                                        </div>
                                        : <h4 style={{textAlign: "center"}}>Atendió Server: {server}</h4>
                                    }
                                </FormGroup>
                            </Form>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </div>
    );
}

export default withRouter(Asistencia);
