"""
    app.py
    ~~~~~~

    Root of the Flask app, allowing access to spaCy

    Kudos to https://spacy.io/usage/vectors-similarity for showing me
    how to solve my similarity predicament! The Java alternatives did
    not seem to want to work for me.
"""
from flask import Flask, request
from flask_cors import CORS
import os
import spacy

app = Flask(__name__)
# Learned via: https://stackoverflow.com/questions/54171101/restrict-access-to-a-flask-rest-api
cors = CORS(app, resources={"/*": {"origins": "http://localhost:3306/*"}})#os.environ.get("FOOD_TRUCK_API")})
nlp = spacy.load("en_vectors_web_lg")#os.environ.get("WORD_VEC_DICT"))

@app.route("/compare", methods=["POST"])
def get_similarity():
    """
    Endpoint for accessing spaCy's similarity comparison functionality

    Body parameter truck_tags: A set of the tags for the truck
    Body parameter search_tags: The tags the user input to search
    :return: A set of % matches, one for each tag of the truck
    """
    # Learned to extract from: https://stackoverflow.com/questions/10434599/get-the-data-received-in-a-flask-request
    truck_tags = request.form.getlist("truck_tags")
    search_tags = request.form.getlist("search_tags")
    result = []

    # Go through all provided Truck tags
    print(truck_tags)
    print(search_tags)
    for search in search_tags:
        print("{}:".format(search))
        truck_token = nlp(search)
        chosen_score = None

        # Compare the Truck tag to each User tag
        for truck in truck_tags:
            print("->{}".format(truck))
            tmp = truck_token.similarity(nlp(truck))
            if chosen_score is None or tmp > chosen_score:
                chosen_score = tmp

        # Save the results of the closest matching comparison
        print("==>{}".format(chosen_score))
        result.append(chosen_score)

    # Return the resulting best similarity ratings
    print(result)
    return {"sim_list": result}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=os.environ.get("PORT"))