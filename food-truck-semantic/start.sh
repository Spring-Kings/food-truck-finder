#!/bin/bash
source ./venv/Scripts/activate

# Gotten from: https://spacy.io/models/en-starters#en_vectors_web_lg
python -m spacy download en_vectors_web_lg

# Start service
flask run
