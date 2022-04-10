import os
import pymongo
import json
import random
import hashlib
import time

import requests

from hashlib import sha256



def MageCall(param1):
    url = "https://api.mage.ai/v1/predict"

    payload = json.dumps({
    "api_key": "MBhHDft3bLlyww5J0CnNiFsyPSSxnKfRXI8D3Iqh",
    "features": [
        {
        "id": param1
        }
    ],
    "include_features": False,
    "model": "recommendations_rank_1646591694022",
    "version": "1"
    })
    headers = {
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    print(response.text)
    
    js = json.loads(response.text)
    
    return js[0]['prediction']



def sendsms(tonum, message):


    url = "https://us-central1-aiot-fit-xlab.cloudfunctions.net/sendsms"

    payload = json.dumps({
    "receiver": tonum,
    "message": message,
    "token": "hacke"
    })
    headers = {
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    # print(response.text)

def hashthis(st):


    hash_object = hashlib.md5(st.encode())
    h = str(hash_object.hexdigest())
    return h



def dummy(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    if request.method == 'OPTIONS':
        # Allows GET requests from origin https://mydomain.com with
        # Authorization header
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '3600',
            'Access-Control-Allow-Credentials': 'true'
        }
        return ('', 204, headers)

    # Set CORS headers for main requests
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
    }

    request_json = request.get_json()



    receiver_public_key = os.environ.get('ownpublic')

    mongostr = os.environ.get('MONGOSTR')
    client = pymongo.MongoClient(mongostr)
    db = client["ondelay"]


    retjson = {}

    action = request_json['action']



    if action == "getuseridfromphone":
        col = db.users

        for x in col.find():
            if x['phone'] == request_json['phone']:
                retjson['status'] = "found"
                retjson['name'] = x['name']
                retjson['id'] = x['id']
                retjson['balance'] = x['balance']

                return json.dumps(retjson)

        retjson['status'] = "unknown"
        retjson['name'] = "none"
        retjson['id'] = "-1"
        retjson['balance'] = 0

        return json.dumps(retjson)

    if action == "getmnemonic":
        col = db.users

        for x in col.find():
            if x['id'] == request_json['userid']:

                retjson['mnemonic'] = x['mnemonic']
                # retjson['weeklymiles'] = x['weekly']

                return json.dumps(retjson)
        
        return json.dumps(retjson)


    if action == "insurancehistory":
        userid = request_json['userid']

        col = db.paymenthistory
        
        curr = 0
        allpay = []
        currtotal = 0
        for x in col.find():
            if x['type'] == "insurance":
                if x['status'] == "current":
                    currtotal += x['amount']
                    if x['userid'] == userid:
                        curr = x['amount']
                else:
                    if x['userid'] == userid:
                        allpay.append(x['amount'])
        retjson['paymenttotal'] = currtotal
        retjson['userpayment'] = curr
        retjson['paymenthistory'] = allpay

        return json.dumps(retjson)


    if action == "magecall":
        param1 = request_json['userid']

        resp = MageCall(int(param1))

        retjson['restaurantids'] = resp

        return json.dumps(retjson)


    if action == "getallcontractsbyuser":
        col = db.contracts

        data = []

        for x in col.find():
            
            if x['userid'] != request_json['userid']:
                continue
            ami = {}
            ami["id"] = x["id"]
            ami["flight"] = x["flight"]
            ami["amount"] = x["amount"]
            ami["delay"] = x["delay"]
            ami["premium"] = x["premium"]

            data.append(ami)

        retjson['contracts'] = data

        return json.dumps(retjson)




    if action == "getflightinfo":
        col = db.flights

        data = []

        for x in col.find():
            if x['flightid'] != request_json['code']:
                continue

            ami = {}
            ami["id"] = x["id"]
            ami["code"] = x["flightid"]
            ami["delay"] = x["delay"]
            ami["histdelay"] = x["histdelay"]
            ami["preddelay"] = x["preddelay"]
            ami["origin"] = x["origin"]
            # ami["airline"] = x["airline"]
            ami['destination'] = x['destination']
            ami['arrival'] = x['arrival']
            ami['predictedarrival'] = x['predictedarrival']
            ami['autoclaim'] = x['eligible']
            ami['risk'] = x['risk']
            ami['airline'] = x['airline']

            data.append(ami)

        retjson['requests'] = data

        return json.dumps(retjson)



    if action == "getallusers":
        col = db.users

        data = []

        for x in col.find():
            ami = {}
            
            ami["id"] = x["id"]
            ami["name"] = x["name"]
            
            ami["details"] = x["details"]
            ami["phone"] = x["phone"]
            ami["imageurl"] = x["imageurl"]
            ami['balance'] = x['balance']

            
            data.append(ami)

        retjson['users'] = data

        return json.dumps(retjson)

    if action == "keygen":
        
        pair = Keypair.random()
        # print(f"Secret: {pair.secret}")
        # Secret: SCMDRX7A7OVRPAGXLUVRNIYTWBLCS54OV7UH2TF5URSG4B4JQMUADCYU
        # print(f"Public Key: {pair.public_key}")
        retjson['status'] = "generated"                
        retjson['secret'] = pair.secret
        retjson['public'] = pair.public_key
        

        return json.dumps(retjson)



    if action == "addflight" :
        maxid = 1
        col = db.flights
        for x in col.find():
            id = x["id"]
            maxid +=1
        id = str(maxid+1)

        payload = {}

        uid = id 
        payload["id"] = id
        # payload["uid"] = request_json['uid']
        # payload["name"] = request_json['name']
        payload["flightid"] = request_json['flightid']
        payload["delay"] = request_json['delay']
        payload["histdelay"] = request_json['histdelay']
        payload["preddelay"] = request_json['preddelay']
        payload["origin"] = request_json['origin']
        payload["destination"] = request_json['destination']
        payload["arrival"] = request_json['arrival']
        payload["predictedarrival"] = request_json['predictedarrival']
        payload["eligible"] = request_json['eligible']
        payload["risk"] = request_json['risk']
        payload["airline"] = request_json['airline']
        

        # payload["password"] = request_json['password']
        
        result=col.insert_one(payload)

        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "successfully added"
        retjson['id'] = id

        return json.dumps(retjson)



    if action == "calculatepremium" :

        col = db.flights

        found = 0
        preddelay = 0
        premium = 0.0
        histdelay = 0
        for x in col.find():
            if x['flightid'] == request_json['flight']:
                found = 1
                preddelay = x['delay']
                histdelay = x['histdelay']
                break
        
        if found == 0:        
            retjson['status'] = "error flight not found"
            retjson['id'] = "-1"

            return json.dumps(retjson)



        maxid = 1
        col = db.contracts
        for x in col.find():
            id = x["id"]
            maxid +=1
        id = str(maxid+1)

        payload = {}

        uid = id 
        payload["id"] = id
        # payload["uid"] = request_json['uid']
        # payload["name"] = request_json['name']
        payload["flight"] = request_json['flight']
        payload["delay"] = request_json['delay']
        payload["amount"] = request_json['amount']
        payload["userid"] = request_json['userid']

        if request_json['delay'] < preddelay:
            premium = request_json['amount']
        
        if request_json['delay'] > preddelay and  request_json['delay'] > histdelay:
            premium = request_json['amount'] / 20.0                                          ##do actuarial math here
        
        if request_json['delay'] > preddelay and  request_json['delay'] < histdelay:
            premium = request_json['amount'] / 5.0
        
        payload["premium"] = premium
        
        # result=col.insert_one(payload)

        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "successfully calculated"
        retjson['premium'] = premium

        retjson['id'] = id

        return json.dumps(retjson)





    if action == "addcontract" :

        col = db.flights

        found = 0
        preddelay = 0
        premium = 0.0
        histdelay = 0
        for x in col.find():
            if x['flightid'] == request_json['flight']:
                found = 1
                preddelay = x['delay']
                histdelay = x['histdelay']
                break
        
        if found == 0:        
            retjson['status'] = "error flight not found"
            retjson['id'] = "-1"

            return json.dumps(retjson)



        maxid = 1
        col = db.contracts
        for x in col.find():
            id = x["id"]
            maxid +=1
        id = str(maxid+1)

        payload = {}

        uid = id 
        payload["id"] = id
        # payload["uid"] = request_json['uid']
        # payload["name"] = request_json['name']
        payload["flight"] = request_json['flight']
        payload["delay"] = request_json['delay']
        payload["amount"] = request_json['amount']
        payload["userid"] = request_json['userid']

        if request_json['delay'] < preddelay:
            premium = request_json['amount']
        
        if request_json['delay'] > preddelay and  request_json['delay'] > histdelay:
            premium = request_json['amount'] / 20.0                                          ##do actuarial math here
        
        if request_json['delay'] > preddelay and  request_json['delay'] < histdelay:
            premium = request_json['amount'] / 5.0
        
        payload["premium"] = premium
        
        result=col.insert_one(payload)

        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "successfully added"
        retjson['premium'] = premium

        retjson['id'] = id

        return json.dumps(retjson)




    if action == "register" :
        maxid = 1
        col = db.users
        for x in col.find():
            id = x["id"]
            maxid +=1
        id = str(maxid+1)

        payload = {}

        uid = id 
        payload["id"] = id
        # payload["uid"] = request_json['uid']
        # payload["name"] = request_json['name']
        payload["name"] = request_json['name']
        payload["email"] = request_json['email']
        payload["phone"] = request_json['phone']

        # payload['address'] = request_json['address']

        payload["password"] = request_json['password']

        # if "age" in request_json:
        #     payload["age"] = request_json['age']
        # else:
        #     payload["age"] = "-1"
        # if "gender" in request_json:
        #     payload["gender"] = request_json['gender']
        # else:
        #     payload["gender"] = "great things happen after 2am"
        
        # payload["cuisine"] = request_json['cuisine']
        # payload["publickey"] = request_json['publickey']
        
        result=col.insert_one(payload)

        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "successfully added"
        retjson['userid'] = id

        return json.dumps(retjson)


    if action == "login":
        col = db.users
        for x in col.find():
            if x['email'] == request_json['email'] and x['password'] == request_json['password']:
                userid = x['id']
                name = x['name']
                retjson = {}

                # retjson['dish'] = userid
                retjson['status'] = "success"
                retjson['name'] = name
                retjson['userid'] = userid
                

                return json.dumps(retjson)
        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "fail"
        retjson['userid'] = "-1"

        return json.dumps(retjson)




    if action == "route":
        lat1 = request_json['start']['latitude']
        lng1 = request_json['start']['longitude']
        lat2 = request_json['end']['latitude']
        lng2 = request_json['end']['longitude']

        wp = getroute(lat1,lng1,lat2,lng2)

        retjson = {}
         # retjson['dish'] = userid
        retjson['status'] = "fail"
        retjson['route'] = wp

        return json.dumps(retjson)
        


    if action == "routecache":
        lat1 = request_json['start']['latitude']
        lng1 = request_json['start']['longitude']
        lat2 = request_json['end']['latitude']
        lng2 = request_json['end']['longitude']

        # wp = getroute(lat1,lng1,lat2,lng2)

        wp = "[]"

        for x in col.find():
            wp = x['route']

        retjson = {}
         # retjson['dish'] = userid
        retjson['status'] = "fail"
        retjson['route'] = wp

        return json.dumps(retjson)
 

    retstr = "action not done"

    if request.args and 'message' in request.args:
        return request.args.get('message')
    elif request_json and 'message' in request_json:
        return request_json['message']
    else:
        return retstr
