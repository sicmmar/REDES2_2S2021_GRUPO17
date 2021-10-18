import './App.css';
import { ToastContainer } from 'react-toastify';
import 'bootstrap';
import {BrowserRouter as Router,Route} from 'react-router-dom'
import Reporte from './Components/Reporte/Reporte';
import Reportes from './Components/Reporte/Reportes';
import Asistencia from './Components/Reporte/Asistencia';
import Asistencias from './Components/Reporte/Asistencias';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ToastContainer />
        <Router>
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
          <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarColor01">
              <ul class="navbar-nav me-auto">
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Reportes</a>
                  <div class="dropdown-menu">
                    <a class="dropdown-item" href="/Subir" >Subir</a>
                    <a class="dropdown-item" href="/Reportes">Buscar</a>
                  </div>
                </li>
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Asistencia</a>
                  <div class="dropdown-menu">
                  <a class="dropdown-item" href="/Asistencia" >Registrar</a>
                  <a class="dropdown-item" href="/AsistenciasEvento" >Buscar por Evento</a>
                  <a class="dropdown-item" href="/AsistenciasAlumno" >Buscar por Alumno</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Route path="/Subir"> <Reporte reporte={{isReport: "true"}} /> </Route>
        <Route path="/Reportes"> <Reportes/></Route>
        <Route path="/Asistencia"> <Asistencia asistencia={{isReport: "true"}}/></Route>
        <Route path="/AsistenciasEvento"> <Asistencias asistencia={{isEvento: "true"}}/></Route>
        <Route path="/AsistenciasAlumno"> <Asistencias asistencia={{isEvento: "false"}}/></Route>
        </Router>
      </header>
    </div>
  );
}

export default App;
