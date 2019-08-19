Now you know what BMEG is and what it does, you can start using BMEG. Follow the step-by-step tutorial below.

# How to Use BMEG

  
  

This six-step tutorial is created to introduce a BMEG user to BMEG. Because this tutorial is designed to get you started from the basics, no prior knowledge is necessary. As you go through the tutorial, remember that doing analysis is the ultimate goal, so everything we will do before then is to set things up for that last step. This tutorial will focus on three main areas: setting up the right tools to use BMEG, accessing BMEG, and doing analysis. Each step of this tutorial has text information, and a block of code to aid your learning.

  

You can use a text editor or a Jupyter notebook to run the code listed down below for each of the steps

# 1. Grip Set up and Authentication

This step has two parts that are a one time setup:

### 1.1  Getting set up with Grip
    

GRIP (GRaph Integration Platform) provides a graph interface on top of a variety of existing database technologies. You can find out more about GRIP right [here](https://bmeg.github.io/grip/).

  

Gripql is a python library for GRIP. Go ahead and install it using this [link](https://pypi.org/project/gripql/).

  

### 1.2 Authentication
    

Your next step is connecting your Google account to our website. We use this step to be able to authenticate that you are a BMEG user. Press the link to go to our [authentication page](https://bmeg.io/analyze/getting_started/) and click on “Authenticate with Google” which will redirect you to Google to verify identity. Then you will be granted interactive and API access.

  

Or if you would rather do the set up and authentication from your  terminal, you can use the bash code down below. This code achieves two main goals. The ``pip install gripql`` part installs the gripql library for python and the other two lines of code below it are made to help you authenticate using your email. You can copy and paste the code into a text editor and run it on a terminal.

  

``` bash
#!/bin/bash

##############################
# Purpose: ONE time set up to use GRIP to query bmeg
##############################

pip install gripql

#make query using curl
curl -H "OauthEmail: <email>" -H "OauthAccessToken: <token>=" -H "OauthExpires: <length>" https://bmeg.io/api/v1/graph

# create credential file
echo '{"OauthEmail":"<email>","OauthAccessToken":"<token>=","OauthExpires":<length>} ' > /tmp/bmeg_credentials.json
```

> The following blocks of code are written in python. Therefore, it would be beneficial to have python installed on your device. Instructions on installing python can be found [here](https://realpython.com/installing-python/#step-2-run-the-installer).
>
>To install the libraries used in this tutorial, you will most likely use ``pip`` so it would be useful to install ``pip`` as well. Instructions on installing ``pip`` are [here](https://pip.pypa.io/en/stable/installing/) and [here](https://programminghistorian.org/en/lessons/installing-python-modules-pip). If you have a python version 2.7.9 or newer, ``pip`` comes included.

# 2. Situate Libraries and Connect to server

Each of the libraries listed below have different functionalities that ultimately help us in our analysis. To be able to import the libraries in our code, we first need to install them (if we don’t already have them). Follow the links below to install the libraries on your computer. The links will take you to a page with instructions on how to install each library for different systems.
    
- [Instructions](https://pypi.org/project/pandas/) on installing pandas - Open source python library that helps us perform fast data cleaning, preparation, and analysis
    
-  [Instructions](https://www.scipy.org/install.html) on installing numpy - a multidimensional container for scientific computing that allows us to do calculations on different collections of values. This [video](https://youtu.be/YWn8Wj69Dm4) is also a good resource.
    
- json - (JavaScript Object Notation) is a data interchange language. This package usually comes with python. Check if you already have it installed

- os - In python, this module provides functions for interacting with the operating system. This also comes along with python and you don’t need to do any installation.

>To know whether or not you have all the libraries installed, you can follow three quick steps: open python, type ```import (the library name)```, and wait for an error message.
>→ I opened Python in my shell
>
>![](https://lh4.googleusercontent.com/DnGngSYykHn3xjaEe_mJsNJKTbS2zkyDYvtlbpqbD68jRokn-zYzeqSTuXcb2kYCKaHA70HqTX71bpQ2bKs3TcaMcjsKNZffSOAVvXD5szkkEqHQmwCSIp0c6EJO2HOWcjaXke8y) > 
>→ Typed in ``import (module name)``
>If your terminal doesn’t bring out an error message, it means that you have that library. In the picture below, you can see that when I enter ```import json```, I don’t get any error message, meaning that I have json installed.
>
>![](https://lh6.googleusercontent.com/zOPnnG1s9BfEWAObhwwQrhVkBaXm1ULliwF25YnEC6zlMgeiidjTZeX-MVOoXKTYIiPq05NRNBr8epqUxxhJUilZwgmbj-5bBtod9VGaPykcY6yOg4okcfBJ0MWMpRDcUjXVEM5U)
>→ However in this picture, you can see that when I type import and the library name, I get an error message that tells me that I don’t have a module named pandas. In this case, I would have to install pandas to continue onto the next step.
>
>![](https://lh6.googleusercontent.com/n0R0Lub4K2avK8z0ROvCQbz66g5kB63tzgNLnz5BeyKmEY8sxT9Fi9YQEKqv46HzbFkwWA0AeAKDLQnbzKN8BpFpVBbEApn0MG2-JSdZNS4KkxUPdCzl5wkcZi17fn7Y1GljqtiH)

After we have all the libraries installed, we’re going to import the python libraries we need using this code.

Import python libraries
``` python
import gripql
import json
import pandas
import numpy as np
import itertools
import os
```
  

This code here will connect you to the BMEG server and create a graph handle. As you might have already known, the BEMG server is where all the data live. To grab any type of data, we must establish a connection with the server. You just have to copy and paste this code into your text editor or Jupyter notebook and run it. The first line in this code block sets up a connection with the BMEG server using the gripql language, and the second line creates a graph handle based on a specific graph schema. In other words, while the first line sets up a connection with bmeg, the second line chooses a specific schema type.

  

If you are an internal user (someone within OHSU), use this code:
``` python
# Set up connection to server and create graph handle
conn = gripql.Connection("http://grip.compbio.ohsu.edu")
O = conn.graph("bwalsh-test") #specific schema version
```
If you are an external user, use this code:
```python 
conn = gripql.Connection("https://bmeg.io/api", credential_file = '/tmp/bmeg_credentials.json')
O = conn.graph("bmeg_rc2") #specific schema version
```
# 3. Query data from a particular data source

Traverse graph to grab all data from one data source (e.g. CCLE).

Here, you’ll be grabbing all the data from one data source (e.g. CCLE) found within BMEG. In the first line of this code block, we are creating what is essentially an empty list and naming it p1. Then within the for loop, we are searching for a vertex with the label “project”. In our if statement, we ask if the data project identification starts with CCLE and if it does, we bring out that data source under the name p1.

``` python
p1 = []
for row in O.query().V().hasLabel("Project"): #start query at vertex and look for labels starting with Project
    if row.data.project_id.startswith("CCLE"):
        p1.append(row.gid)
```

# 4. Filter data for only what you want

Accessing a whole data source will likely mean that you will have a lot of information you don’t need. For this reason, we need to filter our data to only get precise information on the things we want to know about. This code is made to filter data by only keeping data points of interest. ~~In the first bit of this code, we are making a query for specific data we want. In the second bit, we are outputting the data we have gathered and selecting what each column represents.~~ 

For example, in this code, I am interested in looking at the drug response that a given drug has on a cell line. Therefore I’m interested in 1) drug name 2) which cell line the drug was tested on and 3) what the drug response was (EC50).

~~how are we going to create the variation we need~~



``` python
########## Create dataframe where rows are cell line IDs, columns are drugs, and entires are the EC50 drug response value ##### ##########

# BMEG nodes that will be traversing through: Project > **Case** > Sample > Aliquot > **DrugResponse** > **Compound**  

q1 = O.query().V(p1).out("cases").as_("PROJ").out("samples").out("aliquots").out("drug_response").as_("RESP").out("compounds").as_("COMP")
#Render query output (select what each col represents)
#grab cell line  (DepMap ID for cell line, drug, ec50)
q1 = q1.render(["$PROJ._data.case_id", "$COMP._gid", "$RESP._data.ec50"])
```


# 5. Save data locally

We need to save our data file so we can access it whenever we want. But before that, we need to re-format our data so that it can be saved easily.

Now let’s format the data so that we can save it as a .tsv file. To do this we will populate the data in a dictionary then create a dataframe from that dictionary. And finally save this dataframe as a .tsv file.

``` python
data = {}
for row in q1:
    #if cell line not in data
    if row[0] not in data:
        data[row[0]] = { row[1] :  row[2] } #add to data: key =cellLine, value = new_dict where value=drug/act_area/ec50
    #if cell line already added to data
    else:
        #essentially, set up so adds new drug col for the given CellLine
        data[row[0]][row[1]] = row[2] #add to data: key = index CellLine/Drug, value = EC50

drugDF = pandas.DataFrame(data).transpose()
drugDF = drugDF.sort_index().sort_index(axis=1) #sort rows by cell line name, sort cols by drug name 
```

Let’s take a quick break and view what our data looks like in the data frame:


``` python
drugDF
```
Now save it as a .tsv file. In the “where-to-save” place, you need to add a directory on where the file will be saved. You can also provide a better name for your file by replacing "name-of-drug-tsv" with a name you want.
``` python
# Save
output_path = "where-to-save-file"
ofn_drug = "name-of-drug-tsv"

os.chdir(output_path) # set wd
drugDF.to_csv(ofn_drug, sep="\t")
```


  

# 6. Do analysis

Congratulations on making it to the last step of this tutorial! Now you are ready to do your own personalized analysis!

You can check out some analysis examples right [here](https://bmeg.io/analyze/examples/).

If you have any questions or need more support, contact us using [Gitter](https://gitter.im/bmeg/). We will get back to you as soon as possible.
