from unicodedata import name
import requests
from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask.helpers import send_from_directory
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
import random

app = Flask(__name__, static_folder='./build', static_url_path='')
CORS(app)

@app.route('/recommendations', methods=['POST'])
@cross_origin()
def recommendations():
    description = request.get_json()['description']
    print(description)
    genre_in = []
    genre_in.append(request.get_json()['genres'])
  
    # graphql query with variables
    query = '''
    query ($page: Int, $perPage: Int, $genre_in: [String]) {
        Page (page: $page, perPage: $perPage) {
            pageInfo {
                perPage
                currentPage
                total
            }
            media (genre_in: $genre_in) {
                id
                title {
                    romaji
                }
                genres
                description
                averageScore
                coverImage {
                    large
                }
                siteUrl
            }
        }
    }
    '''

    # randomize page queries
    page = random.randrange(1, 20)
    page2 = random.randrange(1, 20)

    variables = {
    'genre_in': genre_in,
    'page': page,
    'perPage': 50,
    }
    variables2 = {
    'genre_in': genre_in,
    'page': page2,
    'perPage': 50,
    }
    url = 'https://graphql.anilist.co'

    response = requests.post(url, json={'query': query, 'variables': variables})
    response2 = requests.post(url, json={'query': query, 'variables': variables2})
    
    # Create pandas Datarames from two responses
    df = pd.DataFrame(response.json()).data.Page['media']
    df_second = pd.DataFrame(response2.json()).data.Page['media']
    df = pd.DataFrame(df, columns=['title', 'description', 'averageScore', 'genres', 'coverImage', 'id', 'siteUrl'])
    df_second = pd.DataFrame(df_second, columns=['title', 'description', 'averageScore', 'genres', 'coverImage', 'id', 'siteUrl'])
    df2 = {'title': 'object', 'description': description, 'averageScore': 0, 'genres': "", 'id': 200, 'siteUrl': ""}
    df = pd.concat([df, df_second], ignore_index=True)

    # add anime to be compared to on the top of the dataframe
    df.loc[-1] = df2
    df.index = df.index + 1
    df.sort_index(inplace=True)

    # fill NaN values
    df['description'] = df['description'].fillna(value="")
    df['averageScore'] = df['averageScore'].fillna(value=0)
    df['description'] = df['description'].replace('<br>', '')
    df['description'] = df['description'].replace('&rdquo;', '')

    # remove stopwords, create TD-IDF vector and apply it to the above descriptions
    vector = TfidfVectorizer(min_df=1, stop_words='english')
    tfidf = vector.fit_transform(df['description'])
    mat = (tfidf * tfidf.T).toarray()
  
    # sort by descending, remove anime to be compared to
    df['similarity'] = mat[:, 0]
    df3 = df.sort_values(by=['similarity'], ascending=False)
    df3 = df3.iloc[1:, :]
    print(df3)

    # take only first 25 values, convert back to json for frontend
    df_f = df3.head(25).to_json(orient='records')
    return df_f

@app.route('/anime', methods=['POST'])
@cross_origin()
def anime():
    print(request)
    search = request.get_data().decode('utf-8')
    print(search)
    query = '''
    query ($search: String) {
            Media (search: $search) {
                id
                title {
                    romaji
                } 
                description
                averageScore
                coverImage {
                    large
                }
            }
        }
    '''
    variables = {
    'search': search,
    }
    url = 'https://graphql.anilist.co'

    response = requests.post(url, json={'query': query, 'variables': variables})
    df = pd.DataFrame(response.json()).data.Media
    df['description'] = df['description'].replace('<br>', '')
    df['description'] = df['description'].replace('&rdquo;', '')
    df['description'] = df['description'].replace('<i>', '')
    df['description'] = df['description'].replace('</i>', '')
    print(df)
    return df    

# meant to test that the server works as intended
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
