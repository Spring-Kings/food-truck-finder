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
from werkzeug.exceptions import abort

app = Flask(__name__)
# Learned via: https://stackoverflow.com/questions/54171101/restrict-access-to-a-flask-rest-api
cors = CORS(app, resources={"/*": {"origins": os.environ.get("FOOD_TRUCK_API")}})
nlp = spacy.load("en_vectors_web_lg")

# Load constants for the comparisons
MIN_FOR_EXACT = os.environ.get("MIN_FOR_EXACT") or 0.98
MIN_FOR_TYPE = os.environ.get("MIN_FOR_TYPE") or 0.65


@app.route("/compare", methods=["POST"])
def get_similarity():
    """
    Endpoint for accessing spaCy's similarity comparison functionality

    Body parameter truck_tags: A set of trucks to parse. The needed
    information in these trucks is their tags and their ID.
    Body parameter search_tags: The tags the user input to search
    :return: A set of % matches, one for each truck. Each % match
             follows the formula:
             [(# perfect matches) + 0.5 * (# partial matches)] / (# search tags)
    """
    # Learned to extract from: https://stackoverflow.com/questions/10434599/get-the-data-received-in-a-flask-request
    data = request.json
    all_truck_tags = data["trucks"]
    search_tags = data["tags"]
    result = {}

    # If the parameters provided were invalid, abort
    if all_truck_tags is None or search_tags is None:
        abort(400)

    # Go through all provided Truck tags
    for truck in all_truck_tags:
        result[truck["truckID"]] = get_similarity_for(truck["tags"],
                                                      search_tags)

    # Return the resulting similarity ratings
    return {"similarity_scores": result}


def get_similarity_for(truck_tags, search_tags):
    """
    Uses spaCy's similarity functionality to compare the provided set of
    truck tags to the provided search.

    :param truck_tags: The truck tags to compare against
    :param search_tags: The search tags to judge the % match by
    :return: A set of % matches, one for each tag of the truck
    """
    # Assume a 0% match
    result = 0

    # Go through all provided Truck tags
    for search in search_tags:
        truck_token = nlp(search)
        chosen_score = 0

        # Compare the Truck tag to each User tag
        for truck in truck_tags:
            computed_score = truck_token.similarity(nlp(truck))

            # If the tag is an exact match, give len(truck_tags) to give a full
            # 100% match for this tag. If it's the right category, give it 0.5
            # (so as to give it 50% credit for each partial match in the
            # truck's tags; this accounts for factoring in truck's composition)
            if computed_score > MIN_FOR_EXACT:
                chosen_score = len(truck_tags)
                break
            elif computed_score > MIN_FOR_TYPE:
                chosen_score += 0.5

        # Save the results of the closest matching comparison
        result += chosen_score / len(truck_tags)

    # Return the percent of the search tags that were exact or fuzzy matched
    return result / len(search_tags)
