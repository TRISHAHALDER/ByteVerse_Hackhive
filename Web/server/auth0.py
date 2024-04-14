import requests
import os

from pymongo import MongoClient
from dotenv import load_dotenv
import base64

load_dotenv()

# MongoDB connection URI with properly escaped username and password
uri=os.getenv("mongo")

# Establish connection to MongoDB
cluster = MongoClient(uri)
db = cluster['data']



# start
# Define your Auth0 credentials
# auth0_domain = fill here
management_api_token = os.getenv("mapi")
encoded_token= base64.b64encode(management_api_token.encode()).decode()
# Define the API endpoint for retrieving users
api_url = f'https://{auth0_domain}/api/v2/users'

# Define headers with the Authorization token
headers = {
    'Authorization': f'Bearer {encoded_token}',
    'Content-Type': 'application/json'
}

# end








response = requests.get(api_url, headers=headers)

# Check if the request was successful (status code 200)
if response.status_code == 200:
    users = response.json()
    print("List of Users:")
    for user in users:
        user_data = {
        "user_id": user['user_id'],
        "name": user['name'],
        "email": user['email'],
        "procedures":{"dummy":"dummy"}
        }
        print(user_data)
        db["users"].insert_one(user_data)


else:
    print("Failed to retrieve users. Status code:", response.status_code)
    print("Response:", response.text)