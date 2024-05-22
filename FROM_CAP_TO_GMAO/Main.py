import xlrd
import os
from tkinter import *

import Altair_V2 as alt
import UtilsFunction as uti


forTest=True

######_________Créé la fenetre___________################
class FenetrePrinc(Tk):

    def __init__(self):
        super().__init__()
        v=Scrollbar(self, orient='vertical')
        v.pack(side=RIGHT, fill='y')
        self.t = Text(self, fg="black", padx=10,yscrollcommand=v.set)
        self.t .tag_config('warning', background="yellow", foreground="red")
        self.t .tag_config('good', foreground="green")
        self.t .tag_config('middle', background="yellow", foreground="orange")
        self.t.config(font=("broadway", 10),height='10')
        v.config(command=self.t.yview)
        button = Button(self, text="Lancer Import", command=self.importFile)
        self.t.pack()
        button.pack()
        self.title("Hello")

    def report(self,text,tag=None):
        self.t.config(state="normal")
        self.t.insert(END, text + '\n',tag)
        self.t.see("end")
        self.t.config(state="disabled")

    ######_________FUNCTION PRINCIPALE__Importe le fichier_________################
    def importFile(self):
        #lit le fichier
        path= os.getcwd() #le fichier doit etre au meme endroit que le main.py
        fichierexec=path+"\\Line.xls"  # et s'appeler Line.xls
        workbook = xlrd.open_workbook(fichierexec)
        SheetNameList=workbook.sheet_names()
        worksheet = workbook.sheet_by_name("WR")
        num_rows = worksheet.nrows
        num_cols = worksheet.ncols

        #login
        config=uti.getConfig()
        config['token']=alt.getAltairToken(config['base'],config['site'], config['userGMAO'], config['passwordGMAO'])
        # print le login
        if config['token']!= "None":
            self.report("connexion ok",'good')
        else:
            self.report("Probleme a la connexion voir la config et/ou le rapport d'erreur",'warning')
            return

        if not forTest:
            #boucle sur les lignes du fichier
            for i in range(1,num_rows):
                #createwr
                index=str(i)
                datacode=worksheet.cell_value(i, 0)
                description=worksheet.cell_value(i, 0)
                fkcodelocalisation=worksheet.cell_value(i, 0)
                fkcodeequipment=worksheet.cell_value(i, 0)
                commentaire=worksheet.cell_value(i, 0)
                priority=worksheet.cell_value(i, 0)
                type=worksheet.cell_value(i, 0)
                creationdate=worksheet.cell_value(i, 0)
                createdby=worksheet.cell_value(i, 0)
                fkcodemask=worksheet.cell_value(i, 0)
                datacode=alt.createWorkrequest(config['token'],description,fkcodelocalisation,fkcodeequipment,commentaire,priority,type,creationdate,createdby,fkcodemask)
                if datacode !="None":
                    #adddoc si besoin
                    if worksheet.cell_value(i, 0)!="" :
                        descriptionDoc=""
                        name=""
                        docdata=worksheet.cell_value(i, 0)
                        islink=""
                        fkcodedirectory=""
                        doc=alt.createDoc(config['token'],datacode,descriptionDoc,name,docdata,islink,fkcodemask,fkcodedirectory)

                        #pour ecrire dans la petite fenetre
                        if doc != "None":
                            self.report("Ligne n° "+ str(i)+ "du fichier importée (DI : ok, photo : ok) : N° "+str(datacode),'good')
                        else:
                            self.report("Ligne n° "+ str(i)+ "du fichier importée (DI : ok, photo : Non ok) : N° "+str(datacode),'middle')
                    else:
                        self.report("Ligne n° "+ str(i)+ "du fichier importée (DI : ok, photo : Pas de photo : N° "+str(datacode),'good')

                else:
                    self.report("Ligne n° "+ str(i)+ "du fichier non importée, verifié ligne",'warning')

        #log out
        alt.logOutAltair(config['base'],config['userGMAO'],config['token'])
        #print le logout
        self.report("log out",'good')
        print("c'est tout bon :) ")


# fenetre et affichage
window = FenetrePrinc()
window.mainloop()








