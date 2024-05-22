##### convertit une date au format pour l'import altair "yyyy-MM-ddTHH:mm:ss.sssZ
def convertDate(date):
    import datetime
    import sys, traceback

    formatInput ='%d-%b-%y %H:%M:%S'        #'%d-%m-%Y %H:%M:%S' # a modifier selon le format de l'IAS
    formatOutput = '%Y-%m-%dT%H:%M:%S.000Z' #ne pas modifier, format pour altair
    try:
        datetime_str = datetime.datetime.strptime(date, formatInput)
        datetime_str = datetime_str.strftime(formatOutput)
        return datetime_str
    except:
        traitmentErrorNoBreak(sys.exc_info())
        return None


##read config file
def getConfig():
    import configparser
    try:
        settings = configparser.ConfigParser()
        settings.read_file(open('configCOM.cfg'))
    except:
       mn.traitmentError(sys.exc_info())
    return settings['param']
