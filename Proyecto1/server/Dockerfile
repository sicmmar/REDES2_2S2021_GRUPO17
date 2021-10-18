FROM python:alpine3.9
COPY . /api
WORKDIR /api
RUN pip install --upgrade pip
RUN pip install flask
RUN pip install flask_cors
RUN pip install pymongo
RUN pip install "pymongo[srv]"
RUN pip install boto3
RUN pip install uuid
EXPOSE 7050
CMD python app.py