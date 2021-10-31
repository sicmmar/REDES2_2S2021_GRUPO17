import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withRouter, Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import axios from 'axios';
import { Form, FormGroup, Label } from 'reactstrap';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@rmwc/button";
import clsx from 'clsx';
import '@rmwc/typography/styles';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    width: '400px',
    backgroundColor: "#FFFFFF",
  },
  centrarContenido: {
    textAlign: 'center',
  },
}));

const Reporte = ({ reporte }) => {
  const classes = useStyles();
  const [server, setServer] = useState(202112209);
  const [valuesUser, setValues] = useState({
    carnet: '',
    name: '',
    cursoProyecto: '',
    cuerpo: '',
    fecha: ''
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...valuesUser, [prop]: event.target.value });
  };

  useEffect(() => {
    if (reporte.isReport === "false") {
      setValues({
        carnet: reporte.carnet,
        name: reporte.nombre,
        cursoProyecto: reporte.curso,
        cuerpo: reporte.mensaje,
        fecha: reporte.fecha
      })
      setServer(reporte.server)
    }
  }, []);

  const handleClick = (event) => {
    event.preventDefault()
    let valido = true;

    if (valuesUser.carnet === '') {
      toast.warn("El Campo Nombre de Usuario es Obligatorio", { position: toast.POSITION.TOP_RIGHT, autoClose: 5000 });
      valido = false;
    }
    if (valuesUser.name === '') {
      toast.warn("El Campo Nombre es Obligatorio", { position: toast.POSITION.TOP_RIGHT, autoClose: 5000 });
      valido = false;
    }
    if (valuesUser.cursoProyecto === '') {
      toast.warn("El Campo Contraseña es Obligatorio", { position: toast.POSITION.TOP_RIGHT, autoClose: 5000 });
      valido = false;
    }
    if (valuesUser.cuerpo === '') {
      toast.warn("El Campo Contraseña es Obligatorio", { position: toast.POSITION.TOP_RIGHT, autoClose: 5000 });
      valido = false;
    }

    if (valido) {

      const endpoint = 'http://' + serversAddr.backend.host + ':' + serversAddr.backend.port + '/';

      axios.post(endpoint, { carnet: valuesUser.carnet, nombre: valuesUser.name, curso: valuesUser.cursoProyecto, mensaje: valuesUser.cuerpo })
        .then((result) => {
          if (result.status === 200) {
            toast.success("Se a enviado el reporte", { position: toast.POSITION.TOP_RIGHT, autoClose: 5000 });
          } else {
            toast.error("Error al enviar el reporte", { position: toast.POSITION.TOP_RIGHT, autoClose: 5000 });
          }
        })
        .catch((err) => {
          toast.error("v( ‘.’ )v", { position: toast.POSITION.TOP_RIGHT, autoClose: 5000 });
          console.log('Error en el request al endpoint ' + endpoint);
          console.log(err);
        });
    }
  };

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <br></br><Label style={{ fontWeight: "bolder", fontSize: "28px", fontFamily: "Verdana", color: "#2c3e50", textAlign: "center", width: '400px' }}> Ingreso de Reporte de Practicante </Label>
      </div>
      <Box display="flex" justifyContent="center" m={1} p={1} bgcolor="#FFFFFF">
        <Card variant="outlined" >
          <CardContent className={classes.colorCard}>
            <Box display="flex" justifyContent="center" p={1} flexGrow={1} bgcolor="#F7F7EF">
              <Form onSubmit={handleClick}>
                <FormGroup>
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
                      label="Nombre"
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
                      label="Curso/Proyecto"
                      onChange={handleChange('cursoProyecto')}
                      required
                      id="outlined-required"
                      className={clsx(classes.margin, classes.textField)}
                      value={valuesUser.cursoProyecto}
                      variant="outlined"
                    />
                  </Box>
                  {reporte.isReport === "false" ?
                    <Box>
                      <TextField
                        label="Fecha"
                        onChange={handleChange('fecha')}
                        required
                        id="outlined-required"
                        className={clsx(classes.margin, classes.textField)}
                        value={valuesUser.fecha}
                        variant="outlined"
                      />
                    </Box>
                    : null
                  }
                  <Box>
                    <TextField
                      label="Cuerpo del Reporte"
                      onChange={handleChange('cuerpo')}
                      required
                      multiline
                      rows={10}
                      id="outlined-required"
                      className={clsx(classes.margin, classes.textField)}
                      value={valuesUser.cuerpo}
                      variant="outlined"
                    />
                  </Box>
                  {reporte.isReport === "true" ?
                    <Box className={classes.centrarContenido}>
                      <Button
                        variant="contained"
                        size="large"
                        style={{ color: '#FFFFFF', backgroundColor: '#0B78F4', width: '95%', justifyContent: 'center', alignItems: 'center' }}
                        onClick={handleClick}
                      >
                        Enviar
                      </Button>
                    </Box>
                    : <h4><h4>Solicitud atendida por el server: {server}</h4></h4>
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

export default withRouter(Reporte);
