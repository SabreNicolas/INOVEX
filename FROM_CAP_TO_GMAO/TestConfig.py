######_______POUR TESTER LA PRESENCE DES LIBRAIRIE_______######
def testlibrairie():
    b=True
    try:
        import sys
    except:
        print("Librairie sys manquante")
        b=False
        pass
    try:
        import traceback
    except:
        print("Librairie traceback manquante")
        b=False
        pass
    try:
        import os
    except:
        print("Librairie os manquante")
        b=False
        pass
    try:
        import base64
    except:
        print("Librairie base64 manquante")
        b=False
        pass
    try:
        from datetime import datetime
    except:
        print("Librairie datetime manquante")
        b=False
        pass
    try:
        import http.client
    except:
        print("Librairie http manquante")
        b=False
        pass
    try:
        import mimetypes
    except:
        print("Librairie mimetypes manquante")
        b=False
        pass
    try:
        import json
    except:
        print("Librairie json manquante")
        b=False
        pass
    try:
        from dateutil import tz
    except:
        print("Librairie dateutil (module tz) manquante")
        b=False
        pass
    try:
        import requests
    except:
        print("Librairie requests manquante")
        b=False
        pass
    try:
        import xml.etree.ElementTree as ET
    except:
        print("Librairie xml manquante")
        b=False
        pass
    try:
        import configparser
    except:
        print("Librairie configparser manquante")
        b=False
        pass

    if(b):
        print("Toutes les librairies sont présentes")
        return b
    else:
        return b


#######_________POUR TESTER LA CONNEXION A ALTAIR___________###########
def testConnexionAltair():
    import Altair_V2 as alt
    import UtilsFunction as uti
    config=uti.getConfig()
    config['token']=alt.getAltairToken(config['base'],config['site'], config['userGMAO'], config['passwordGMAO'])
    print(config['token'])
    alt.logOutAltair(config['base'],config['userGMAO'],config['token'])
    print("connexion réussi")
    return True
testConnexionAltair()
######__________FONCTION DE TEST PRINCIPALE___________#########
def MainTest():
    import sys
    librairie=testlibrairie()
    if(librairie):
        ALTAIR=testConnexionAltair()
        if(ALTAIR):
            print(sys.path[4]+"\\python.exe")


MainTest()

















