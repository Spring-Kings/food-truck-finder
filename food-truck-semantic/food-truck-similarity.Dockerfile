FROM tiangolo/meinheld-gunicorn-flask:python3.8

WORKDIR /app
COPY . .

RUN pip install -r requirements.txt
RUN python3 -m spacy download en_core_web_md