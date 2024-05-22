## traitment des erreurs (possibilité envoie de mail+stockage sur fichier
def traitmentError(info):
    from datetime import datetime
    import sys, traceback
    import os
    exc_type, exc_value, exc_tb = info
    a=traceback.format_exception(exc_type, exc_value, exc_tb)

    path= os.getcwd()+"\Erreur"
    completeName = os.path.join(path, datetime.today().strftime('%Y-%m-%d-%H-%M-%S')+".txt")
    f = open(completeName,"a")

    for obj in a:
        f.write(obj)
    f.close()
    print(a)
    exit()

## traitment des erreurs sans exit (possibilité envoie de mail+stockage sur fichier
def traitmentErrorNoBreak(info):
    from datetime import datetime
    import sys, traceback
    import os
    exc_type, exc_value, exc_tb = info
    a=traceback.format_exception(exc_type, exc_value, exc_tb)

    path= os.getcwd()+"\Erreur"
    completeName = os.path.join(path, datetime.today().strftime('%Y-%m-%d-%H-%M-%S')+".txt")
    f = open(completeName,"a")
    for obj in a:
        f.write(obj)
    f.close()
    print(a)