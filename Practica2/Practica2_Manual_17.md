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

- [Manual Técnico](#manual-técnico)
  - [Grupo 17](#grupo-17)
- [Tabla de Contenido](#tabla-de-contenido)
- [Servidor](#servidor)
  - [Desarrollo servidor](#desarrollo-servidor)
    - [Insertar registro](#insertar-registro)
    - [Obtener registros](#obtener-registros)
  - [Dockerfile servidor](#dockerfile-servidor)
- [Base de Datos](#base-de-datos)
- [Load Balancer](#load-balancer)
- [FrontEnd](#frontend)
- [Docker Compose](#docker-compose)
  - [Definición de redes](#definición-de-redes)
  - [Definición de servicios](#definición-de-servicios)

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

# Base de Datos

Como motor de base de datos fue usado MongoDB [<img src=".images/mongodb_logo_icon.svg" width="35"/>](.images/NGINX-product-icon.svg), con la [imágen](https://hub.docker.com/_/mongo/) ubicada en docker hub como base.

Para construir el docker container de MongoDB se uso la siguiente configuracion en el archivo docker-compose.yml.

```yaml
container_name: database
image : mongo        
environment:
    - PUID=1000
    - PGID=1000
    - MONGO_INITDB_ROOT_USERNAME=grupo17
    - MONGO_INITDB_ROOT_PASSWORD=grupo17
restart: unless-stopped
```
Las variables de entorno "MONGO_INITDB_ROOT_USERNAME" y "MONGO_INITDB_ROOT_PASSWORD" fueron usadas para definir el usuario y password para la autentificación al conectarse con la base de datos.

# Load Balancer

Se utilizó nginx open source [<img src=".images/NGINX-product-icon.svg" width="15"/>](.images/NGINX-product-icon.svg), con la [imágen](https://hub.docker.com/_/nginx) de docker hub como base.

El archivo de configuración para realizar el balanceo es el siguiente

```yaml
# pool de servidores hacia los que se hará el balanceo
# al no tener un peso se hace una distribución homogénea
upstream backend_servers {
    server server1:7050;
    server server2:7050;
    server server3:7050;
}


server {
# el servidor estará escuchando en el puerto 80
    listen 80;

# la ruta de escucha
    location / {
# y la referencia al pool correspondiente a la ruta
        proxy_pass http://backend_servers/;
    }
}
```

# FrontEnd

Se construye la imagen del FrontEnd para esto hacemos uso de la imagen de node en su version 12-alpine

```yaml
#Definimos la imagen base a utilizar
FROM node:12-alpine

#Definimos nuestro directorio de trabajo
WORKDIR /usr/src/app
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

# Instalamos las dependencias para nuestra aplicación
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

CMD ["npm", "start" ]
```

# Docker Compose

El archivo [docker-compose.yaml](docker-compose.yaml) se utiliza para levantar todos los contenedores mencionados, conectar entre los que sea necesario y crear las tres diferentes redes.

## Definición de redes

Dentro del espacio de `networks:` del archivo de docker-compose

* Red de service

```yml
#nombre de la red "backendNetwork"
backendNetwork:
    #tipo de driver "bridge"
    driver: "bridge"
    #configurar la red a utilizar con su máscara de red
    ipam:
        config:
            - subnet: 172.35.77.0/24
#nombre de la red "databaseNetwork"
databaseNetwork:
        #tipo de driver "bridge"
        driver: "bridge"
        #configurar la red a utilizar con su máscara de red
        ipam:
            config:
                - subnet: 10.10.17.0/24
frontend_network:
        #tipo de driver "bridge"
        driver: "bridge"
        #configurar la red a utilizar con su máscara de red
        ipam:
            config:
                - subnet: 192.168.57.0/24
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
        # variables de entorno como URI de mongo, y el ID del server
        environment:
            - URI_MONGO=mongodb://grupo17:grupo17@database:27017
            - SERVER=200113057
        # la red a la que estará conectado el contenedor
        networks:
            - backendNetwork
            #Se agrego la red "databaseNetwork" para que el servidor pueda acceder al contenedor de la base de datos
            - databaseNetwork

    # se repite lo mismo para las réplicas de los servidores

    server2:
        container_name: server2
        restart: always
        build: ./service/server
        environment:
            - URI_MONGO=mongodb://grupo17:grupo17@database:27017
            - SERVER=201313828
        networks:
            - backendNetwork
            - databaseNetwork

    server3:
        container_name: server3
        restart: always
        build: ./service/server
        environment:
            - URI_MONGO=mongodb://grupo17:grupo17@database:27017
            - SERVER=201612101
        networks:
            - backendNetwork
            - databaseNetwork

    balancer:
        container_name: balancer
        # nombre de la imágen (en dockerhub) en la que está basado el contenedor
        image: nginx
        # mapeo de volumen para poder hacer cambios desde fuera del container
        # punto de montaje para apuntar a la ruta origen
        volumes:
            - ./service/balancer/conf:/etc/nginx/conf.d
        networks:
            service_network:
              ipv4_address: 172.35.77.254
            frontend_network:
              ipv4_address: 192.168.57.254
    
    database:
        container_name: database
        # nombre de la imágen (en dockerhub) en la que está basado el contenedor
        image : mongo        
        # declaracion de variables de entorno como el usuario y contraseña para autentificación
        environment:
            - PUID=1000
            - PGID=1000
            - MONGO_INITDB_ROOT_USERNAME=grupo17
            - MONGO_INITDB_ROOT_PASSWORD=grupo17
        restart: unless-stopped
        # la red a la que estará conectado el contenedor
        networks:
            - databaseNetwork


    frontend:
        container_name: frontend
        restart: always
        # dirección donde se encuentra Dockerfile para construir la imagen
        build: ./frontend
        # Mapeamos el puerto 3000 al puerto 80
        ports:
            - 80:3000
        # la red a la que estará conectado el contenedor
        networks:
            - frontend_network
```