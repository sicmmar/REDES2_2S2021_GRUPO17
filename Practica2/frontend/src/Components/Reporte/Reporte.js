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
import { CircularProgress } from "@rmwc/circular-progress";
import clsx from 'clsx';
import Collapse from '@material-ui/core/Collapse';
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

const Reporte = ({ reporte}) => {

  const [activarBotonGuardar, setActivarBotonGuardar] = useState(true);

  const classes = useStyles();
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
    if(reporte.isReport === "false")
    {
      setValues({
        carnet: reporte.Carnet,
        name: reporte.Nombre,
        cursoProyecto: reporte.Proyecto,
        cuerpo: reporte.Cuerpo,
        fecha: reporte.Fecha
      })
    }
   },[]);

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
      axios.post('http://' + serversAddr.backend.host + ':' + serversAddr.backend.port + '/existUser', { username: valuesUser.carnet })
        .then(response => {
          if (response.data.exist === '0') {
            axios.post('http://' + serversAddr.backend.host + ':' + serversAddr.backend.port + '/crearUsuario', { value1: valuesUser.carnet, value2: valuesUser.name, value3: valuesUser.cursoProyecto, value4: valuesUser.cuerpo })
              .then(response => {
                setActivarBotonGuardar(false);
                toast.success("Se a enviado el reporte", { position: toast.POSITION.TOP_RIGHT, autoClose: 5000 });
              })
          } else {
            toast.error("Error al enviar el reporte", { position: toast.POSITION.TOP_RIGHT, autoClose: 5000 });
          }
        })
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
                    <div className={classes.centrarContenido}>
                      <Collapse in={!activarBotonGuardar}>
                        <Button style={{ fontWeight: 'bold' }} label=" ...Enviando" icon={<CircularProgress />} />
                      </Collapse>
                      <Collapse in={activarBotonGuardar}>
                        <Button
                          variant="contained"
                          size="large"
                          style={{ color: '#FFFFFF', backgroundColor: '#0B78F4', width: '95%', justifyContent: 'center', alignItems: 'center' }}
                          onClick={handleClick}
                        >
                          Enviar
                        </Button>
                      </Collapse>
                    </div> : null
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
