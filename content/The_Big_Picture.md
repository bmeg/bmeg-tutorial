# [**BMEG**](https://bmeg.io/)
Genomic data, meaning data relating to DNA, is used for
* detecting,
* diagnosing, and
* treating diseases.

In the field of cancer research, there are various projects (thousands of them) out there that have individually tested drug responses and recorded their data.
	
~~To perform better analyses~~ of various drugs, compiling data from different sources is crucial. This can be useful in doing downstream analysis. However, different data sources are scattered. That's where BMEG comes in. 

##  BMEG: The Big Solution
###  Bio Medical Evidence Graph
Simply put, BMEG is a set up to run analyses of data that are compiled from various sources into one server. It is a tool that helps us get a comprehensive version of recorded data. Its main purpose is to create one "space" where many sources of data exist so the user can compile multiple sources (eg. into a single spreadsheet). Data sources may have overlaps, which can reinforce existing knowledge. And in cases where there are no overlaps, different data sources can complement each other. 

A growing number of data sources have been loaded onto BMEG. And BMEG will continue to expand its database by incorporating additional data from new sources.



### Code Example (A brief explanation of how analysis is done) using BMEG
1.  Data is accessed from the BMEG server
2. Data is grabbed (pulled)
3. Data is filtered so only wanted data can use used
4. Data is saved to Excel on a computer

### Code Rundown
1. Import libraries
2. Connect to BMEG
3. Filter data
4. Save data 

 O.query is where we get data  
>**For Example:**
>
>* I can access  all the data from the CCLE source
>
>* To filter the data, I'll only keep info about drug name,
what it was tested on (cell line data), and what effect it had
>
>*  When I am ready to save files, I do formatting. Files can be saved in these two formats:
**.tsv** = Tab Separated Values (a preferred format because of its compatibility with excel) or
**.csv** = Comma Separated Values
