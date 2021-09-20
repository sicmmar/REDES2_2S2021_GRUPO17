# Manual Técnico

Práctica 2

Redes de computadores 2

---

## Grupo 17

Integrantes

|  Carnet   |            Nombre             |
| :-------: | :---------------------------: |
| 200113057 | Mario Augusto Pineda Morales  |
| 201313828 |  Bernald Renato Paxtor Peren  |
| 201504051 |   Asunción Mariana Sic Sor    |
| 201612101 | Abner Abisai Hernandez Vargas |

# Tabla de Contenido

* [Servidor](#servidor)
    * [Desarrollo](#desarrollo-servidor)
        * [Insertar registro](#insertar-registro)
        * [Obtener registros](#obtener-registros)
    * [Dockerfile](#dockerfile-servidor)
* [Docker Compose](#docker-compose)
    * [Definición de redes](#definición-de-redes)
    * [Definición de servicios](#definición-de-servicios)

# Servidor

El [servidor](service/server/app.py) fue desarrollado con una API en Python con Flask

## Desarrollo servidor

Dado que la base de datos se trabaja con MongoDB, primero se importan las librerías necesarias y se enlaza la conexión a la base de datos y colección correspondiente.

```python
# Libreria para conectar con mongoDB
from pymongo import MongoClient
import os

# Conectar a mongo
# se entrega variable de entorno que contiene URI de Mongo
client = MongoClient(os.environ['URI_MONGO'])

# Seleccionar base de datos y coleccion
db = client['redes2']
collection = db.estudiantes
```

### Insertar registro

Para insertar un registro, se utiliza la dirección [`POST/ http://HOST_SERVER:PUERTO/`]() y se entrega como cuerpo la siguiente estructura JSON:

```json
{
    "carnet": "...",
    "nombre": "...",
    "curso": "...",
    "mensaje": "..."
}
```

De esta manera inserta a la colección de mongo en base al siguiente modelo:

```json
{
    "carnet": "...",
    "nombre": "...",
    "curso": "...",
    "mensaje": "...",
    "servidor": "segun variable entorno"
}
```

En dado caso el almacenamiento sea correcto, devuelve la siguiente respuesta:

```json
{
    "status": 200, 
    "mensaje": "mensaje guardado"
}
```

Caso contrario,

```json
{
    "status": 403, 
    "mensaje": "error de guardado"
}
```

> Definición en python
> ```python
> @app.route('/', methods=['POST'])
> def ingresar():
>     respuesta = collection.insert_one(
>         {
>             "carnet": request.json.get('carnet'),
>             "nombre": request.json.get('nombre'),
>             "curso": request.json.get('curso'),
>             "mensaje": request.json.get('mensaje'),
>            "servidor": os.environ['SERVER'] 
>         }
>     )
>     if respuesta: return jsonify({'status': 200, 'mensaje': 'mensaje guardado'})
>    else: return jsonify({'status': 403, 'mensaje': 'error de guardado'})
> ```

### Obtener registros

Para obtener los registros de la base de datos, se utiliza la dirección [`PUT/ http:HOST_SERVER:PUERTO/`]()

* Si el cuerpo se entrega vacío, la petición devuelve los registros de **cualquier carnet** en un arreglo tipo JSON

* Si el cuerpo de la petición es 
    ```json
    {
        "carnet":"..."
    }
    ```
    entregará como respuesta los registros correspondientes al carnet especificado.

> Definición en Python
> ```python
>    @app.route('/', methods=['PUT'])
>    def retornar():
>        carnet = request.json.get('carnet')
>        arr = []
>        res = {}
>
>        if carnet:
>            res = collection.find({"carnet": carnet}, {"_id": False})
>        else:
>            res = collection.find({}, {"_id": False})
>
>        for i in res:
>            arr.append(i)
>        
>        return jsonify(arr)
> ```


## Dockerfile servidor

Se construye la [imagen del servidor](service/server/Dockerfile) para posteriormente hacer réplica de él con [docker-compose](#docker-compose)

```Dockerfile
FROM python:alpine3.9
#copiar en /api lo que se encuentra en la raíz del server
COPY . /api
#establecer /api como directorio de trabajao
WORKDIR /api
#actualizar pip
RUN pip install --upgrade pip

#instalar las librerias para levantar la API en Python
RUN pip install flask
RUN pip install flask_cors
RUN pip install pymongo
RUN pip install "pymongo[srv]"

#exponer el puerto 7050 del contenedor
EXPOSE 7050
#correr la aplicacion
CMD python app.py
```

# Docker Compose

El archivo [docker-compose.yaml](docker-compose.yaml) se utiliza para levantar todos los contenedores mencionados, conectar entre los que sea necesario y crear las tres diferentes redes.

## Definición de redes

Dentro del espacio de `networks:` del archivo de docker-compose

* Red de service

```yml
#nombre de la red "service_network"
service_network:
    #tipo de driver "bridge"
    driver: "bridge"
    #configurar la red a utilizar con su máscara de red
    ipam:
        config:
            - subnet: 172.35.77.0/24
```

## Definición de servicios

Dentro del espacio de `services:` del archivo de docker-compose

* Servers

```yml
# se define el nombre del contenedor
server1:
        container_name: server1
        restart: always
        # dirección donde se encuentra Dockerfile para construir la imagen
        build: ./service/server
        # puertos a exponer HOST:CONTAINER
        ports:
            - "7050:7050"
        # variables de entorno como URI de mongo, y el ID del server
        environment:
            - URI_MONGO=mongodb+srv
            - SERVER=200113057
        # la red a la que estará conectado el contenedor
        networks: 
            - service_network

    # se repite lo mismo para las réplicas de los servidores

    server2:
        container_name: server2
        restart: always
        build: ./service/server
        ports:
            - "7051:7050"
        environment:
            - URI_MONGO=mongodb+srv
            - SERVER=201313828
        networks: 
            - service_network

    server3:
        container_name: server3
        restart: always
        build: ./service/server
        ports:
            - "7052:7050"
        environment:
            - URI_MONGO=mongodb+srv
            - SERVER=201612101
        networks: 
            - service_network
```