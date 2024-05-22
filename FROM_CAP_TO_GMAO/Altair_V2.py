import sys, traceback

import Error as err

########_____Retourne le Token du user (connexion)
def getAltairToken(base, site, user, mdp):
    import http.client
    import mimetypes
    import json
    conn = http.client.HTTPSConnection("paprec.altairsystem.fr",443)
    payload = "{\r\n  \"username\":\""+user+"\",\r\n  \"password\":\""+mdp+"\",\r\n  \"site\":\""+site+"\",\r\n  \"passwordprehashed\": false\r\n\r\n}"
    headers = {
    'Content-Type': 'application/json'
    }
    print(payload)
    try:
        conn.request("POST", "/"+base+"rest/rest/system/login", payload, headers)
        res = conn.getresponse()
        data = res.read()
        #print(data.decode("utf-8"))
        reponseJson = json.loads(data.decode("utf-8"))
        reponse=reponseJson["token"] #selecionne le token dans l'objet reponse au format Json
    except:
        err.traitmentErrorNoBreak(sys.exc_info())
        reponse="None"
    return reponse

#######______Logout
def logOutAltair(base, user, token):
    import http.client
    import mimetypes
    conn = http.client.HTTPSConnection("paprec.altairsystem.fr",443)
    payload = "{\r\n  \"username\": \""+user+"\",\r\n  \"token\": \""+token+"\"\r\n}"
    headers = {
    'Authorization': 'Bearer '+token,
    'Content-Type': 'application/json'
    }
    try:
        conn.request("GET", "/"+base+"rest/rest/system/logout", payload, headers)
        res = conn.getresponse()
        data = res.read()
        #print(data.decode("utf-8"))
    except:
        err.traitmentErrorNoBreak(sys.exc_info())
    # la fonction ne retourne rien c'est juste un logout !


#######______Creation de la DI ou FD
def createWorkrequest(token,description,fkcodelocalisation,fkcodeequipment,commentaire,priority,type,creationdate,createdby,fkcodemask):
    import http.client
    import mimetypes
    import json
    conn = http.client.HTTPSConnection("paprec.altairsystem.fr",443)

    payload = "{\r\n  \"description\": \""+description+"\",\r\n  \"fkcodelocalisation\": \""+fkcodelocalisation+"\",\r\n  \"fkcodeequipment\": \""+fkcodeequipment+"\",\r\n  \"wrm1\": \""+commentaire+"\",\r\n  \"priority\": \""+priority+"\",\r\n  \"type\": \""+type+"\",\r\n  \"creationdate\": \""+creationdate+"\",\r\n  \"createdby\": \""+createdby+"\",\r\n  \"fkcodemask\": \""+fkcodemask+"\"\r\n}"
    headers = {
    'Authorization': 'Bearer '+token,
    'Content-Type': 'application/json'
    }
    try:
        conn.request("POST", "/"+base+"rest/rest/work/all/create/WORKREQUEST", payload, headers)
        res = conn.getresponse()
        data = res.read()
        #print(data.decode("utf-8"))
        reponseJson = json.loads(data.decode("utf-8"))
        codeworkrequest=reponseJson["codeworkrequest"] #selecionne le codeworkrequest dans l'objet reponse au format Json
        return codeworkrequest
    except:
        err.traitmentErrorNoBreak(sys.exc_info())
        return "None"

#######______Creation du doc lié a la DI ou FD
def createDoc(token,datacode,description,name,docdata,islink,fkcodesite,fkcodemask,fkcodeorg,fkcodedirectory):
    import http.client
    import mimetypes
    import json
    conn = http.client.HTTPSConnection("paprec.altairsystem.fr",443)

    payload = "{\r\n  \"datacode\": \""+str(datacode)+"\",\r\n  \"description\": \""+str(description)+"\",\r\n  \"document\": {\r\n    \"description\": \""+str(description)+"\",\r\n    \"docversion\": 0,\r\n    \"name\": \""+str(name)+"\",\r\n    \"docdata\":\""+str(docdata)+"\"\r\n },\r\n  \"islink\": "+islink+",\r\n  \"fkcodemask\": \""+fkcodemask+"\",\r\n \"fkcodedirectory\": \""+fkcodedirectory+"\"\r\n }"


    headers = {
    'Authorization': 'Bearer '+token,
    'Content-Type': 'application/json'
    }
    try:
        conn.request("POST", "/"+base+"rest/rest/linkeddocs/all/documentlibrary/create", payload, headers)
        res = conn.getresponse()
        data = res.read()
        #print(data.decode("utf-8"))
        reponseJson = json.loads(data.decode("utf-8"))

        return "Imported"
    except:
        err.traitmentErrorNoBreak(sys.exc_info())
        return "None"



######    obtient la liste equipement et la liste localisation du site de connexion ######
# format du retour
#    [liste equipment,liste localisation]
# liste esuipment : code_equipement, descriton, equipment parent, localisation parent
# liste localisation : code localisation, code parent
def getEquipLoc(token,base):
    import http.client
    import mimetypes
    import json
    conn = http.client.HTTPSConnection("paprec.altairsystem.fr",443)
    headers = {
    'Authorization': 'Bearer '+token,
    'Content-Type': 'application/json'
    }

    liste=[]
    equipments=[]
    locations =[]

    try:
        conn.request("GET", "/"+base+"rest/rest/refdata/all/equipment/list/EQUIPMENT", "", headers)
        res = conn.getresponse()
        data = res.read()
        #print(data.decode("utf-8"))
        reponseJson = json.loads(data.decode("utf-8"))

        repEquipments=reponseJson["equipment"]
        for equip in repEquipments :
                if equip["status"] !="REBUT" :
                    equipment={"codeequipment": equip["codeequipment"], "description": equip["description"], "fkcodeequipment" : equip.get("fkcodeequipment"), "fkcodelocation" : equip.get("fkcodelocation")}
                    equipments.append(equipment)


    except:
        err.traitmentErrorNoBreak(sys.exc_info())

    try:
        conn.request("GET", "/"+base+"rest/rest/refdata/all/location/list/LOCATION", "", headers)
        res = conn.getresponse()
        data = res.read()
        #print(data.decode("utf-8"))
        reponseJson = json.loads(data.decode("utf-8"))

        repLocations=reponseJson["location"]
        for loc in repLocations :
                location={"codelocation": loc["codelocation"], "description": loc["description"], "fkcodelocation" : equip.get("fkcodelocation")}
                locations.append(location)


    except:
        err.traitmentErrorNoBreak(sys.exc_info())


    print(len(equipments))
    print(len(locations))
    liste.append(equipments)
    liste.append(locations)
    return liste

##### retourne un string type json avec nom de la liste et valeur

def getValueList(liste,lang="fr_FR") : # liste = tableau contenant le nom de chaque liste au format altair
    import http.client
    import mimetypes
    import json

    conn = http.client.HTTPSConnection("paprec.altairsystem.fr",443)
    headers = {
    'Authorization': 'Bearer '+token,
    'Content-Type': 'application/json'
    }

    rListe=[]

    for valuelist in liste :
        try:
            li=[]
            conn.request("GET", "/"+base+"rest/rest/system/vl/"+valuelist, "", headers)
            res = conn.getresponse()
            data = res.read()
            #print(data.decode("utf-8"))
            reponseJson = json.loads(data.decode("utf-8"))
            transl=reponseJson["valuelist"][0]["value"]["valuetranslations"]
            for l in transl["valuetranslations"]:
                if l["locale"] == lang:
                    li.append(l["translatedvalue"])



        except:
            err.traitmentErrorNoBreak(sys.exc_info())

        rListe.append({valuelist : li})

    return rListe



def testAltair():
    import UtilsFunction as uti
    config=uti.getConfig()
    config['token']=getAltairToken(config['base'],config['site'], config['userGMAO'], config['passwordGMAO'])
    print(config['token'])

    getEquipLoc(config['token'],config['base'])

    logOutAltair(config['base'],config['userGMAO'],config['token'])
    print("connexion réussi")
    return True
testAltair()




