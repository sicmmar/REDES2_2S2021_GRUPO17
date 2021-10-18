
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import date
import os

app = Flask(__name__)
CORS(app) 

# Conectar a mongo
#client = MongoClient(port=27017, host="db")
client = MongoClient(os.environ['URI_MONGO'])

# Seleccionar base de datos y coleccion
db = client['redes2']
collection = db.estudiantes

@app.route('/')
def result():
    return str("Jau desde Server: " + os.environ['SERVER'])


@app.route('/', methods=['POST'])
def ingresar():
    day = date.today()
    respuesta = collection.insert_one(
        {
            "Carnet": request.json.get('carnet'),
            "Nombre": request.json.get('nombre'),
            "Curso": request.json.get('curso'),
            "Fecha": day.strftime("%d/%m/%Y"),
            "Mensaje": request.json.get('mensaje'),
            "Servidor": os.environ['SERVER'] 
        }
    )
    if respuesta: return jsonify({'status': 200, 'mensaje': 'mensaje guardado'})
    else: return jsonify({'status': 403, 'mensaje': 'error de guardado'})


########## METODO PARA OBTENER LOS REGISTROS
# SI EN EL BODY MANDAN "carnet" DEVUELVE LOS REGISTROS CORRESPONDIENTES A ESE CARNET EN UN ARRAY
# SI EN EL BODY NO MANDAN "carnet" DEVUELVE LOS REGISTROS DE TODOS LOS ESTUDIANTES EN LA BASE DE DATOS EN UN ARRAY
@app.route('/', methods=['PUT'])
def retornar():
    carnet = request.json.get('carnet')
    arr = []
    res = {}

    if carnet:
        res = collection.find({"carnet": carnet}, {"_id": False})
    else:
        res = collection.find({}, {"_id": False})

    for i in res:
        arr.append(i)
    
    return jsonify(arr)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=7050)