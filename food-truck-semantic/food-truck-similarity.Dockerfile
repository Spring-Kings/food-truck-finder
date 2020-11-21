FROM python:3.8-slim-buster

WORKDIR /app
COPY . .

#RUN pip install python-dotenv

RUN python3 -m venv venv
RUN . venv/bin/activate

RUN pip install -r ./requirements.txt
RUN python3 -m spacy download en_vectors_web_lg

CMD ["python3", "app.py"]
