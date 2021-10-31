
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import date
from io import BytesIO
import os,boto3,uuid,base64

app = Flask(__name__)
CORS(app) 

# Conectar a mongo
#client = MongoClient("mongodb+srv://ayd2_g8DB:654ayd321@cluster0.hmz3g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
client = MongoClient(os.environ['URI_MONGO'])

# Seleccionar base de datos y coleccion
db = client['redes2']
collection = db.estudiantes
collect_asistencia = db.asistencia

s3 = boto3.client('s3',
            region_name='us-east-2',
            aws_access_key_id='AKIASDR7DK2G2DBLRBPH',
            aws_secret_access_key='SbdxgA3Qc25WI8Og/l'+os.environ['SKEY']
        )

BUCKET_NAME='sicmmar'
URL_BUCKET = 'https://sicmmar.s3.us-east-2.amazonaws.com/'

@app.route('/')
def result():
    return str("Jau desde Server: " + os.environ['SERVER'])


@app.route('/', methods=['POST'])
def ingresar():
    day = date.today()
    
    respuesta = collection.insert_one(
        {
            "carnet": request.json.get('carnet'),
            "nombre": request.json.get('nombre'),
            "curso": request.json.get('curso'),
            "fecha": day.strftime("%d/%m/%Y"),
            "mensaje": request.json.get('mensaje'),
            "servidor": os.environ['SERVER'] 
        }
    )
    if respuesta: return jsonify({'status': 200, 'server': os.environ['SERVER']})
    else: return jsonify({'status': 403, 'server': os.environ['SERVER'] })


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
    
    return jsonify({"listado": arr, "server": os.environ['SERVER']})

# RUTA PARA ALMACENAR ASISTENCIA
@app.route('/asistencia', methods=['POST'])
def putAsistencia():
    image = request.json.get('image')
    starter = image.find(',')
    image_data = image[starter+1:]
    image_data = bytes(image_data, encoding="ascii")
    ubicacion = 'redes2/' + str(uuid.uuid1().time_low)

    s3.upload_fileobj(
        BytesIO(base64.b64decode(image_data)),
        BUCKET_NAME,
        ubicacion,
        ExtraArgs={'ACL': 'public-read'}
    )

    respuesta = collect_asistencia.insert_one({
        "carnet": request.json.get('carnet'),
        "name": request.json.get('name'),
        "eventName": request.json.get('eventName'),
        "idEvento" : request.json.get('idEvento'),
        "image": URL_BUCKET + ubicacion,
        "server": os.environ['SERVER']
    })

    if respuesta: return jsonify({'status': 200, 'server': os.environ['SERVER']})
    else: return jsonify({'status': 403, 'server': os.environ['SERVER'] })

@app.route('/asistencia', methods=['PUT'])
def retornar_asistencia():
    carnet = request.json.get('carnet')
    idEvento = request.json.get('idEvento')

    arr = []
    res = {}

    if carnet:
        res = collect_asistencia.find({"carnet": carnet}, {"_id": False})

    elif idEvento:
        res = collect_asistencia.find({"idEvento": idEvento}, {"_id": False})

    else:
        res = collect_asistencia.find({}, {"_id": False})

    for i in res:
        arr.append(i)
    
    return jsonify({"listado": arr, "server": os.environ['SERVER']})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=7050, use_reloader=True)