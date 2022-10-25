from unicodedata import name
import requests
from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask.helpers import send_from_directory
import pandas as pd
import numpy as np

app = Flask(__name__, static_folder='./build', static_url_path='')
CORS(app)

@app.route('/recommendations', methods=['POST'])
@cross_origin()
def recommendations():
    print(request)
    genre_in = []
    genre_in.append(request.get_data().decode('utf-8'))
    for x in genre_in:
        print(x)
    query = '''
    query ($page: Int, $perPage: Int, $genre_in: [String]) {
        Page (page: $page, perPage: $perPage) {
            pageInfo {
                total
                perPage
            }
            media (genre_in: $genre_in) {
                id
                title {
                    romaji
                }
                genres
                popularity
                coverImage {
                    large
                }
            }
        }
    }
    '''
    variables = {
    'genre_in': genre_in,
    'page': 1,
    'perPage': 20,
    
    }
    url = 'https://graphql.anilist.co'

    response = requests.post(url, json={'query': query, 'variables': variables})
    df = pd.DataFrame(response.json()).data.Page['media']
    print(df)
    return response.text
@app.route('/test')
@cross_origin()    
def serve2():
    return 'testing flask!'  

@app.route('/')
@cross_origin()    
def serve():
    return send_from_directory(app.static_folder, 'index.html')
  
if __name__=='main':
    app.run()
