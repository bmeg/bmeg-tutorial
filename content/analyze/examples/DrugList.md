---
title: Get compound Information
draft: True
authors:
- kellrott
tags:
- ccle
- drug response
created_at: 2018-05-09
updated_at: 2018-05-09
tldr: Look up an allele
---

```python
import gripql
conn = gripql.Connection("https://bmeg.io/api", credential_file="/tmp/bmeg_credentials.json")
O = conn.graph("bmeg_rc1_2")
```


```python
print( list(O.query().V().hasLabel("Sample").limit(5) ))
```

    [INFO]	2019-02-21 09:57:47,900	5 results received in 0 seconds


    [<AttrDict({'gid': 'Sample:ACH-000017', 'label': 'Sample', 'data': {'ccle_attributes': {'Aliases': 'SK-BR-3', 'CCLE_Name': 'SKBR3_BREAST', 'COSMIC_ID': '', 'DepMap_ID': 'ACH-000017', 'Gender': 'Female', 'Primary Disease': 'Breast Cancer', 'Sanger ID': '', 'Source': 'NIBRI', 'Subtype Disease': 'Carcinoma'}, 'sample_id': 'ACH-000017'}})>, <AttrDict({'gid': 'Sample:ACH-000031', 'label': 'Sample', 'data': {'ccle_attributes': {'Aliases': 'Panc 02.13', 'CCLE_Name': 'PANC0213_PANCREAS', 'COSMIC_ID': '', 'DepMap_ID': 'ACH-000031', 'Gender': 'Female', 'Primary Disease': 'Pancreatic Cancer', 'Sanger ID': '', 'Source': 'NIBRI', 'Subtype Disease': 'Ductal Adenocarcinoma, exocrine'}, 'sample_id': 'ACH-000031'}})>, <AttrDict({'gid': 'Sample:ACH-000012', 'label': 'Sample', 'data': {'ccle_attributes': {'Aliases': 'HCC827', 'CCLE_Name': 'HCC827_LUNG', 'COSMIC_ID': '1240146', 'DepMap_ID': 'ACH-000012', 'Gender': 'Female', 'Primary Disease': 'Lung Cancer', 'Sanger ID': '354', 'Source': 'ATCC', 'Subtype Disease': 'Non-Small Cell Lung Cancer (NSCLC), Adenocarcinoma'}, 'sample_id': 'ACH-000012'}})>, <AttrDict({'gid': 'Sample:ACH-000057', 'label': 'Sample', 'data': {'ccle_attributes': {'Aliases': 'OPM-1', 'CCLE_Name': 'OPM1_HAEMATOPOIETIC_AND_LYMPHOID_TISSUE', 'COSMIC_ID': '', 'DepMap_ID': 'ACH-000057', 'Gender': '-1', 'Primary Disease': 'Myeloma', 'Sanger ID': '', 'Source': '', 'Subtype Disease': 'Multiple Myeloma'}, 'sample_id': 'ACH-000057'}})>, <AttrDict({'gid': 'Sample:ACH-000064', 'label': 'Sample', 'data': {'ccle_attributes': {'Aliases': 'SALE', 'CCLE_Name': 'SALE_LUNG', 'COSMIC_ID': '', 'DepMap_ID': 'ACH-000064', 'Gender': '', 'Primary Disease': 'Lung Cancer', 'Sanger ID': '', 'Source': '', 'Subtype Disease': 'Immortalized'}, 'sample_id': 'ACH-000064'}})>]



```python
aliquots = list(O.query().V("Program:CCLE").in_("InProgram").in_("InProject").in_("SampleFor").in_("AliquotFor").render("$._gid"))
```

    [INFO]	2019-02-21 15:44:00,535	504 results received in 0 seconds



```python
q = O.query().V().where(aql.eq("_label", "Biosample")).where(aql.eq("datasetId", "ccle")).mark("s")\
.in_("responseFor").mark("r").out("responseTo").mark("d")\
.render(["$s._gid", "$r.summary", "$d._gid"]).limit(10)
for row in q:
    print row
```

    [u'biosample:ccle:SNU119_OVARY', [{u'type': u'EC50', u'value': 3.588, u'unit': u'uM'}, {u'type': u'AUC', u'value': 11.272, u'unit': u'uM'}], u'compound:CID11964036']
    [u'biosample:ccle:LK2_LUNG', [{u'type': u'EC50', u'value': 21.86, u'unit': u'uM'}, {u'type': u'AUC', u'value': 14.396, u'unit': u'uM'}], u'compound:UNKNOWN:MK-2206']
    [u'biosample:ccle:SNU119_OVARY', [{u'type': u'EC50', u'value': 20.23, u'unit': u'uM'}, {u'type': u'AUC', u'value': 13.349, u'unit': u'uM'}], u'compound:UNKNOWN:BRD-K45681478']
    [u'biosample:ccle:LK2_LUNG', [{u'type': u'EC50', u'value': 0.03199, u'unit': u'uM'}, {u'type': u'AUC', u'value': 6.2432, u'unit': u'uM'}], u'compound:CID25262965']
    [u'biosample:ccle:CALU6_LUNG', [{u'type': u'EC50', u'value': 1.9169999999999998, u'unit': u'uM'}, {u'type': u'AUC', u'value': 13.953, u'unit': u'uM'}], u'compound:CID24785538']
    [u'biosample:ccle:LK2_LUNG', [{u'type': u'EC50', u'value': 4.033, u'unit': u'uM'}, {u'type': u'AUC', u'value': 11.066, u'unit': u'uM'}], u'compound:UNKNOWN:NVP-231']
    [u'biosample:ccle:CALU6_LUNG', [{u'type': u'EC50', u'value': 3.673, u'unit': u'uM'}, {u'type': u'AUC', u'value': 13.624, u'unit': u'uM'}], u'compound:UNKNOWN:CIL55']
    [u'biosample:ccle:LK2_LUNG', [{u'type': u'EC50', u'value': 0.4445, u'unit': u'uM'}, {u'type': u'AUC', u'value': 7.582, u'unit': u'uM'}], u'compound:CID31703']
    [u'biosample:ccle:SNU119_OVARY', [{u'type': u'EC50', u'value': 0.6727, u'unit': u'uM'}, {u'type': u'AUC', u'value': 9.9915, u'unit': u'uM'}], u'compound:CID11647372']
    [u'biosample:ccle:LK2_LUNG', [{u'type': u'EC50', u'value': 0.01525, u'unit': u'uM'}, {u'type': u'AUC', u'value': 7.2597, u'unit': u'uM'}], u'compound:CID126941']



```python
q = O.query().V().where(aql.eq("_label", "Biosample")).where(aql.eq("datasetId", "ccle")).mark("s")\
.in_("responseFor").mark("r").outEdge("responseTo").distinct("_to").render(["_to"])
for row in q:
    print row
```

    [u'compound:CID11964036']
    [u'compound:UNKNOWN:MK-2206']
    [u'compound:CID9886808']
    [u'compound:UNKNOWN:BRD-K45681478']
    [u'compound:CID25262965']
    [u'compound:CID24785538']
    [u'compound:UNKNOWN:NVP-231']
    [u'compound:UNKNOWN:CIL55']
    [u'compound:CID31703']
    [u'compound:CID11647372']
    [u'compound:CID126941']
    [u'compound:CID11717001']
    [u'compound:UNKNOWN:BRD-K19103580']
    [u'compound:CID46199207']
    [u'compound:UNKNOWN:Platin']
    [u'compound:UNKNOWN:ELCPK']
    [u'compound:CID46843906']
    [u'compound:UNKNOWN:BRD-K33199242']
    [u'compound:UNKNOWN:ML029']
    [u'compound:UNKNOWN:GSK-3 inhibitor IX']
    [u'compound:UNKNOWN:serdemetan']
    [u'compound:UNKNOWN:SCH-529074']
    [u'compound:CID17755052']
    [u'compound:UNKNOWN:NSC48300']
    [u'compound:CID2126']
    [u'compound:CID676352']
    [u'compound:UNKNOWN:TW-37']
    [u'compound:CID46907787']
    [u'compound:UNKNOWN:BRD-K84807411']
    [u'compound:UNKNOWN:BRD8899']
    [u'compound:CID9907093']
    [u'compound:CID24856436']
    [u'compound:UNKNOWN:oligomycin A']
    [u'compound:CID3825829']
    [u'compound:UNKNOWN:SZ4TA2']
    [u'compound:UNKNOWN:CAY10618']
    [u'compound:CID11317348']
    [u'compound:UNKNOWN:bleomycin A2']
    [u'compound:CID4915']
    [u'compound:UNKNOWN:YL54']
    [u'compound:UNKNOWN:PF-184']
    [u'compound:CID441298']
    [u'compound:UNKNOWN:BRD-K35604418']
    [u'compound:UNKNOWN:BRD-K97651142']
    [u'compound:CID36462']
    [u'compound:CID24779724']
    [u'compound:UNKNOWN:WP1130']
    [u'compound:UNKNOWN:CBB-1007']
    [u'compound:CID10410894']
    [u'compound:CID46224516']
    [u'compound:UNKNOWN:ML006']
    [u'compound:UNKNOWN:BRD-K02492147']
    [u'compound:UNKNOWN:PDMP']
    [u'compound:UNKNOWN:oxaliplatin']
    [u'compound:UNKNOWN:NPC-26']
    [u'compound:UNKNOWN:BRD1835']
    [u'compound:CID52912189']
    [u'compound:UNKNOWN:BRD-K27224038']
    [u'compound:UNKNOWN:MI-1']
    [u'compound:UNKNOWN:ML050']
    [u'compound:CID24180719']
    [u'compound:UNKNOWN:BRD-K51490254']
    [u'compound:CID262093']
    [u'compound:UNKNOWN:fumonisin B1']
    [u'compound:UNKNOWN:BRD-K96431673']
    [u'compound:CID5978']
    [u'compound:UNKNOWN:SB-743921']
    [u'compound:CID9813758']
    [u'compound:UNKNOWN:BRD-K99584050']
    [u'compound:CID9549297']
    [u'compound:UNKNOWN:JW-480']
    [u'compound:CID11228183']
    [u'compound:CID2733526']
    [u'compound:UNKNOWN:16-beta-bromoandrosterone']
    [u'compound:UNKNOWN:BRD-K70511574']
    [u'compound:UNKNOWN:manumycin A']
    [u'compound:UNKNOWN:BRD-A02303741']
    [u'compound:CID10026128']
    [u'compound:CID11625818']
    [u'compound:UNKNOWN:BRD-K94991378']
    [u'compound:CID2907']
    [u'compound:CID9866186']
    [u'compound:UNKNOWN:1S,3R-RSL-3']
    [u'compound:UNKNOWN:lovastatin']
    [u'compound:UNKNOWN:BRD-K13999467']
    [u'compound:CID44137675']
    [u'compound:CID135411']
    [u'compound:CID1714884']
    [u'compound:UNKNOWN:CR-1-31B']
    [u'compound:UNKNOWN:pandacostat']
    [u'compound:UNKNOWN:brefeldin A']
    [u'compound:UNKNOWN:CID-5951923']
    [u'compound:CID38904']
    [u'compound:UNKNOWN:CD-1530']
    [u'compound:UNKNOWN:linsitinib']
    [u'compound:UNKNOWN:ML334 diastereomer']
    [u'compound:UNKNOWN:ML031']
    [u'compound:CID613000']
    [u'compound:UNKNOWN:NSC30930']
    [u'compound:UNKNOWN:zebularine']
    [u'compound:UNKNOWN:methylstat']
    [u'compound:CID11427553']
    [u'compound:UNKNOWN:BRD-K42260513']
    [u'compound:CID5743']
    [u'compound:UNKNOWN:ML320']
    [u'compound:UNKNOWN:BRD-K24690302']
    [u'compound:CID4917']
    [u'compound:CID445643']
    [u'compound:UNKNOWN:BRD-K92856060']
    [u'compound:CID25150857']
    [u'compound:UNKNOWN:BRD-K28456706']
    [u'compound:UNKNOWN:ML162']
    [u'compound:UNKNOWN:VU0155056']
    [u'compound:UNKNOWN:austocystin D']
    [u'compound:UNKNOWN:BRD-K61166597']
    [u'compound:CID56949517']
    [u'compound:CID122327']
    [u'compound:UNKNOWN:PRL-3 inhibitor I']
    [u'compound:CID374536']
    [u'compound:CID675434']
    [u'compound:CID44224160']
    [u'compound:UNKNOWN:BRD-K04800985']
    [u'compound:UNKNOWN:pluripotin']
    [u'compound:UNKNOWN:nutlin-3']
    [u'compound:UNKNOWN:BRD-K17060750']
    [u'compound:UNKNOWN:BRD-K79669418']
    [u'compound:UNKNOWN:CIL41']
    [u'compound:UNKNOWN:cucurbitacin I']
    [u'compound:CID9884685']
    [u'compound:CID15983966']
    [u'compound:CID444795']
    [u'compound:CID11152667']
    [u'compound:UNKNOWN:PL-DI']
    [u'compound:UNKNOWN:KPT185']
    [u'compound:UNKNOWN:BRD-K58730230']
    [u'compound:CID56973724']
    [u'compound:UNKNOWN:SID 26681509']
    [u'compound:CID11213558']
    [u'compound:UNKNOWN:AT7867']
    [u'compound:CID50905018']
    [u'compound:CID66577038']
    [u'compound:CID219104']
    [u'compound:UNKNOWN:BRD6340']
    [u'compound:UNKNOWN:Merck60']
    [u'compound:CID421610']
    [u'compound:CID11178236']
    [u'compound:CID25195348']
    [u'compound:CID439501']
    [u'compound:UNKNOWN:BRD-K03536150']
    [u'compound:CID60750']
    [u'compound:CID44607530']
    [u'compound:CID5566']
    [u'compound:CID148124']
    [u'compound:UNKNOWN:BRD-K55116708']
    [u'compound:CID2708']
    [u'compound:CID42611257']
    [u'compound:CID7251185']
    [u'compound:UNKNOWN:neopeltolide']
    [u'compound:UNKNOWN:BRD-K66532283']
    [u'compound:UNKNOWN:BRD8958']
    [u'compound:UNKNOWN:Repligen 136']
    [u'compound:CID24772860']
    [u'compound:UNKNOWN:BRD-K09587429']
    [u'compound:UNKNOWN:B02']
    [u'compound:UNKNOWN:YK 4-279']
    [u'compound:UNKNOWN:BRD-K11533227']
    [u'compound:CID10427712']
    [u'compound:CID10322450']
    [u'compound:UNKNOWN:BRD4132']
    [u'compound:UNKNOWN:BRD-K55473186']
    [u'compound:UNKNOWN:SRT-1720']
    [u'compound:UNKNOWN:CIL55A']
    [u'compound:UNKNOWN:SR-II-138A']
    [u'compound:UNKNOWN:PYR-41']
    [u'compound:CID54454']
    [u'compound:CID9868037']
    [u'compound:UNKNOWN:PD318088']
    [u'compound:CID2756']
    [u'compound:UNKNOWN:BRD-K85133207']
    [u'compound:CID227681']
    [u'compound:UNKNOWN:BRD-K20514654']
    [u'compound:CID25183872']
    [u'compound:UNKNOWN:BRD-K63431240']
    [u'compound:UNKNOWN:SMER-3']
    [u'compound:CID4259181']
    [u'compound:CID702558']
    [u'compound:UNKNOWN:ML083']
    [u'compound:UNKNOWN:BRD-K16147474']
    [u'compound:UNKNOWN:BRD9647']
    [u'compound:UNKNOWN:elocalcitol']
    [u'compound:UNKNOWN:NSC632839']
    [u'compound:UNKNOWN:A-804598']
    [u'compound:UNKNOWN:BMS-270394']
    [u'compound:UNKNOWN:NVP-BSK805']
    [u'compound:UNKNOWN:BRD-K88742110']
    [u'compound:CID51039095']
    [u'compound:UNKNOWN:BRD-K26531177']
    [u'compound:UNKNOWN:BRD-K41597374']
    [u'compound:UNKNOWN:CIL70']
    [u'compound:CID3854666']
    [u'compound:UNKNOWN:BRD-K80183349']
    [u'compound:CID11364421']
    [u'compound:UNKNOWN:avicin D']
    [u'compound:CID5702613']
    [u'compound:UNKNOWN:Compound 1541A']
    [u'compound:UNKNOWN:BRD-K30019337']
    [u'compound:UNKNOWN:BRD-K48334597']
    [u'compound:UNKNOWN:QW-BI-011']
    [u'compound:UNKNOWN:BMS-536924']
    [u'compound:UNKNOWN:ML203']
    [u'compound:UNKNOWN:IPR-456']
    [u'compound:CID6918328']
    [u'compound:UNKNOWN:tigecycline']
    [u'compound:CID5281672']
    [u'compound:CID176870']
    [u'compound:UNKNOWN:BRD-K02251932']
    [u'compound:CID9825149']
    [u'compound:CID16741245']
    [u'compound:CID445091']
    [u'compound:UNKNOWN:PRIMA-1-Met']
    [u'compound:CID9826308']
    [u'compound:CID2949965']
    [u'compound:UNKNOWN:ML239']
    [u'compound:UNKNOWN:BRD-K03911514']
    [u'compound:CID11955716']
    [u'compound:CID2130404']
    [u'compound:CID3025986']
    [u'compound:UNKNOWN:spautin-1']
    [u'compound:UNKNOWN:compound 1B']
    [u'compound:UNKNOWN:BRD-K71935468']
    [u'compound:UNKNOWN:ML258']
    [u'compound:CID104842']
    [u'compound:CID9927531']
    [u'compound:CID5278396']
    [u'compound:UNKNOWN:STF-31']
    [u'compound:UNKNOWN:ciclosporin']
    [u'compound:CID452548']
    [u'compound:UNKNOWN:BRD-K75293299']
    [u'compound:CID11626927']
    [u'compound:UNKNOWN:FQI-2']
    [u'compound:CID6852167']
    [u'compound:UNKNOWN:erastin']
    [u'compound:CID11977753']
    [u'compound:CID3385']
    [u'compound:CID5394']
    [u'compound:UNKNOWN:BRD-K29313308']
    [u'compound:CID4477']
    [u'compound:CID6184667']
    [u'compound:CID148198']
    [u'compound:CID11476171']
    [u'compound:UNKNOWN:curcumin']
    [u'compound:CID9903786']
    [u'compound:CID6753378']
    [u'compound:CID9956119']
    [u'compound:UNKNOWN:VAF-347']
    [u'compound:CID409805']
    [u'compound:UNKNOWN:Bax channel blocker']
    [u'compound:UNKNOWN:BRD-A71883111']
    [u'compound:CID9803433']
    [u'compound:UNKNOWN:MST-312']
    [u'compound:UNKNOWN:BRD-K90370028']
    [u'compound:CID6918837']
    [u'compound:CID11507802']
    [u'compound:CID46191454']
    [u'compound:CID5353562']
    [u'compound:CID64971']
    [u'compound:CID208908']
    [u'compound:CID23635314']
    [u'compound:UNKNOWN:KHS101']
    [u'compound:CID5113032']
    [u'compound:UNKNOWN:WZ8040']
    [u'compound:CID462382']
    [u'compound:UNKNOWN:BEC']
    [u'compound:UNKNOWN:BRD-K14844214']
    [u'compound:UNKNOWN:BRD-K50799972']
    [u'compound:UNKNOWN:CAY10594']
    [u'compound:UNKNOWN:HBX-41108']
    [u'compound:CID11612883']
    [u'compound:CID15953870']
    [u'compound:UNKNOWN:ceranib-2']
    [u'compound:CID9908783']
    [u'compound:UNKNOWN:BRD-K29086754']
    [u'compound:CID9911463']
    [u'compound:CID24901704']
    [u'compound:UNKNOWN:BRD-K37390332']
    [u'compound:UNKNOWN:BRD-K27188169']
    [u'compound:UNKNOWN:FSC231']
    [u'compound:UNKNOWN:BRD-K51831558']
    [u'compound:UNKNOWN:GSK1059615']
    [u'compound:UNKNOWN:FQI-1']
    [u'compound:CID25154868']
    [u'compound:UNKNOWN:tosedostat']
    [u'compound:UNKNOWN:BRD-K86535717']
    [u'compound:UNKNOWN:avrainvillamide']
    [u'compound:UNKNOWN:CCT036477']
    [u'compound:CID46943432']
    [u'compound:CID10461815']
    [u'compound:CID46901937']
    [u'compound:CID44237094']
    [u'compound:UNKNOWN:fluvastatin']
    [u'compound:UNKNOWN:BRD-K71781559']
    [u'compound:UNKNOWN:LY-2157299']
    [u'compound:CID5479543']
    [u'compound:UNKNOWN:BRD-K78574327']
    [u'compound:CID5426']
    [u'compound:CID56649450']
    [u'compound:UNKNOWN:cytochalasin B']
    [u'compound:UNKNOWN:R428']
    [u'compound:UNKNOWN:triptolide']
    [u'compound:CID5282054']
    [u'compound:CID216239']
    [u'compound:CID3793']
    [u'compound:UNKNOWN:BRD-K34485477']
    [u'compound:UNKNOWN:necrostatin-7']
    [u'compound:UNKNOWN:JW-74']
    [u'compound:CID6505803']
    [u'compound:CID16659841']
    [u'compound:UNKNOWN:bosutinib']
    [u'compound:CID9967941']
    [u'compound:CID156422']
    [u'compound:CID435678']
    [u'compound:UNKNOWN:BRD-K34222889']
    [u'compound:CID16038120']
    [u'compound:CID60700']
    [u'compound:CID49867930']
    [u'compound:UNKNOWN:BRD-A94377914']
    [u'compound:UNKNOWN:nakiterpiosin']
    [u'compound:UNKNOWN:QS-11']
    [u'compound:UNKNOWN:BRD-K64610608']
    [u'compound:UNKNOWN:BRD-K52037352']
    [u'compound:UNKNOWN:BRD-K07442505']
    [u'compound:CID11656518']
    [u'compound:UNKNOWN:ML312']
    [u'compound:CID11626560']
    [u'compound:UNKNOWN:SJ-172550']
    [u'compound:CID3503']
    [u'compound:UNKNOWN:palmostatin B']
    [u'compound:CID375860']
    [u'compound:UNKNOWN:Compound 23 citrate']
    [u'compound:UNKNOWN:triazolothiadiazine']
    [u'compound:CID25227462']
    [u'compound:CID5212']
    [u'compound:UNKNOWN:LBW242']
    [u'compound:UNKNOWN:968']
    [u'compound:CID2742550']
    [u'compound:UNKNOWN:COL-3']
    [u'compound:CID4788']
    [u'compound:CID44241473']
    [u'compound:CID4521392']
    [u'compound:UNKNOWN:cyanoquinoline 11']
    [u'compound:CID9826528']
    [u'compound:UNKNOWN:BRD-K27986637']
    [u'compound:UNKNOWN:ML210']
    [u'compound:UNKNOWN:tipifarnib-P1']
    [u'compound:UNKNOWN:necrosulfonamide']
    [u'compound:UNKNOWN:BRD-K13185470']
    [u'compound:CID49867926']
    [u'compound:CID36314']
    [u'compound:CID44259']
    [u'compound:UNKNOWN:BRD-K41334119']
    [u'compound:CID132496']
    [u'compound:UNKNOWN:BRD-K48477130']
    [u'compound:UNKNOWN:ETP-46464']
    [u'compound:UNKNOWN:BRD-A05715709']
    [u'compound:UNKNOWN:CIL56']
    [u'compound:UNKNOWN:BRD-K66453893']
    [u'compound:CID10127622']
    [u'compound:CID10302451']
    [u'compound:CID3690']
    [u'compound:UNKNOWN:pitstop2']
    [u'compound:CID25022340']
    [u'compound:CID638278']
    [u'compound:CID3081361']
    [u'compound:UNKNOWN:BRD-K96970199']
    [u'compound:UNKNOWN:temsirolimus']
    [u'compound:UNKNOWN:ML311']
    [u'compound:UNKNOWN:BRD-M00053801']
    [u'compound:UNKNOWN:marinopyrrole A']
    [u'compound:UNKNOWN:MLN2480']
    [u'compound:UNKNOWN:BRD-K99006945']
    [u'compound:UNKNOWN:Nutlin-3']
    [u'compound:UNKNOWN:BRD-K34099515']
    [u'compound:UNKNOWN:MI-2']
    [u'compound:UNKNOWN:BRD-K16130065']
    [u'compound:UNKNOWN:BRD-K44224150']
    [u'compound:UNKNOWN:BRD-K09344309']
    [u'compound:UNKNOWN:BRD-A86708339']
    [u'compound:UNKNOWN:BRD-K49290616']
    [u'compound:UNKNOWN:BCL-LZH-4']
    [u'compound:UNKNOWN:JW-55']
    [u'compound:CID5330286']
    [u'compound:CID60838']
    [u'compound:CID644241']
    [u'compound:CID49846579']
    [u'compound:UNKNOWN:myriocin']
    [u'compound:UNKNOWN:SR8278']
    [u'compound:UNKNOWN:BRD-K33514849']
    [u'compound:UNKNOWN:BRD-K01737880']
    [u'compound:CID71729975']
    [u'compound:UNKNOWN:BRD-K30748066']
    [u'compound:CID6436223']
    [u'compound:CID5494449']



```python
q = O.query().V().where(aql.eq("_label", "ResponseCurve")).outEdge("responseTo").distinct("_to").render(["_to"])
for row in q:
    print row
```

    [u'compound:CID11476171']
    [u'compound:CID644241']
    [u'compound:CID6505803']
    [u'compound:CID10461815']
    [u'compound:CID208908']
    [u'compound:UNKNOWN:Nutlin-3']
    [u'compound:CID10302451']
    [u'compound:CID11626560']
    [u'compound:CID5479543']
    [u'compound:CID6918837']
    [u'compound:CID3081361']
    [u'compound:CID216239']
    [u'compound:CID60838']
    [u'compound:CID60700']
    [u'compound:UNKNOWN:LBW242']
    [u'compound:CID9826528']
    [u'compound:CID5330286']
    [u'compound:CID10127622']
    [u'compound:CID36314']
    [u'compound:CID24180719']
    [u'compound:CID11656518']
    [u'compound:CID16038120']
    [u'compound:CID9886808']
    [u'compound:CID4915']
    [u'compound:CID56973724']
    [u'compound:CID176870']
    [u'compound:CID262093']
    [u'compound:UNKNOWN:fumonisin B1']
    [u'compound:CID25262965']
    [u'compound:CID613000']
    [u'compound:UNKNOWN:ML239']
    [u'compound:UNKNOWN:BRD-K66532283']
    [u'compound:UNKNOWN:MST-312']
    [u'compound:CID46943432']
    [u'compound:CID9803433']
    [u'compound:UNKNOWN:ELCPK']
    [u'compound:UNKNOWN:NSC30930']
    [u'compound:UNKNOWN:MK-2206']
    [u'compound:UNKNOWN:YK 4-279']
    [u'compound:CID126941']
    [u'compound:UNKNOWN:CIL55']
    [u'compound:UNKNOWN:JW-480']
    [u'compound:CID2733526']
    [u'compound:CID3690']
    [u'compound:UNKNOWN:spautin-1']
    [u'compound:CID38904']
    [u'compound:CID3793']
    [u'compound:CID5113032']
    [u'compound:CID10322450']
    [u'compound:UNKNOWN:ceranib-2']
    [u'compound:CID49867926']
    [u'compound:UNKNOWN:BRD-K27188169']
    [u'compound:CID5978']
    [u'compound:UNKNOWN:CAY10618']
    [u'compound:CID5702613']
    [u'compound:UNKNOWN:ML210']
    [u'compound:UNKNOWN:BRD-K35604418']
    [u'compound:UNKNOWN:nakiterpiosin']
    [u'compound:UNKNOWN:BRD-K37390332']
    [u'compound:UNKNOWN:BRD-K78574327']
    [u'compound:UNKNOWN:BRD-K34222889']
    [u'compound:UNKNOWN:cucurbitacin I']
    [u'compound:CID9956119']
    [u'compound:UNKNOWN:BRD-K41597374']
    [u'compound:UNKNOWN:BRD-K07442505']
    [u'compound:UNKNOWN:KHS101']
    [u'compound:UNKNOWN:BRD-K64610608']
    [u'compound:CID44224160']
    [u'compound:UNKNOWN:CID-5951923']
    [u'compound:UNKNOWN:BRD-K71935468']
    [u'compound:UNKNOWN:BRD-K51490254']
    [u'compound:CID6184667']
    [u'compound:CID11228183']
    [u'compound:UNKNOWN:968']
    [u'compound:CID36462']
    [u'compound:CID9549297']
    [u'compound:CID2708']
    [u'compound:CID44137675']
    [u'compound:CID9903786']
    [u'compound:UNKNOWN:ML006']
    [u'compound:CID66577038']
    [u'compound:CID25195348']
    [u'compound:UNKNOWN:SRT-1720']
    [u'compound:CID156422']
    [u'compound:CID42611257']
    [u'compound:UNKNOWN:BRD-K97651142']
    [u'compound:UNKNOWN:PRIMA-1-Met']
    [u'compound:CID219104']
    [u'compound:CID60750']
    [u'compound:CID9884685']
    [u'compound:CID10410894']
    [u'compound:UNKNOWN:erastin']
    [u'compound:UNKNOWN:BRD-K41334119']
    [u'compound:CID4917']
    [u'compound:UNKNOWN:curcumin']
    [u'compound:CID374536']
    [u'compound:UNKNOWN:BRD-K45681478']
    [u'compound:UNKNOWN:BRD-K66453893']
    [u'compound:UNKNOWN:BRD-K28456706']
    [u'compound:CID17755052']
    [u'compound:UNKNOWN:BRD-K14844214']
    [u'compound:UNKNOWN:BRD-A02303741']
    [u'compound:UNKNOWN:BRD-K29086754']
    [u'compound:CID46191454']
    [u'compound:CID5278396']
    [u'compound:CID2949965']
    [u'compound:UNKNOWN:ML050']
    [u'compound:UNKNOWN:BRD-K29313308']
    [u'compound:UNKNOWN:CD-1530']
    [u'compound:UNKNOWN:BRD-K85133207']
    [u'compound:UNKNOWN:Compound 23 citrate']
    [u'compound:UNKNOWN:BRD-K49290616']
    [u'compound:UNKNOWN:ML311']
    [u'compound:UNKNOWN:PD318088']
    [u'compound:UNKNOWN:BRD-A94377914']
    [u'compound:UNKNOWN:BRD-K88742110']
    [u'compound:UNKNOWN:neopeltolide']
    [u'compound:UNKNOWN:BRD-K44224150']
    [u'compound:UNKNOWN:16-beta-bromoandrosterone']
    [u'compound:CID46907787']
    [u'compound:CID11364421']
    [u'compound:CID5353562']
    [u'compound:CID31703']
    [u'compound:CID4521392']
    [u'compound:CID5394']
    [u'compound:CID4259181']
    [u'compound:UNKNOWN:CCT036477']
    [u'compound:UNKNOWN:temsirolimus']
    [u'compound:UNKNOWN:serdemetan']
    [u'compound:CID64971']
    [u'compound:UNKNOWN:CIL41']
    [u'compound:UNKNOWN:NSC632839']
    [u'compound:UNKNOWN:BRD-K94991378']
    [u'compound:UNKNOWN:zebularine']
    [u'compound:UNKNOWN:LY-2157299']
    [u'compound:UNKNOWN:BRD-K03536150']
    [u'compound:UNKNOWN:BRD-K96970199']
    [u'compound:UNKNOWN:BEC']
    [u'compound:CID44259']
    [u'compound:UNKNOWN:compound 1B']
    [u'compound:CID15983966']
    [u'compound:UNKNOWN:GSK-3 inhibitor IX']
    [u'compound:CID3503']
    [u'compound:CID11647372']
    [u'compound:CID104842']
    [u'compound:CID24772860']
    [u'compound:UNKNOWN:BRD1835']
    [u'compound:UNKNOWN:BRD-K13185470']
    [u'compound:UNKNOWN:VU0155056']
    [u'compound:UNKNOWN:BRD-K20514654']
    [u'compound:CID3854666']
    [u'compound:CID44241473']
    [u'compound:UNKNOWN:BMS-270394']
    [u'compound:CID50905018']
    [u'compound:UNKNOWN:triptolide']
    [u'compound:CID132496']
    [u'compound:UNKNOWN:tigecycline']
    [u'compound:CID23635314']
    [u'compound:UNKNOWN:BRD-K16147474']
    [u'compound:CID6918328']
    [u'compound:CID54454']
    [u'compound:UNKNOWN:CIL55A']
    [u'compound:UNKNOWN:NVP-231']
    [u'compound:UNKNOWN:BRD-K86535717']
    [u'compound:CID148198']
    [u'compound:UNKNOWN:NPC-26']
    [u'compound:CID24785538']
    [u'compound:UNKNOWN:SCH-529074']
    [u'compound:UNKNOWN:BRD-K34485477']
    [u'compound:UNKNOWN:BRD4132']
    [u'compound:CID441298']
    [u'compound:UNKNOWN:tipifarnib-P1']
    [u'compound:UNKNOWN:BRD-K30019337']
    [u'compound:UNKNOWN:linsitinib']
    [u'compound:UNKNOWN:ML203']
    [u'compound:UNKNOWN:TW-37']
    [u'compound:CID46224516']
    [u'compound:UNKNOWN:nutlin-3']
    [u'compound:UNKNOWN:bosutinib']
    [u'compound:UNKNOWN:SID 26681509']
    [u'compound:UNKNOWN:B02']
    [u'compound:UNKNOWN:ciclosporin']
    [u'compound:UNKNOWN:ML320']
    [u'compound:CID15953870']
    [u'compound:CID439501']
    [u'compound:CID11626927']
    [u'compound:CID1714884']
    [u'compound:UNKNOWN:NVP-BSK805']
    [u'compound:CID11178236']
    [u'compound:UNKNOWN:BRD-K75293299']
    [u'compound:UNKNOWN:BRD-K27986637']
    [u'compound:CID11612883']
    [u'compound:CID2130404']
    [u'compound:UNKNOWN:BRD6340']
    [u'compound:CID444795']
    [u'compound:UNKNOWN:Merck60']
    [u'compound:CID5212']
    [u'compound:UNKNOWN:BRD-K63431240']
    [u'compound:UNKNOWN:ML031']
    [u'compound:UNKNOWN:NSC48300']
    [u'compound:UNKNOWN:BRD-K11533227']
    [u'compound:CID11152667']
    [u'compound:UNKNOWN:BRD-K50799972']
    [u'compound:UNKNOWN:BRD-K71781559']
    [u'compound:CID24901704']
    [u'compound:UNKNOWN:BRD-K84807411']
    [u'compound:UNKNOWN:BRD-K19103580']
    [u'compound:UNKNOWN:PL-DI']
    [u'compound:UNKNOWN:BRD-K70511574']
    [u'compound:UNKNOWN:PRL-3 inhibitor I']
    [u'compound:UNKNOWN:fluvastatin']
    [u'compound:UNKNOWN:ML258']
    [u'compound:UNKNOWN:manumycin A']
    [u'compound:UNKNOWN:BRD-K61166597']
    [u'compound:CID9967941']
    [u'compound:UNKNOWN:necrostatin-7']
    [u'compound:CID2756']
    [u'compound:UNKNOWN:BRD-K92856060']
    [u'compound:CID7251185']
    [u'compound:UNKNOWN:brefeldin A']
    [u'compound:UNKNOWN:BRD-K48334597']
    [u'compound:UNKNOWN:BRD-K34099515']
    [u'compound:UNKNOWN:BRD-K58730230']
    [u'compound:CID24779724']
    [u'compound:UNKNOWN:oligomycin A']
    [u'compound:UNKNOWN:ML312']
    [u'compound:UNKNOWN:BRD-K33199242']
    [u'compound:CID675434']
    [u'compound:UNKNOWN:BRD-K03911514']
    [u'compound:UNKNOWN:WZ8040']
    [u'compound:UNKNOWN:BRD-K02492147']
    [u'compound:CID6753378']
    [u'compound:CID6852167']
    [u'compound:CID3025986']
    [u'compound:UNKNOWN:CAY10594']
    [u'compound:UNKNOWN:BRD-K55116708']
    [u'compound:CID25154868']
    [u'compound:UNKNOWN:QS-11']
    [u'compound:UNKNOWN:BRD-K80183349']
    [u'compound:CID11625818']
    [u'compound:UNKNOWN:FQI-2']
    [u'compound:UNKNOWN:BRD-K04800985']
    [u'compound:CID5566']
    [u'compound:UNKNOWN:CIL70']
    [u'compound:UNKNOWN:BRD-K52037352']
    [u'compound:UNKNOWN:BRD-K96431673']
    [u'compound:UNKNOWN:MI-1']
    [u'compound:CID452548']
    [u'compound:UNKNOWN:PDMP']
    [u'compound:UNKNOWN:BRD-K24690302']
    [u'compound:CID375860']
    [u'compound:CID3385']
    [u'compound:UNKNOWN:pluripotin']
    [u'compound:CID52912189']
    [u'compound:UNKNOWN:FSC231']
    [u'compound:CID135411']
    [u'compound:CID11964036']
    [u'compound:CID9866186']
    [u'compound:UNKNOWN:PYR-41']
    [u'compound:UNKNOWN:BRD-A71883111']
    [u'compound:UNKNOWN:myriocin']
    [u'compound:CID9927531']
    [u'compound:UNKNOWN:FQI-1']
    [u'compound:CID51039095']
    [u'compound:UNKNOWN:BRD-K99584050']
    [u'compound:UNKNOWN:lovastatin']
    [u'compound:UNKNOWN:SJ-172550']
    [u'compound:CID46199207']
    [u'compound:UNKNOWN:BRD8958']
    [u'compound:CID435678']
    [u'compound:UNKNOWN:BRD8899']
    [u'compound:CID11427553']
    [u'compound:CID9825149']
    [u'compound:CID11213558']
    [u'compound:UNKNOWN:pandacostat']
    [u'compound:CID5282054']
    [u'compound:CID2742550']
    [u'compound:CID148124']
    [u'compound:UNKNOWN:BRD-K17060750']
    [u'compound:CID16741245']
    [u'compound:UNKNOWN:cyanoquinoline 11']
    [u'compound:UNKNOWN:Repligen 136']
    [u'compound:UNKNOWN:WP1130']
    [u'compound:CID445091']
    [u'compound:UNKNOWN:cytochalasin B']
    [u'compound:CID9826308']
    [u'compound:UNKNOWN:ML083']
    [u'compound:UNKNOWN:SR-II-138A']
    [u'compound:CID9907093']
    [u'compound:CID676352']
    [u'compound:UNKNOWN:BRD9647']
    [u'compound:UNKNOWN:bleomycin A2']
    [u'compound:CID24856436']
    [u'compound:UNKNOWN:austocystin D']
    [u'compound:CID421610']
    [u'compound:UNKNOWN:BRD-K13999467']
    [u'compound:UNKNOWN:BRD-K27224038']
    [u'compound:UNKNOWN:IPR-456']
    [u'compound:UNKNOWN:STF-31']
    [u'compound:UNKNOWN:CR-1-31B']
    [u'compound:CID9908783']
    [u'compound:UNKNOWN:SB-743921']
    [u'compound:UNKNOWN:ML162']
    [u'compound:UNKNOWN:SMER-3']
    [u'compound:CID445643']
    [u'compound:CID10026128']
    [u'compound:CID9868037']
    [u'compound:UNKNOWN:Compound 1541A']
    [u'compound:UNKNOWN:QW-BI-011']
    [u'compound:UNKNOWN:BRD-K02251932']
    [u'compound:CID11717001']
    [u'compound:UNKNOWN:1S,3R-RSL-3']
    [u'compound:CID702558']
    [u'compound:CID46901937']
    [u'compound:UNKNOWN:CIL56']
    [u'compound:UNKNOWN:BRD-K79669418']
    [u'compound:CID9911463']
    [u'compound:UNKNOWN:triazolothiadiazine']
    [u'compound:CID25183872']
    [u'compound:CID11507802']
    [u'compound:UNKNOWN:Platin']
    [u'compound:CID5281672']
    [u'compound:UNKNOWN:BRD-K16130065']
    [u'compound:UNKNOWN:Bax channel blocker']
    [u'compound:CID409805']
    [u'compound:CID2126']
    [u'compound:UNKNOWN:elocalcitol']
    [u'compound:UNKNOWN:BRD-K26531177']
    [u'compound:CID2907']
    [u'compound:CID4788']
    [u'compound:UNKNOWN:BMS-536924']
    [u'compound:UNKNOWN:tosedostat']
    [u'compound:UNKNOWN:ML029']
    [u'compound:CID25150857']
    [u'compound:CID122327']
    [u'compound:UNKNOWN:BRD-K09587429']
    [u'compound:CID5743']
    [u'compound:CID10427712']
    [u'compound:CID638278']
    [u'compound:UNKNOWN:PF-184']
    [u'compound:UNKNOWN:YL54']
    [u'compound:UNKNOWN:oxaliplatin']
    [u'compound:CID9813758']
    [u'compound:CID4477']
    [u'compound:CID3825829']
    [u'compound:CID11317348']
    [u'compound:UNKNOWN:AT7867']
    [u'compound:CID227681']
    [u'compound:UNKNOWN:avrainvillamide']
    [u'compound:CID46843906']
    [u'compound:CID11977753']
    [u'compound:UNKNOWN:BRD-K09344309']
    [u'compound:CID44237094']
    [u'compound:UNKNOWN:JW-55']
    [u'compound:UNKNOWN:KPT185']
    [u'compound:CID56949517']
    [u'compound:UNKNOWN:marinopyrrole A']
    [u'compound:CID49846579']
    [u'compound:UNKNOWN:palmostatin B']
    [u'compound:UNKNOWN:ETP-46464']
    [u'compound:UNKNOWN:A-804598']
    [u'compound:UNKNOWN:COL-3']
    [u'compound:CID56649450']
    [u'compound:UNKNOWN:necrosulfonamide']
    [u'compound:UNKNOWN:pitstop2']
    [u'compound:CID25022340']
    [u'compound:UNKNOWN:methylstat']
    [u'compound:UNKNOWN:JW-74']
    [u'compound:UNKNOWN:HBX-41108']
    [u'compound:UNKNOWN:R428']
    [u'compound:CID44607530']
    [u'compound:UNKNOWN:ML334 diastereomer']
    [u'compound:UNKNOWN:BRD-K55473186']
    [u'compound:UNKNOWN:GSK1059615']
    [u'compound:UNKNOWN:BRD-M00053801']
    [u'compound:UNKNOWN:VAF-347']
    [u'compound:UNKNOWN:BRD-K90370028']
    [u'compound:CID462382']
    [u'compound:UNKNOWN:BRD-K48477130']
    [u'compound:CID5426']
    [u'compound:UNKNOWN:MLN2480']
    [u'compound:UNKNOWN:SZ4TA2']
    [u'compound:UNKNOWN:BRD-K42260513']
    [u'compound:UNKNOWN:BRD-K51831558']
    [u'compound:UNKNOWN:CBB-1007']
    [u'compound:UNKNOWN:BRD-K99006945']
    [u'compound:CID49867930']
    [u'compound:UNKNOWN:BCL-LZH-4']
    [u'compound:UNKNOWN:MI-2']
    [u'compound:CID25227462']
    [u'compound:CID16659841']
    [u'compound:UNKNOWN:BRD-A86708339']
    [u'compound:UNKNOWN:avicin D']
    [u'compound:UNKNOWN:BRD-A05715709']
    [u'compound:CID11955716']
    [u'compound:CID71729975']
    [u'compound:UNKNOWN:BRD-K33514849']
    [u'compound:CID5494449']
    [u'compound:UNKNOWN:BRD-K30748066']
    [u'compound:UNKNOWN:BRD-K01737880']
    [u'compound:CID6436223']
    [u'compound:UNKNOWN:SR8278']



```python
print list(O.query().V().where(aql.eq("_label", "ResponseCurve")).outEdge("responseTo").distinct("_to").render(["_to"]).count())

```

    [{u'count': 402}]



```python
print list(O.query().V().where(aql.eq("_label", "G2PAssociation")).outEdge("environmentFor").distinct("_to").render(["_to"]))

```

    [[u'compound:CID36314'], [u'compound:CHEMBL1201583'], [u'compound:CHEMBL1351'], [u'compound:CID5328940'], [u'compound:CID176870'], [u'compound:SID160740892'], [u'compound:CHEMBL1201577'], [u'compound:CID248'], [u'compound:CID644241'], [u'compound:CID5330286'], [u'compound:CID5291'], [u'compound:CID17755052'], [u'compound:CID57335384'], [u'compound:CID71496458'], [u'compound:CHEMBL2068237'], [u'compound:SID252827393'], [u'compound:SID829354'], [u'compound:CID2723601'], [u'compound:CID2708'], [u'compound:CHEMBL1743048'], [u'compound:CHEMBL3545267'], [u'compound:CHEMBL2108354'], [u'compound:CHEMBL2109611'], [u'compound:CID3062316'], [u'compound:CID5329102'], [u'compound:CID42611257'], [u'compound:CID10868'], [u'compound:CHEMBL1201827'], [u'compound:CID123631'], [u'compound:CID57379345'], [u'compound:CID9809715'], [u'compound:CID6450551'], [u'compound:CHEMBL2108078'], [u'compound:CID23725625'], [u'compound:CHEMBL2109423'], [u'compound:CID24889392'], [u'compound:CID56962337'], [u'compound:CID6569'], [u'compound:CHEMBL1201585'], [u'compound:CID46220502'], [u'compound:CID30323'], [u'compound:CID11626560'], [u'compound:CID10184653'], [u'compound:CID50925411'], [u'compound:CID4553'], [u'compound:CID439242'], [u'compound:CID11667893'], [u'compound:PI3K pathway inhibitors'], [u'compound:CID216239'], [u'compound:CID5280795'], [u'compound:CHEMBL2108738'], [u'compound:CHEMBL1789844'], [u'compound:CID6442177'], [u'compound:CID3385'], [u'compound:CID2157'], [u'compound:CID60838'], [u'compound:CID6006'], [u'compound:CHEMBL2146121'], [u'compound:CID44462760'], [u'compound:CX-5461'], [u'compound:CX-3543'], [u'compound:CID25126798'], [u'compound:CID5287662'], [u'compound:SID160731225'], [u'compound:SID160728818'], [u'compound:CID9933475'], [u'compound:CID57339437'], [u'compound:CHEMBL2364649'], [u'compound:CID11707110'], [u'compound:CID24826799'], [u'compound:CID31703'], [u'compound:CHEMBL1201567'], [u'compound:CID2907'], [u'compound:CHEMBL1201568'], [u'compound:CID11620908'], [u'compound:CID104741'], [u'compound:CID11963532'], [u'compound:SID160714338'], [u'compound:CID10127622'], [u'compound:PI3K pathway inhibitor + AR antagonists'], [u'compound:2 inhibitors'], [u'compound:CID11978742'], [u'compound:CHEMBL3137343'], [u'compound:CID5746'], [u'compound:HDAC inhibitors'], [u'compound:CHEMBL2108193'], [u'compound:CID208908'], [u'compound:CID9915743'], [u'compound:CID5394'], [u'compound:CID448601'], [u'compound:CID16129706'], [u'compound:CID24756910'], [u'compound:CID31748'], [u'compound:CID11315474'], [u'compound:CID4211'], [u'compound:SID85238936'], [u'compound:SID834654'], [u'compound:CID36462'], [u'compound:CHEMBL2108342'], [u'compound:CID444795'], [u'compound:CID42890'], [u'compound:CHEMBL2108066'], [u'compound:CID6253'], [u'compound:CID11167602'], [u'compound:CID9826528'], [u'compound:SID160714335'], [u'compound:CID10113978'], [u'compound:SID160714054'], [u'compound:BPR1J373'], [u'compound:CHEMBL414804'], [u'compound:CID60953'], [u'compound:CID23969'], [u'compound:CHEMBL2108096'], [u'compound:CID4212'], [u'compound:CID126941'], [u'compound:CID667490'], [u'compound:CID6993081'], [u'compound:CID11717001'], [u'compound:CID10366136'], [u'compound:CID24776445'], [u'compound:CID6918848'], [u'compound:PARP inhibitors'], [u'compound:CID9444'], [u'compound:CID11256560'], [u'compound:CID6918289'], [u'compound:CID3081361'], [u'compound:CID71576678'], [u'compound:CID148124'], [u'compound:CID6134'], [u'compound:CID46911863'], [u'compound:CID25151352'], [u'compound:CID24821094'], [u'compound:CID6445533'], [u'compound:SID160731123'], [u'compound:CID25187973'], [u'compound:CID25102847'], [u'compound:Spliceosome inhibitors'], [u'compound:CID46188928'], [u'compound:CID13342'], [u'compound:CID9549289'], [u'compound:MTOR inhibitors'], [u'compound:CID18220161'], [u'compound:CID8249'], [u'compound:SID318695959'], [u'compound:CID24180719'], [u'compound:CID11006912'], [u'compound:CID15983966'], [u'compound:CID53405145'], [u'compound:CHEMBL2108989'], [u'compound:CID71384'], [u'compound:CID23662354'], [u'compound:CID5978'], [u'compound:CID6741'], [u'compound:CID7638'], [u'compound:CID5743'], [u'compound:CID101743'], [u'compound:CID190'], [u'compound:CID5754'], [u'compound:CID61503'], [u'compound:CHEMBL2108546'], [u'compound:CID5755'], [u'compound:CID149436'], [u'compound:CID3690'], [u'compound:CID60750'], [u'compound:CID51042438'], [u'compound:CHEMBL1743007'], [u'compound:CID5426'], [u'compound:CID387447'], [u'compound:CID5284616'], [u'compound:CID42631268'], [u'compound:CID3902'], [u'compound:CID97536'], [u'compound:CID5311128'], [u'compound:SID160736360'], [u'compound:CHEMBL1201576'], [u'compound:CID216326'], [u'compound:CID16222096'], [u'compound:CID71268957'], [u'compound:CID18221817'], [u'compound:CID49767713'], [u'compound:CID764'], [u'compound:CID71721540'], [u'compound:CID10288191'], [u'compound:CID444305'], [u'compound:CID5311497'], [u'compound:CID71586737'], [u'compound:SID160729028'], [u'compound:CID53358942'], [u'compound:CID71731823'], [u'compound:AURK inhibitors'], [u'compound:CID22024915'], [u'compound:A'], [u'compound:CID54761306'], [u'compound:CID11511120'], [u'compound:CID46907787'], [u'compound:PF 00299804'], [u'compound:CID11354606'], [u'compound:CID6331'], [u'compound:PDGFR inhibitors'], [u'compound:SID160766613'], [u'compound:CHEMBL3137320'], [u'compound:CI-1040'], [u'compound:CID2733526'], [u'compound:SID160717314'], [u'compound:CID73355059'], [u'compound:CID70691388'], [u'compound:CID54730499'], [u'compound:CID11977753'], [u'compound:CID44393931'], [u'compound:CID23939'], [u'compound:Tubulin inhibitors'], [u'compound:CID69590'], [u'compound:FACT inhibitors'], [u'compound:SID135308930'], [u'compound:CID64689'], [u'compound:CID312'], [u'compound:CID6432616'], [u'compound:CID5282165'], [u'compound:CID1174'], [u'compound:HDM2 inhibitors'], [u'compound:CHEMBL3545131'], [u'compound:CID11556711'], [u'compound:SID7890515'], [u'compound:CID24964624'], [u'compound:CID159324'], [u'compound:CID18223429'], [u'compound:CHEMBL2108353'], [u'compound:CHEMBL2108494'], [u'compound:CID51039095'], [u'compound:CID160617'], [u'compound:CID3006531'], [u'compound:CID36523'], [u'compound:SID160769799'], [u'compound:VEGFR inhibitors'], [u'compound:CHEMBL2108727'], [u'compound:CID15951529'], [u'compound:CID25227436'], [u'compound:CID16736978'], [u'compound:Porcupine inhibitors'], [u'compound:SYM015'], [u'compound:CID58423153'], [u'compound:BI-847325'], [u'compound:CID53235510'], [u'compound:CID1401'], [u'compound:CID107935'], [u'compound:CID46930998'], [u'compound:PF-03084014'], [u'compound:CID4091'], [u'compound:CID56962336'], [u'compound:CID9931954'], [u'compound:CID42642645'], [u'compound:CID57390074'], [u'compound:CHEMBL2103879'], [u'compound:CID44187362'], [u'compound:CID10096043'], [u'compound:PF-4989216'], [u'compound:CHEMBL522892'], [u'compound:CID71667668'], [u'compound:CID10172827'], [u'compound:CID25207668'], [u'compound:AZD4785'], [u'compound:CID9829523'], [u'compound:Sym004'], [u'compound:CID56649450'], [u'compound:CID49784945'], [u'compound:CID24901704'], [u'compound:CHEMBL1091644'], [u'compound:CID22017550'], [u'compound:CID16654980'], [u'compound:CID5289418'], [u'compound:CID44452712'], [u'compound:CID11167112'], [u'compound:CHEMBL2109431'], [u'compound:CID44516953'], [u'compound:RG7446'], [u'compound:CID6918837'], [u'compound:CID3035817'], [u'compound:CID16719221'], [u'compound:SRA737'], [u'compound:CID24794418'], [u'compound:CID11193463'], [u'compound:CHEMBL3120215'], [u'compound:CID45375955'], [u'compound:CID49863499'], [u'compound:CID9926791'], [u'compound:CID11998969'], [u'compound:CID10093552'], [u'compound:mTOR inhibitors'], [u'compound:CID46926350'], [u'compound:CID18223071'], [u'compound:CID53319843'], [u'compound:PWT33597'], [u'compound:CID6914657'], [u'compound:CID9549297'], [u'compound:CID25127713'], [u'compound:UC-857993'], [u'compound:CHEMBL3301578'], [u'compound:SID57410660'], [u'compound:CID4713'], [u'compound:CHEMBL3545261'], [u'compound:CID9823820'], [u'compound:CID76685059'], [u'compound:CID44631912'], [u'compound:CHEMBL3545053'], [u'compound:SID313371058'], [u'compound:CID2187'], [u'compound:CID49806720'], [u'compound:CID118693659'], [u'compound:None'], [u'compound:CID11983308'], [u'compound:CHEMBL3545421'], [u'compound:CID44631903'], [u'compound:CID24779724'], [u'compound:CHEMBL3545052'], [u'compound:CHEMBL2109384'], [u'compound:CID11234052'], [u'compound:CHEMBL2107863'], [u'compound:S-49076'], [u'compound:MI-503'], [u'compound:CID24866313'], [u'compound:CID86222'], [u'compound:CID16659841'], [u'compound:Ap-26113'], [u'compound:CID24856436'], [u'compound:CID156414'], [u'compound:CID25145656'], [u'compound:CID23635314'], [u'compound:CID3038522'], [u'compound:SID46493516'], [u'compound:CID46944259'], [u'compound:CHEMBL3545248'], [u'compound:CID45272332'], [u'compound:CID44259'], [u'compound:BAY1436032'], [u'compound:CHEMBL2108684'], [u'compound:CHEMBL2007641'], [u'compound:CID71236992'], [u'compound:CID11637584'], [u'compound:PI-3065'], [u'compound:CHEMBL2108359'], [u'compound:CID46216796'], [u'compound:CID1893730'], [u'compound:CID53240420'], [u'compound:CID10296883'], [u'compound:CID10730919'], [u'compound:CHEMBL2138601'], [u'compound:CID46887637'], [u'compound:ARQ092'], [u'compound:CID44603533'], [u'compound:CID52913813'], [u'compound:ST-162'], [u'compound:SID99437372'], [u'compound:CID9863361'], [u'compound:CID11539025'], [u'compound:CID70817911'], [u'compound:CHEMBL2109410'], [u'compound:CID46947264'], [u'compound:CID10302451'], [u'compound:CID70798655'], [u'compound:CHEMBL1743062'], [u'compound:CID10007235'], [u'compound:CID25262792'], [u'compound:CID25066467'], [u'compound:3144'], [u'compound:CID68165256'], [u'compound:UC-773587'], [u'compound:SID7889297'], [u'compound:CID25171648'], [u'compound:CID3001170'], [u'compound:CHEMBL2074863'], [u'compound:CID34469'], [u'compound:CID337359'], [u'compound:CID6445540'], [u'compound:CID24795070'], [u'compound:CID54576299'], [u'compound:R3Mab'], [u'compound:SID160776293'], [u'compound:CID4641'], [u'compound:CID16750133'], [u'compound:CID42628843'], [u'compound:CID6918736'], [u'compound:CID89683805'], [u'compound:CID11548630'], [u'compound:CHEMBL3545246'], [u'compound:CID118238298'], [u'compound:CID24775005'], [u'compound:PF-06463922'], [u'compound:CID468595'], [u'compound:CID176'], [u'compound:CID68210102'], [u'compound:CID25134326'], [u'compound:CID91885989'], [u'compound:CID24788740'], [u'compound:CID60700'], [u'compound:CID123132228'], [u'compound:CID42642648'], [u'compound:CHEMBL3545075'], [u'compound:SID7890857'], [u'compound:CID10297043'], [u'compound:CHEMBL3545336'], [u'compound:CID49848070'], [u'compound:CID71611869'], [u'compound:CID17751819'], [u'compound:CID460612'], [u'compound:CID3973'], [u'compound:BAY1187982'], [u'compound:CID6432717'], [u'compound:CHEMBL3545200'], [u'compound:7RH'], [u'compound:CID46203501'], [u'compound:CID25141092'], [u'compound:CID60843'], [u'compound:CID44137675'], [u'compound:XMD15-44'], [u'compound:CID444818'], [u'compound:CID25262965'], [u'compound:CID49854424'], [u'compound:DS6051b'], [u'compound:CHEMBL3707249'], [u'compound:Pz-1'], [u'compound:CHEMBL1234354'], [u'compound:CID6918852'], [u'compound:ALW-II-41-27'], [u'compound:CHEMBL3707227'], [u'compound:CID44452624'], [u'compound:CID66577114'], [u'compound:FIIN-01'], [u'compound:CID46883775'], [u'compound:CID118295624'], [u'compound:MSC2363318A'], [u'compound:HG-6-63-01'], [u'compound:CHEMBL3545144'], [u'compound:SID160746670'], [u'compound:XMT-1536'], [u'compound:CID44424274'], [u'compound:PF-05280014'], [u'compound:AR-42'], [u'compound:CID8871'], [u'compound:CID46926973'], [u'compound:CID5311277'], [u'compound:KU60648'], [u'compound:CID73087'], [u'compound:CID25182860'], [u'compound:SID210275405'], [u'compound:CID24958200'], [u'compound:CID24785538'], [u'compound:AZ8010'], [u'compound:CID11656518'], [u'compound:CID49846579'], [u'compound:CID45375953'], [u'compound:DHM25'], [u'compound:CID5376617'], [u'compound:CID56949517'], [u'compound:CID42636535'], [u'compound:FLX925  '], [u'compound:KU004'], [u'compound:CID72322'], [u'compound:CID4261'], [u'compound:PI-273'], [u'compound:CID66558664'], [u'compound:CID25161177'], [u'compound:CID11282283'], [u'compound:CID121473004'], [u'compound:AZ-TAK1'], [u'compound:SID164130400'], [u'compound:GSK3052230'], [u'compound:CID11442891'], [u'compound:CID24905401'], [u'compound:CID11493740'], [u'compound:CHEMBL2109662'], [u'compound:CID10275001'], [u'compound:CID56846693'], [u'compound:CHEMBL3545322'], [u'compound:CID56599293'], [u'compound:CID1356208'], [u'compound:CID7873'], [u'compound:CID14804'], [u'compound:CID49803313'], [u'compound:CID9930121'], [u'compound:CID14624081'], [u'compound:CID11520894'], [u'compound:CID445801'], [u'compound:iCRT-3'], [u'compound:TK216'], [u'compound:CID53321387'], [u'compound:CID3501'], [u'compound:CID53316615'], [u'compound:CID3463933'], [u'compound:CID11228183'], [u'compound:CC-90003'], [u'compound:SID134213965'], [u'compound:SID841062'], [u'compound:CID2049'], [u'compound:CID10658'], [u'compound:2'], [u'compound:CHEMBL3301587'], [u'compound:BI-69A11'], [u'compound:CID9884685'], [u'compound:Torin 1 + WEHI-539'], [u'compound:CID65399'], [u'compound:CID25062766'], [u'compound:CID25243800'], [u'compound:CID16038120'], [u'compound:AP32788'], [u'compound:CID2726824'], [u'compound:CID397'], [u'compound:CID2244'], [u'compound:CID73777259'], [u'compound:tensirolimus plus chemotherapy'], [u'compound:CID9882189'], [u'compound:CHEMBL2109531'], [u'compound:CHEMBL2108658'], [u'compound:CID11289'], [u'compound:CHEMBL476'], [u'compound:CID2375'], [u'compound:CID13769'], [u'compound:CID11625818'], [u'compound:CID9796068'], [u'compound:CID451668'], [u'compound:CID119182'], [u'compound:CHEMBL2108621'], [u'compound:CID131824'], [u'compound:CHEMBL1201836'], [u'compound:CID91864709'], [u'compound:CID176167'], [u'compound:CHEMBL1743001'], [u'compound:CHEMBL1201587'], [u'compound:CHEMBL2108950'], [u'compound:CID657237'], [u'compound:CID4033'], [u'compound:CID5790'], [u'compound:CID5212'], [u'compound:CID9961878'], [u'compound:CID60198'], [u'compound:AMGMDS3'], [u'compound:CID3121'], [u'compound:CID2578'], [u'compound:CHEMBL2108531'], [u'compound:CID60961'], [u'compound:CID65016'], [u'compound:CID65374'], [u'compound:CID9571836'], [u'compound:CID445226'], [u'compound:CID108223'], [u'compound:CID24360'], [u'compound:CHEMBL1201438'], [u'compound:CID41867'], [u'compound:CID83969'], [u'compound:CID2162'], [u'compound:CID6322'], [u'compound:CID145068'], [u'compound:CID2265'], [u'compound:CID37542'], [u'compound:CHEMBL1201670'], [u'compound:SID135309329'], [u'compound:CID44285374'], [u'compound:CID1014'], [u'compound:CID5311'], [u'compound:CID5287969'], [u'compound:CHEMBL1201550'], [u'compound:CID53380437'], [u'compound:SID837494'], [u'compound:CID57327016'], [u'compound:CID445643'], [u'compound:CHEMBL2108195'], [u'compound:CHEMBL1743016'], [u'compound:CHEMBL2107909'], [u'compound:CID54454'], [u'compound:CHEMBL2108404'], [u'compound:CID49865963'], [u'compound:CID44406723'], [u'compound:CID148177'], [u'compound:CID6337614'], [u'compound:CID2478'], [u'compound:SID3332'], [u'compound:CHEMBL2107861'], [u'compound:CHEMBL2109512'], [u'compound:CT-P6'], [u'compound:CHEMBL1743024'], [u'compound:CHEMBL1743003'], [u'compound:CID50258'], [u'compound:CHEBI:85010'], [u'compound:SID91145153'], [u'compound:CID70693531'], [u'compound:CID657181'], [u'compound:CID25183872'], [u'compound:CID53627546'], [u'compound:CID446541'], [u'compound:CID9820073'], [u'compound:CID56832351'], [u'compound:CID613145'], [u'compound:CID3503'], [u'compound:CID82146'], [u'compound:CID176873'], [u'compound:CHEMBL1743051'], [u'compound:CID6918405'], [u'compound:CHEMBL34866'], [u'compound:CHEMBL1743036'], [u'compound:SID819359'], [u'compound:CID11960529'], [u'compound:CHEMBL1366'], [u'compound:CID9882105'], [u'compound:CID4829'], [u'compound:CHEMBL2146125'], [u'compound:CID305'], [u'compound:CHEMBL2108250'], [u'compound:CHEMBL1201604'], [u'compound:CHEMBL3545209'], [u'compound:CHEMBL3545431'], [u'compound:CID11488320'], [u'compound:CID4915'], [u'compound:CID65015'], [u'compound:SID315661195'], [u'compound:CHEMBL2109151'], [u'compound:CID9985120'], [u'compound:CID158780'], [u'compound:SID310264729'], [u'compound:CID16204481'], [u'compound:CID51001932'], [u'compound:CID66571643'], [u'compound:CID23690498'], [u'compound:CID1110'], [u'compound:CID60877'], [u'compound:CID5481350'], [u'compound:CID464205'], [u'compound:CID5702029'], [u'compound:CID64139'], [u'compound:CID405012'], [u'compound:CID73051463'], [u'compound:CID447312'], [u'compound:CID5816'], [u'compound:CID6918454'], [u'compound:CID774'], [u'compound:CID3547'], [u'compound:Chemotherapy'], [u'compound:CID65628'], [u'compound:CID11494412'], [u'compound:CHEMBL3545271'], [u'compound:CID3002352'], [u'compound:CID6536806'], [u'compound:CID446284'], [u'compound:E-3810'], [u'compound:CHEMBL1743049'], [u'compound:CID5284373'], [u'compound:CID25212148'], [u'compound:CID46184986'], [u'compound:CHEMBL2108680'], [u'compound:CHEMBL408194'], [u'compound:CID57406853'], [u'compound:CHEMBL1233528'], [u'compound:CID9800555'], [u'compound:CID2733335'], [u'compound:CHEMBL1200381'], [u'compound:CID6323266'], [u'compound:CID6256'], [u'compound:CID10219674'], [u'compound:CID5281035'], [u'compound:CHEMBL2108038'], [u'compound:CID56603688'], [u'compound:CHEMBL2109387'], [u'compound:CID132971'], [u'compound:CID2662'], [u'compound:CHEMBL1742992'], [u'compound:CHEMBL2109256'], [u'compound:CHEMBL3545180'], [u'compound:CHEMBL3545251'], [u'compound:CHEMBL2109323'], [u'compound:CID104799'], [u'compound:CID6013'], [u'compound:CHEMBL2109583'], [u'compound:CHEMBL3545339'], [u'compound:CID92199'], [u'compound:Pd-0332991'], [u'compound:CID5284643'], [u'compound:CHEMBL1743019'], [u'compound:CID3397'], [u'compound:CID7045798'], [u'compound:CID3950'], [u'compound:CHEMBL1237023'], [u'compound:CID466151'], [u'compound:CHEMBL2109575'], [u'compound:CID44452463'], [u'compound:CHEMBL1743010'], [u'compound:CHEMBL3545348'], [u'compound:CID196970'], [u'compound:SID252166535'], [u'compound:CID5282379'], [u'compound:CID6918011'], [u'compound:CID1015'], [u'compound:CID44397641'], [u'compound:CID44311108'], [u'compound:CID50922675'], [u'compound:CID148195'], [u'compound:CID134780'], [u'compound:CID5386'], [u'compound:CID54758501'], [u'compound:CID4946'], [u'compound:CHEMBL2109150'], [u'compound:CID5361'], [u'compound:SID315661217'], [u'compound:CID46878269'], [u'compound:CID6992086'], [u'compound:CHEMBL1201821'], [u'compound:CID1054'], [u'compound:CID4642'], [u'compound:CID101656156'], [u'compound:CHEMBL1743006'], [u'compound:CID54679224'], [u'compound:CID5962'], [u'compound:CID1176'], [u'compound:CID71582991'], [u'compound:CHEMBL1743047'], [u'compound:CID253877'], [u'compound:CHEMBL2109389'], [u'compound:CID60823'], [u'compound:CID156391'], [u'compound:CHEMBL13744'], [u'compound:CID60825'], [u'compound:CID30165'], [u'compound:CID10427712'], [u'compound:CID44275145'], [u'compound:TASIN-1'], [u'compound:CHEMBL2109251'], [u'compound:CHEMBL1201608'], [u'compound:MTOR Inhibitors'], [u'compound:CID24963252'], [u'compound:CHEMBL3544931'], [u'compound:CID2094'], [u'compound:SID315661183'], [u'compound:CID104838'], [u'compound:CID4075'], [u'compound:CHEMBL1742989'], [u'compound:CHEMBL3137342'], [u'compound:CID4595'], [u'compound:CID219090'], [u'compound:CID6918365'], [u'compound:CID146938'], [u'compound:CID73348210'], [u'compound:CID947'], [u'compound:CID439176'], [u'compound:CHEMBL2104414'], [u'compound:CHEMBL1697696'], [u'compound:CID3955'], [u'compound:CID57519748'], [u'compound:CID9805055'], [u'compound:CID448013'], [u'compound:CHEMBL1742982'], [u'compound:CID25263424'], [u'compound:CID104842'], [u'compound:CID44589292'], [u'compound:CID807'], [u'compound:CHEMBL2109630'], [u'compound:SID135327470'], [u'compound:CID11538455'], [u'compound:CID59743926'], [u'compound:CID452548'], [u'compound:SID135343047'], [u'compound:CID45486330'], [u'compound:CID9911830'], [u'compound:CID449244'], [u'compound:CID129012108'], [u'compound:CID5493171'], [u'compound:CID3454'], [u'compound:CID35370'], [u'compound:CID5472495'], [u'compound:SID67393'], [u'compound:CID15604015'], [u'compound:CHEMBL1743070'], [u'compound:CHEMBL3545135'], [u'compound:CID50599'], [u'compound:CID19090'], [u'compound:CID71772588'], [u'compound:CID5281104'], [u'compound:SID56310795'], [u'compound:CID9886161'], [u'compound:CID5453'], [u'compound:CID40839'], [u'compound:CID6037'], [u'compound:CHEMBL2108581'], [u'compound:CID5583'], [u'compound:CID31401'], [u'compound:CID148201'], [u'compound:CID130600'], [u'compound:FolfoxProtocol'], [u'compound:CID24771867'], [u'compound:CHEMBL1201573'], [u'compound:CHEMBL1743085'], [u'compound:CHEBI:78887'], [u'compound:CID5460769'], [u'compound:CID25254071'], [u'compound:SID7885927'], [u'compound:CHEMBL2108276'], [u'compound:SID131269105'], [u'compound:CID76327934'], [u'compound:CID25074470'], [u'compound:CHEMBL1201572'], [u'compound:CID9865515'], [u'compound:CID11381449'], [u'compound:CID134019'], [u'compound:CID123619'], [u'compound:CID9854073'], [u'compound:CID17747014'], [u'compound:CID44418304'], [u'compound:CID25074887'], [u'compound:CID638793'], [u'compound:CID118598754'], [u'compound:CID11327430'], [u'compound:CID11964036'], [u'compound:CID86287635'], [u'compound:CID154257'], [u'compound:CID46244454'], [u'compound:CID46878287'], [u'compound:CHEMBL3545422'], [u'compound:Adoptive T-cell Transfer'], [u'compound:CID9548828'], [u'compound:Co-1686'], [u'compound:CHEMBL3545357'], [u'compound:CID10340689'], [u'compound:Pf-06463922'], [u'compound:CID16041424'], [u'compound:CID24866616'], [u'compound:CHEMBL2364652'], [u'compound:CID66414'], [u'compound:CID44422668'], [u'compound:CHEMBL3545026'], [u'compound:CID2946601'], [u'compound:AVX901'], [u'compound:CTLA-4 Antibody'], [u'compound:PD-L1 Antibody'], [u'compound:CID72722031'], [u'compound:CID3117'], [u'compound:CID457193'], [u'compound:SID87556948'], [u'compound:CID3035016'], [u'compound:CID90116675'], [u'compound:JQ-1'], [u'compound:CID121225712'], [u'compound:MEDI6469'], [u'compound:CID16722836'], [u'compound:ETC159'], [u'compound:X-376'], [u'compound:CID126565'], [u'compound:CID44454889'], [u'compound:SID249565666'], [u'compound:CHEMBL3833373'], [u'compound:CID3011155'], [u'compound:CID65412'], [u'compound:CID44519124'], [u'compound:CID5353940'], [u'compound:CID11494620'], [u'compound:CID126970684'], [u'compound:CID6918638'], [u'compound:CID16747683'], [u'compound:PD-1 Inhibitor'], [u'compound:CID11676786'], [u'compound:CID25027363'], [u'compound:CID3672'], [u'compound:SID85239274'], [u'compound:CID2145'], [u'compound:OICR-9429'], [u'compound:SID160724059'], [u'compound:CHEMBL2109619'], [u'compound:CID24995524'], [u'compound:StAx-35'], [u'compound:CID53329621'], [u'compound:CID56842117'], [u'compound:CID49850262'], [u'compound:CID122327'], [u'compound:CHEBI:50845'], [u'compound:CID5311000'], [u'compound:LSN3074753'], [u'compound:CID5565'], [u'compound:CHEMBL3545218'], [u'compound:CID25167777'], [u'compound:CHEMBL2109406'], [u'compound:CID17754438'], [u'compound:CID53329620'], [u'compound:CID90116945'], [u'compound:Antiangiogenic Therapy'], [u'compound:CID148121'], [u'compound:SID249565667'], [u'compound:CID11955716'], [u'compound:CHEMBL2109399'], [u'compound:CHEMBL3545380'], [u'compound:CID4477'], [u'compound:CID68212798'], [u'compound:CID44405088'], [u'compound:CID3634881'], [u'compound:CID45375806'], [u'compound:ASN003'], [u'compound:CID10074640'], [u'compound:CID11973722'], [u'compound:CHEMBL1909658'], [u'compound:CID5029'], [u'compound:SID8148040'], [u'compound:CCT070535'], [u'compound:CID65349680'], [u'compound:CID25267262'], [u'compound:K-756'], [u'compound:CID25031915'], [u'compound:CHEMBL3545419'], [u'compound:CID55283'], [u'compound:CID47965'], [u'compound:CID44199317'], [u'compound:CHEBI:131881'], [u'compound:SID160778150'], [u'compound:CHEMBL2107994'], [u'compound:CID71654819'], [u'compound:CID60138177'], [u'compound:CID46700756'], [u'compound:Induction Therapy'], [u'compound:CID7416167'], [u'compound:SID194168553'], [u'compound:DS-2248'], [u'compound:CID9810709'], [u'compound:CHEMBL3545202'], [u'compound:CID4578'], [u'compound:CID24978538'], [u'compound:CID33624'], [u'compound:CID335974'], [u'compound:CID16013152'], [u'compound:CID44452727'], [u'compound:CID11967809'], [u'compound:CID3767'], [u'compound:VRT11E'], [u'compound:CID40466996'], [u'compound:CID2405'], [u'compound:CID56949327'], [u'compound:CHEMBL3707294'], [u'compound:CID439924'], [u'compound:CCT241161'], [u'compound:Adjuvant Chemotherapy'], [u'compound:CHEMBL3544956'], [u'compound:CID139621'], [u'compound:Msc2363318a'], [u'compound:CID65058'], [u'compound:FGFR inhibitors'], [u'compound:ZK304709'], [u'compound:CID44414674'], [u'compound:CID6444692'], [u'compound:SID160728400'], [u'compound:SID53789678'], [u'compound:CHEMBL1743063'], [u'compound:CID11364421'], [u'compound:SID160698526'], [u'compound:PMED-1'], [u'compound:AVID100'], [u'compound:CID71678098'], [u'compound:CHEMBL1743013'], [u'compound:CID63306'], [u'compound:CID9934347'], [u'compound:CID5757'], [u'compound:CID11598628'], [u'compound:CID121231412'], [u'compound:CWP232291'], [u'compound:DETD-35'], [u'compound:SYM004'], [u'compound:CLM3'], [u'compound:SID85239368'], [u'compound:CID11984561'], [u'compound:AC0010MA'], [u'compound:BC21'], [u'compound:CID1983'], [u'compound:CID3100'], [u'compound:CID57748689'], [u'compound:iCRT-14'], [u'compound:CID18411393'], [u'compound:CID44607530'], [u'compound:CID5289575'], [u'compound:INCB054828'], [u'compound:HS-10296'], [u'compound:CGP049090'], [u'compound:SID56312453'], [u'compound:CID141643'], [u'compound:CID5039'], [u'compound:CID78209992'], [u'compound:SID819210'], [u'compound:CCT031374'], [u'compound:CID4192'], [u'compound:CID54678486'], [u'compound:CID121408882'], [u'compound:CHEMBL3545234'], [u'compound:CID10430360'], [u'compound:AR inhibitor next gens'], [u'compound:iCRT-5'], [u'compound:SID160773956'], [u'compound:SID71465'], [u'compound:CID9949641'], [u'compound:SAR428926'], [u'compound:VT-464'], [u'compound:NC043'], [u'compound:CID24833568'], [u'compound:ER2'], [u'compound:PKF115-584'], [u'compound:SID160760837'], [u'compound:DS-8201a'], [u'compound:Tensirolimus (MTOR inhibitor)'], [u'compound:SID3341'], [u'compound:SID160761887'], [u'compound:CHEMBL2108309'], [u'compound:CID16135625'], [u'compound:CHEMBL2109556'], [u'compound:JW67'], [u'compound:CID5865'], [u'compound:CHEMBL2109422'], [u'compound:CID9796590'], [u'compound:PARP inhibitor + Chemotherapys'], [u'compound:MF tricyclic'], [u'compound:CID638277'], [u'compound:CHEMBL608533'], [u'compound:CID1548887'], [u'compound:IDH305'], [u'compound:CID2969'], [u'compound:GC1118'], [u'compound:CID3005573'], [u'compound:CID77328'], [u'compound:CID3009'], [u'compound:ZW25'], [u'compound:CID44588748'], [u'compound:CID44397436'], [u'compound:CID20473337'], [u'compound:CID6175'], [u'compound:CID121322599'], [u'compound:CID6445562'], [u'compound:CID25023871'], [u'compound:CHEMBL234619'], [u'compound:CID50515'], [u'compound:SID586298'], [u'compound:CID68853159'], [u'compound:CID11347535'], [u'compound:CID44418368'], [u'compound:CID44452446'], [u'compound:CHEMBL3545290'], [u'compound:CID443752'], [u'compound:CHEMBL3545002'], [u'compound:CID9808844'], [u'compound:CID10458325'], [u'compound:Surgery'], [u'compound:ASP5878'], [u'compound:CID72199293'], [u'compound:SID7890382'], [u'compound:CID73425588'], [u'compound:CID3372016'], [u'compound:LXH 254 + PDR001'], [u'compound:LXH 254'], [u'compound:CID11646777'], [u'compound:MTOR kinase inhibitors'], [u'compound:CID24989044'], [u'compound:SID160740953'], [u'compound:PI3K pathway inhibitor (alone or in combination)s'], [u'compound:CID121232390'], [u'compound:CID444732'], [u'compound:CID10437018'], [u'compound:CID5284537'], [u'compound:CID4493'], [u'compound:SID123051098'], [u'compound:CID25099184'], [u'compound:CID24905147'], [u'compound:CID3086599'], [u'compound:FIIN-2'], [u'compound:CID2161'], [u'compound:CID6057'], [u'compound:CID44219749'], [u'compound:CID45112556'], [u'compound:BNC101'], [u'compound:CID16118392'], [u'compound:SYD985'], [u'compound:SID160750289'], [u'compound:MFGR1877S'], [u'compound:CID78323434'], [u'compound:CID3749'], [u'compound:CID11349170'], [u'compound:CID53297465'], [u'compound:PRN1109'], [u'compound:CID9811177'], [u'compound:CID24808138'], [u'compound:RG7356'], [u'compound:A-1210477 + WEHI-539'], [u'compound:SID160734990'], [u'compound:SID585553'], [u'compound:JANEX-1'], [u'compound:CID45271217'], [u'compound:CID9874913'], [u'compound:A-1155463'], [u'compound:NAX014'], [u'compound:CID45263524'], [u'compound:CID10090750'], [u'compound:PT2385'], [u'compound:CID24875306'], [u'compound:CID5487'], [u'compound:cc223'], [u'compound:CID46843057'], [u'compound:CID44414883'], [u'compound:CID13371973'], [u'compound:CID11188409'], [u'compound:CHEMBL2108184'], [u'compound:CID3657'], [u'compound:CID3325'], [u'compound:CLR457'], [u'compound:CID2779853'], [u'compound:SID824926'], [u'compound:CID11671467'], [u'compound:CID16086422'], [u'compound:CID104758'], [u'compound:CID44521040'], [u'compound:CID1044'], [u'compound:CID9801811'], [u'compound:CID44418317'], [u'compound:GS-9820'], [u'compound:CID44187367'], [u'compound:Tensirolimus + Chemotherapy (MTOR inhibitor + Chemotherapy)'], [u'compound:CID2724385'], [u'compound:CID683379'], [u'compound:CID25141061'], [u'compound:CID72165228'], [u'compound:CID5284513'], [u'compound:OP449'], [u'compound:CID46231908'], [u'compound:BI 754111'], [u'compound:BI 754091'], [u'compound:SID7887423'], [u'compound:CID237'], [u'compound:CID369976'], [u'compound:CID845'], [u'compound:SH-1242'], [u'compound:PW12'], [u'compound:CHEBI:82758'], [u'compound:CID16136245'], [u'compound:CID5284603'], [u'compound:CID5284596'], [u'compound:CID158782'], [u'compound:CHEMBL2109191'], [u'compound:CID160355'], [u'compound:CID444231'], [u'compound:CID5351307'], [u'compound:SID87150'], [u'compound:CID2468'], [u'compound:CID72120'], [u'compound:CHEMBL2108484'], [u'compound:CID68740'], [u'compound:CID23195555'], [u'compound:CP-31398'], [u'compound:CID3366'], [u'compound:CID3002360'], [u'compound:CID11249084'], [u'compound:CHEMBL1743018'], [u'compound:MVAp53'], [u'compound:CID4748'], [u'compound:CID985'], [u'compound:CID5073'], [u'compound:CID60795'], [u'compound:CID10889'], [u'compound:CID115237'], [u'compound:CHEBI:7735'], [u'compound:CID5002'], [u'compound:CID3559'], [u'compound:CID121596091'], [u'compound:KTN0073-IgG1'], [u'compound:Xilonix'], [u'compound:CHEMBL2108429'], [u'compound:CID681'], [u'compound:CID5282105'], [u'compound:RO6839921'], [u'compound:CID128355'], [u'compound:CHEMBL1201580'], [u'compound:CID5311382'], [u'compound:CID6992089'], [u'compound:CID58641927'], [u'compound:CID28179'], [u'compound:SID49972344'], [u'compound:CID53476877'], [u'compound:CID44397532'], [u'compound:Tankyrase inhibitors'], [u'compound:SID830441'], [u'compound:CID5351387'], [u'compound:CID9848137'], [u'compound:CHEMBL3545358'], [u'compound:CID5288674'], [u'compound:CHEMBL3545158'], [u'compound:CHEMBL3545005'], [u'compound:CHEMBL553939'], [u'compound:CID25061752'], [u'compound:CID983'], [u'compound:CID5350'], [u'compound:CID3085092'], [u'compound:SID7887360'], [u'compound:VS-6063'], [u'compound:CID446157'], [u'compound:CID20279'], [u'compound:CID22291652'], [u'compound:CHEMBL3137347'], [u'compound:CID3365'], [u'compound:CID285033'], [u'compound:CID11152667'], [u'compound:SEL201'], [u'compound:CID10090485'], [u'compound:CID8180'], [u'compound:CID16725726'], [u'compound:SID178103950'], [u'compound:SID160723640'], [u'compound:CID5469318'], [u'compound:CID16066147'], [u'compound:CID3108'], [u'compound:CHEMBL932'], [u'compound:CID259331'], [u'compound:Mo(Vi)(=O)(Oh)2 Cluster'], [u'compound:CID11485656'], [u'compound:CID14777'], [u'compound:CID3599'], [u'compound:SN-38'], [u'compound:CHEMBL1201594'], [u'compound:INCB028060'], [u'compound:CID11526671'], [u'compound:CID46215462'], [u'compound:CHEMBL1201566'], [u'compound:CHEMBL3301579'], [u'compound:CID10762685'], [u'compound:CID3652'], [u'compound:AT-7867'], [u'compound:SID340590236'], [u'compound:CB-5083'], [u'compound:CID46214930'], [u'compound:CHEMBL1743087'], [u'compound:CID160254'], [u'compound:CID4162'], [u'compound:CID44298790'], [u'compound:CID20761503'], [u'compound:SID423122'], [u'compound:PDR001'], [u'compound:CID11284169'], [u'compound:CID9047'], [u'compound:CID46207586'], [u'compound:INCB050465'], [u'compound:CHEMBL3545369'], [u'compound:CHEMBL2108060'], [u'compound:CID1140'], [u'compound:PF-06747775  '], [u'compound:CID92144'], [u'compound:CHEMBL2109248'], [u'compound:CID24812717'], [u'compound:CID68289010'], [u'compound:CHEMBL2109498'], [u'compound:CID2141'], [u'compound:SID160764702'], [u'compound:CHEMBL1201834'], [u'compound:CID6918260'], [u'compound:CID5328779'], [u'compound:CID18369'], [u'compound:CHEMBL3707398'], [u'compound:CID702'], [u'compound:CID14054642'], [u'compound:CID10182969'], [u'compound:CHEMBL1201458'], [u'compound:CHEMBL2108927'], [u'compound:CID5957'], [u'compound:CHEMBL3545071'], [u'compound:SID75754455'], [u'compound:CHEMBL1201439'], [u'compound:CHEMBL2109369'], [u'compound:CID6468'], [u'compound:CID44581605'], [u'compound:CID2022'], [u'compound:CID60773'], [u'compound:CID71481097'], [u'compound:CID12035'], [u'compound:CID6917864'], [u'compound:CHEMBL3301588'], [u'compound:CID11534420'], [u'compound:CID24856041'], [u'compound:CID11213558'], [u'compound:SID252166614'], [u'compound:CHEMBL2109272'], [u'compound:CID392622'], [u'compound:CID7924'], [u'compound:CID7870'], [u'compound:CID439693'], [u'compound:CID5749'], [u'compound:SID160761408'], [u'compound:HSCT'], [u'compound:CID636397'], [u'compound:CHEMBL2108100'], [u'compound:CID64143'], [u'compound:CHEMBL1743040'], [u'compound:CHEMBL1743088'], [u'compound:CID17758104'], [u'compound:ALRN-6924'], [u'compound:CID5281004'], [u'compound:CHEMBL1909303'], [u'compound:Pm-060184'], [u'compound:CID6305'], [u'compound:CID6241978'], [u'compound:CID8515'], [u'compound:CID11343137'], [u'compound:CID11955855'], [u'compound:CID92253'], [u'compound:CID56931136'], [u'compound:Allotransplantation'], [u'compound:MK-8745'], [u'compound:CID2474'], [u'compound:CID10198924'], [u'compound:CID57662985'], [u'compound:CID192784'], [u'compound:unspecified PD-1 antibody'], [u'compound:BLU-667'], [u'compound:CID44409984'], [u'compound:CID6102762'], [u'compound:CID3440'], [u'compound:CID44424933'], [u'compound:CHEMBL1201200'], [u'compound:CHEMBL2105868'], [u'compound:CID9952884'], [u'compound:AFM24'], [u'compound:CHEMBL2109433'], [u'compound:CID26945'], [u'compound:CHEMBL3545012'], [u'compound:CID64147'], [u'compound:CHEMBL1237022'], [u'compound:CID6274'], [u'compound:SYM004 + Radiotherapy'], [u'compound:CHEMBL1200758'], [u'compound:CHEMBL223620'], [u'compound:CID11973736'], [u'compound:CHEMBL2109149'], [u'compound:CHEMBL2109212'], [u'compound:CHEMBL2108174'], [u'compound:CHEMBL2109350'], [u'compound:CHEMBL2107856'], [u'compound:CID3383'], [u'compound:CID4633'], [u'compound:CID9812534'], [u'compound:CID26879'], [u'compound:CID219078'], [u'compound:CID219100'], [u'compound:CHEMBL1201610'], [u'compound:CID3676'], [u'compound:CID58507717'], [u'compound:CID57469'], [u'compound:HER2 BATs'], [u'compound:CID91663289'], [u'compound:CID1349907'], [u'compound:PF-03512676'], [u'compound:CID44182295'], [u'compound:CPUY201112'], [u'compound:Si306 + Radiotherapy'], [u'compound:Vs-6063'], [u'compound:CID16202132'], [u'compound:CHEMBL3545121'], [u'compound:CID4173'], [u'compound:CID2764'], [u'compound:CID11351021'], [u'compound:CHEMBL3545153'], [u'compound:PT2977'], [u'compound:CHEMBL1742991'], [u'compound:CID53309'], [u'compound:CHEMBL2108615'], [u'compound:CID44397533'], [u'compound:Pf-03084014'], [u'compound:CHEMBL2108569'], [u'compound:CHEBI:63608'], [u'compound:Mk-4827'], [u'compound:CID1221'], [u'compound:CID9924495'], [u'compound:CID53319062'], [u'compound:CHEMBL2108707'], [u'compound:CID5281884'], [u'compound:CID129721788'], [u'compound:CID5756'], [u'compound:I-CBP112'], [u'compound:CID437740'], [u'compound:CID3081349'], [u'compound:CID594'], [u'compound:CID151194'], [u'compound:CID54682876'], [u'compound:CID13559281'], [u'compound:CID51039094'], [u'compound:MK-8242'], [u'compound:CHEMBL3545021'], [u'compound:CID9917968'], [u'compound:CID5356520'], [u'compound:SID135332468'], [u'compound:CID3510'], [u'compound:sipuleucel-T'], [u'compound:CID5353627'], [u'compound:CID50981'], [u'compound:CID44452687'], [u'compound:CID70983932'], [u'compound:CID2895'], [u'compound:PNT2258'], [u'compound:CID4649'], [u'compound:CID6505803'], [u'compound:SID136023800'], [u'compound:CID69894253'], [u'compound:Linsitnib'], [u'compound:GSK2302032A'], [u'compound:CID154059'], [u'compound:CID2803'], [u'compound:CTL019'], [u'compound:CID445639'], [u'compound:CID2337'], [u'compound:CID71160'], [u'compound:SID50016869'], [u'compound:CID11570805'], [u'compound:CHEMBL3039543'], [u'compound:CID9904'], [u'compound:CID20055360'], [u'compound:CID65997'], [u'compound:CID9800306'], [u'compound:CHEMBL1743059'], [u'compound:LZM009'], [u'compound:CID33042'], [u'compound:CID72551585'], [u'compound:CID16186062'], [u'compound:CID16063245'], [u'compound:AZ6089'], [u'compound:CID5035'], [u'compound:CID45271218'], [u'compound:CID6251'], [u'compound:CID39214'], [u'compound:CHEMBL2108682'], [u'compound:CID6918296'], [u'compound:Immune globulin'], [u'compound:CHEMBL2108268'], [u'compound:CID984'], [u'compound:CID612'], [u'compound:CHEMBL1201136'], [u'compound:CID5780'], [u'compound:CID171548'], [u'compound:CID10096344'], [u'compound:CHEMBL1201835'], [u'compound:CID88733505'], [u'compound:Rovalpituzumab'], [u'compound:CHEMBL1201636'], [u'compound:SID50087153'], [u'compound:CHEMBL2109500'], [u'compound:A-395'], [u'compound:CHEMBL2109388'], [u'compound:CHEMBL1201833'], [u'compound:CHEMBL1201832'], [u'compound:CID3715'], [u'compound:CID23925'], [u'compound:CID40467057'], [u'compound:CID3883'], [u'compound:CID84029'], [u'compound:CID16070111'], [u'compound:CHEMBL2109553'], [u'compound:CID9838022'], [u'compound:CID5288826'], [u'compound:CID55245'], [u'compound:CID11348'], [u'compound:SAR566658'], [u'compound:CHEMBL1201570'], [u'compound:CID4842'], [u'compound:CID2182'], [u'compound:CID11561674'], [u'compound:CID60160561'], [u'compound:CID5881'], [u'compound:SID160715390'], [u'compound:CID16117309'], [u'compound:At-13387'], [u'compound:CHEMBL1201532'], [u'compound:CID6997289'], [u'compound:CID11414799'], [u'compound:DCVax'], [u'compound:CID2353'], [u'compound:CID10813524'], [u'compound:CID5280453'], [u'compound:CID47576'], [u'compound:CID3345'], [u'compound:BI 754091 + BI 891065'], [u'compound:BI 891065'], [u'compound:CHEMBL2364651'], [u'compound:CID2719'], [u'compound:SID135328924'], [u'compound:CID2913'], [u'compound:CID54687'], [u'compound:CID10152654'], [u'compound:CHEMBL1201831'], [u'compound:CID70689354'], [u'compound:CID10180'], [u'compound:CID6918574'], [u'compound:CID62690'], [u'compound:DS-8201A'], [u'compound:CID5789'], [u'compound:CID9936746'], [u'compound:CHEMBL3544959'], [u'compound:CID3001165'], [u'compound:CID164475'], [u'compound:CID2972'], [u'compound:CID11998974'], [u'compound:CHEMBL2108628'], [u'compound:CID6915835'], [u'compound:CID5486971'], [u'compound:CHEMBL1743041'], [u'compound:CID68791'], [u'compound:CID24864821'], [u'compound:CID23626325'], [u'compound:CID3037617'], [u'compound:CID65626'], [u'compound:CID104755'], [u'compound:CID443872'], [u'compound:CHEMBL1200553'], [u'compound:CHEMBL55643'], [u'compound:CID24087'], [u'compound:CHEMBL2108955'], [u'compound:CID977'], [u'compound:SID12015398'], [u'compound:Vtx-2337'], [u'compound:CID13109'], [u'compound:CID24800541'], [u'compound:CID24963749'], [u'compound:CID10629256'], [u'compound:CID54675769'], [u'compound:CHEMBL2109414'], [u'compound:CID45271208'], [u'compound:CID5462311'], [u'compound:CID33036'], [u'compound:CHEMBL2107571'], [u'compound:CID5280961'], [u'compound:SID162169437'], [u'compound:SID347910255'], [u'compound:CID156419'], [u'compound:CID131204'], [u'compound:CID25419'], [u'compound:CID49863782'], [u'compound:CID4594'], [u'compound:SID201499660'], [u'compound:CID3002812'], [u'compound:SID347909980'], [u'compound:CID454216'], [u'compound:CHEMBL1201420'], [u'compound:SID350082695'], [u'compound:CHEMBL2109293'], [u'compound:CID2756'], [u'compound:tanibirumab'], [u'compound:CID5287541'], [u'compound:CID6503'], [u'compound:CHEMBL2107917'], [u'compound:CID51038316'], [u'compound:CHEBI:50694'], [u'compound:CHEMBL1743015'], [u'compound:CID9832447'], [u'compound:Pf-04449913'], [u'compound:CID44295770'], [u'compound:CID3005516'], [u'compound:CHEMBL1201723'], [u'compound:SID46506183'], [u'compound:CID5946'], [u'compound:CHEBI:9334'], [u'compound:SCT200'], [u'compound:Bbi503'], [u'compound:CID25077993'], [u'compound:CID447834'], [u'compound:CID5839'], [u'compound:CID40466924'], [u'compound:S-1'], [u'compound:CID3821'], [u'compound:CID2160'], [u'compound:CID2284'], [u'compound:CID50225'], [u'compound:CHEMBL2109196'], [u'compound:CHEMBL1743073'], [u'compound:CID11672602'], [u'compound:CID12560'], [u'compound:CID3000226'], [u'compound:SID315661192'], [u'compound:CID21704'], [u'compound:CHEMBL2107866'], [u'compound:CHEMBL1201646'], [u'compound:SID223366081'], [u'compound:CHEMBL3707324'], [u'compound:CID9927009'], [u'compound:CID6288'], [u'compound:CID5951'], [u'compound:LY3076226'], [u'compound:CID7048523'], [u'compound:CID90661524'], [u'compound:CID108189'], [u'compound:CID9838712'], [u'compound:CHEBI:135875'], [u'compound:SID135296477'], [u'compound:CID16739650'], [u'compound:CHEMBL1201481'], [u'compound:CID6992028'], [u'compound:CHEMBL452'], [u'compound:SID107473'], [u'compound:CID2802'], [u'compound:CID44325135'], [u'compound:CID108143'], [u'compound:CR1447'], [u'compound:SID252166615'], [u'compound:CID6420138'], [u'compound:CID159603'], [u'compound:CID5310939'], [u'compound:CID44452498'], [u'compound:CID23009'], [u'compound:CID6992087'], [u'compound:CHEMBL1743043'], [u'compound:SID46505347'], [u'compound:CID44575851'], [u'compound:CID3152'], [u'compound:CID4158'], [u'compound:CID5206'], [u'compound:CID4943'], [u'compound:CHEBI:16684'], [u'compound:CID5523'], [u'compound:CID260'], [u'compound:CID4456'], [u'compound:CHEMBL2110563'], [u'compound:CID3033'], [u'compound:CHEMBL2108567'], [u'compound:CHEMBL1201650'], [u'compound:CHEMBL1743050'], [u'compound:CHEMBL2107846'], [u'compound:CID54677470'], [u'compound:CID34755'], [u'compound:CID53232'], [u'compound:CHEMBL2218885'], [u'compound:CHEMBL444172'], [u'compound:CHEMBL2108704'], [u'compound:CID5198'], [u'compound:CID5833'], [u'compound:CID68517380'], [u'compound:CID60606'], [u'compound:CHEMBL1201581'], [u'compound:CHEBI:17268'], [u'compound:CID11081452'], [u'compound:CID2520'], [u'compound:CID5278396'], [u'compound:CID54606507'], [u'compound:CID4679'], [u'compound:CID9690109'], [u'compound:CID10909430'], [u'compound:CHEMBL1201823'], [u'compound:Si306'], [u'compound:CID25025298'], [u'compound:SID53790665'], [u'compound:CID18347869'], [u'compound:CID3036905'], [u'compound:CHEMBL1742999'], [u'compound:CID57363'], [u'compound:CID49867930'], [u'compound:SID838285'], [u'compound:CID300471'], [u'compound:CHEMBL401930'], [u'compound:CID68029831'], [u'compound:CID57336745'], [u'compound:CID9804992'], [u'compound:BAY1082439'], [u'compound:CID5488034'], [u'compound:CID5231474'], [u'compound:CID6918408'], [u'compound:CID5381'], [u'compound:SID160775532'], [u'compound:CID23535193'], [u'compound:CHEMBL2108601'], [u'compound:CID962'], [u'compound:CID49778916'], [u'compound:CID4369359'], [u'compound:CID4030'], [u'compound:CID58744432'], [u'compound:CID5329'], [u'compound:CID5578'], [u'compound:KU-60019'], [u'compound:CID6167'], [u'compound:SID347909978'], [u'compound:CID5994'], [u'compound:CID16231'], [u'compound:CHEMBL2109374'], [u'compound:CID16741245'], [u'compound:unspecified VEGFR2 antibody'], [u'compound:CID129279'], [u'compound:CID49836020'], [u'compound:CHEMBL1743022'], [u'compound:CID6436086'], [u'compound:SID160752258'], [u'compound:CHEMBL2108029'], [u'compound:SID53790798'], [u'compound:CHEBI:49005'], [u'compound:CID49867926'], [u'compound:CHEMBL1201645'], [u'compound:SID160745089'], [u'compound:CID9568614'], [u'compound:CHEMBL2108288'], [u'compound:CID1548943'], [u'compound:CID667476'], [u'compound:CID5360515'], [u'compound:PLX9486'], [u'compound:JCAR015'], [u'compound:CID11545250'], [u'compound:CID6712744'], [u'compound:CID46874763'], [u'compound:CHEMBL3544928'], [u'compound:CID46889286'], [u'compound:CID5288209'], [u'compound:CID9852188'], [u'compound:CID9935639'], [u'compound:CHEMBL3544967'], [u'compound:SID50048431'], [u'compound:CHEMBL1201519'], [u'compound:SID118207664'], [u'compound:CID18931838'], [u'compound:CID5318432'], [u'compound:CID5284604'], [u'compound:CID3958'], [u'compound:CHEMBL2109471'], [u'compound:CID57050'], [u'compound:A-443654'], [u'compound:CID790'], [u'compound:SID252827373'], [u'compound:CID3308'], [u'compound:CHEMBL3545230'], [u'compound:MI-63'], [u'compound:YW3-56'], [u'compound:CID3000543'], [u'compound:CID71616'], [u'compound:CHEMBL2108345'], [u'compound:CID10435235'], [u'compound:CID65999'], [u'compound:CID44814409'], [u'compound:CID50905713'], [u'compound:CID107970'], [u'compound:Reolysin'], [u'compound:CID4205'], [u'compound:CHEMBL2367706'], [u'compound:CHEMBL1201625'], [u'compound:CID56842118'], [u'compound:CID11609586'], [u'compound:CID152946'], [u'compound:CID175805'], [u'compound:CID41693'], [u'compound:CID6456014'], [u'compound:CID447043'], [u'compound:AZD9150'], [u'compound:CID4510'], [u'compound:CID44214'], [u'compound:NBTXR3'], [u'compound:PK11007'], [u'compound:CID10798271'], [u'compound:CID6021'], [u'compound:CID9796936'], [u'compound:CID16678086'], [u'compound:CID46847888'], [u'compound:CID3446'], [u'compound:CID118502708'], [u'compound:CID9822548'], [u'compound:CID2771'], [u'compound:CID4113'], [u'compound:CID6438163'], [u'compound:LY2780301'], [u'compound:CID44390973'], [u'compound:CHEMBL1201605'], [u'compound:CHEMBL2109427'], [u'compound:CID28417'], [u'compound:CID7855'], [u'compound:CID3675'], [u'compound:CID108092'], [u'compound:KTN0073-IgG2'], [u'compound:LAG525'], [u'compound:CID122873'], [u'compound:CID4740'], [u'compound:CID5280980'], [u'compound:CHEMBL2364659'], [u'compound:CID49855250'], [u'compound:CID15547703'], [u'compound:RN-1'], [u'compound:CID12459492'], [u'compound:GSK690'], [u'compound:CID6230'], [u'compound:CHEMBL1863515'], [u'compound:CID4900448'], [u'compound:CID53492877'], [u'compound:SID80742707'], [u'compound:CID6436173'], [u'compound:CID5910'], [u'compound:CID23582824'], [u'compound:CID124087'], [u'compound:CID614'], [u'compound:CID121841'], [u'compound:CID71727581'], [u'compound:Talacotuzumab'], [u'compound:CID4495'], [u'compound:CID86289437'], [u'compound:CID69020'], [u'compound:CID157922'], [u'compound:CHEMBL3544958'], [u'compound:CID8376'], [u'compound:CID31307'], [u'compound:CHEMBL1201825'], [u'compound:CID439260'], [u'compound:CID11622909'], [u'compound:CHEMBL2108683'], [u'compound:CID1050'], [u'compound:SID223370340'], [u'compound:SID135282346'], [u'compound:CID44205240'], [u'compound:CID11660296'], [u'compound:CHEMBL1743032'], [u'compound:CID159594'], [u'compound:CID100094'], [u'compound:CID25077495'], [u'compound:CID97226'], [u'compound:CID3348'], [u'compound:CID155435'], [u'compound:GS-9973'], [u'compound:CID60835'], [u'compound:SID13644'], [u'compound:CID5288622'], [u'compound:MBG453'], [u'compound:bb2121'], [u'compound:CHEMBL2109570'], [u'compound:CID65702'], [u'compound:CID5281828'], [u'compound:CHEMBL3137346'], [u'compound:CID439998'], [u'compound:CID6802'], [u'compound:CID25263420'], [u'compound:CID5312109'], [u'compound:CID3002363'], [u'compound:CID60860'], [u'compound:CHEMBL2108811'], [u'compound:CID6432'], [u'compound:CHEMBL3545320'], [u'compound:CID110635'], [u'compound:CID3157'], [u'compound:CID44454662'], [u'compound:CHEMBL2109381'], [u'compound:CHEMBL3545111'], [u'compound:CID9642'], [u'compound:CID476009'], [u'compound:CID3739'], [u'compound:CID445557'], [u'compound:CID5311051'], [u'compound:CID5995'], [u'compound:CID9939018'], [u'compound:CID56841556'], [u'compound:CHEMBL1743080'], [u'compound:CID9865528'], [u'compound:CHEMBL1743039'], [u'compound:CID6560167'], [u'compound:CID5215'], [u'compound:CHEMBL2108063'], [u'compound:CID46239015'], [u'compound:CHEMBL2109506'], [u'compound:CHEMBL1743005'], [u'compound:CID444'], [u'compound:CID72277'], [u'compound:CID10943853'], [u'compound:CID9874592'], [u'compound:CID2179'], [u'compound:CID4054'], [u'compound:CID2995'], [u'compound:CID11540590'], [u'compound:SID7886740'], [u'compound:CID440317'], [u'compound:Cytotoxic T Lymphocytes'], [u'compound:CID4761'], [u'compound:CID73995022'], [u'compound:SID135305999'], [u'compound:BP-31510'], [u'compound:CID3339'], [u'compound:CID5591'], [u'compound:CID9868980'], [u'compound:CID472335'], [u'compound:CID60490'], [u'compound:CID14749'], [u'compound:CID5282430'], [u'compound:CID6918548'], [u'compound:CID151115'], [u'compound:CID70689356'], [u'compound:CID1775'], [u'compound:CID11203579'], [u'compound:CID44427179'], [u'compound:CID72231'], [u'compound:CID6480592'], [u'compound:CID777184'], [u'compound:CHEMBL1201460'], [u'compound:CID9782'], [u'compound:SID835025'], [u'compound:CID6956357'], [u'compound:CID101524'], [u'compound:CID70691438'], [u'compound:CID10029385'], [u'compound:SID46505650'], [u'compound:CID123628'], [u'compound:CID4114'], [u'compound:CID164509'], [u'compound:CID2955'], [u'compound:SID135361089'], [u'compound:CID5362440'], [u'compound:CID445621'], [u'compound:CID11865407'], [u'compound:CID3961'], [u'compound:CID40466887'], [u'compound:CHEMBL3545428'], [u'compound:AMC303'], [u'compound:RO7009789'], [u'compound:CID179337'], [u'compound:CID9871074'], [u'compound:CID9008'], [u'compound:CID16212154'], [u'compound:CHEMBL3545145'], [u'compound:CID72435'], [u'compound:CID938'], [u'compound:CID44390975'], [u'compound:CID11338033'], [u'compound:DKN-01'], [u'compound:CID454194'], [u'compound:CID9561005'], [u'compound:CID6918429'], [u'compound:CID4282'], [u'compound:MGA012'], [u'compound:HM95573'], [u'compound:SID17403923'], [u'compound:CHEBI:32269'], [u'compound:CHEMBL2108466'], [u'compound:CID153970'], [u'compound:CID10584166'], [u'compound:SID13530'], [u'compound:CID5288393'], [u'compound:CID5281672'], [u'compound:CID10607'], [u'compound:CID439709'], [u'compound:CID77999'], [u'compound:CHEMBL2104970'], [u'compound:CHEMBL2109678'], [u'compound:CID162525'], [u'compound:CID70681489'], [u'compound:CID20469'], [u'compound:CID8225'], [u'compound:CHEMBL2109416'], [u'compound:CHEMBL3545281'], [u'compound:CID22128'], [u'compound:CID123805'], [u'compound:Hu5F9-G4'], [u'compound:LXH254'], [u'compound:CID10160238'], [u'compound:SID49856346'], [u'compound:CID5852'], [u'compound:GSK2820151'], [u'compound:CID5281040'], [u'compound:CHEMBL1201867'], [u'compound:CID10288822'], [u'compound:CID45138953'], [u'compound:CID2519'], [u'compound:DT388IL3'], [u'compound:CID6144'], [u'compound:CID5363269'], [u'compound:CID49799977'], [u'compound:CID71543332'], [u'compound:CID44290720'], [u'compound:CHEMBL3545105'], [u'compound:CID3415'], [u'compound:CID54580717'], [u'compound:CHEBI:30146'], [u'compound:CHEMBL2107967'], [u'compound:CID57990869'], [u'compound:CID44093'], [u'compound:CID446727'], [u'compound:CHEMBL1201414'], [u'compound:CHEMBL2109357'], [u'compound:CID9863341'], [u'compound:CID130731'], [u'compound:Hemay020'], [u'compound:CID92727'], [u'compound:Ds-3032b'], [u'compound:Bay1163877'], [u'compound:Bal101553'], [u'compound:Simmiparib'], [u'compound:CID5311068'], [u'compound:CID16157882'], [u'compound:CID638024'], [u'compound:CID44454691'], [u'compound:DBPR112'], [u'compound:CID25167017'], [u'compound:Mk-0752'], [u'compound:CID9549213'], [u'compound:CID123964'], [u'compound:CID10195666'], [u'compound:CID148189'], [u'compound:CHEMBL2068504'], [u'compound:CID2585'], [u'compound:CID42631267'], [u'compound:Epstein-barr virus'], [u'compound:CHEMBL1743027'], [u'compound:HSV-1716'], [u'compound:CID25191001'], [u'compound:CID71398'], [u'compound:CHEMBL3545025'], [u'compound:CID476861'], [u'compound:Ssr97225'], [u'compound:CID9916058'], [u'compound:CID16658243'], [u'compound:RO7198457'], [u'compound:Pf-0562271'], [u'compound:CID24873520'], [u'compound:SID310264712'], [u'compound:CID447268'], [u'compound:CID50922691'], [u'compound:Hemay022'], [u'compound:CID9910224'], [u'compound:RO6958688'], [u'compound:CID4775'], [u'compound:CID71306891'], [u'compound:ASN007'], [u'compound:CID2153'], [u'compound:CID6101'], [u'compound:CID5090'], [u'compound:CID54746'], [u'compound:CHEMBL1201515'], [u'compound:CHEMBL3545015'], [u'compound:CID2826718'], [u'compound:CID60846'], [u'compound:CID153941'], [u'compound:Romyelocel-L'], [u'compound:CID52945526'], [u'compound:CID23667301'], [u'compound:CID5311505'], [u'compound:CID3899'], [u'compound:CID5362065'], [u'compound:REGN1979'], [u'compound:CID5288382'], [u'compound:CID24993189'], [u'compound:CID11427553'], [u'compound:CID6857474'], [u'compound:CHEMBL3545050'], [u'compound:CID7099'], [u'compound:CID11957724'], [u'compound:CHEMBL2108252'], [u'compound:INCB54329'], [u'compound:CHEMBL1743067'], [u'compound:GT0918'], [u'compound:CID516805'], [u'compound:CID146570'], [u'compound:CID44454716'], [u'compound:CHEMBL2109053'], [u'compound:CID16004692'], [u'compound:Genz-644282'], [u'compound:CID23658600'], [u'compound:CID44452415'], [u'compound:SID49962239'], [u'compound:CID3372'], [u'compound:CID10635'], [u'compound:CHEMBL1689060'], [u'compound:DT2219ARL'], [u'compound:SID135353387'], [u'compound:CID11610113'], [u'compound:CID86291103'], [u'compound:SID4538'], [u'compound:CHEMBL2108244'], [u'compound:CID9917021'], [u'compound:CID445154'], [u'compound:CID5324346'], [u'compound:CID119828'], [u'compound:CID9808998'], [u'compound:NIS793'], [u'compound:RG 7882'], [u'compound:CID14358'], [u'compound:CID281'], [u'compound:SID340590220'], [u'compound:CID8969'], [u'compound:CID444499'], [u'compound:CHEMBL2108645'], [u'compound:CID767'], [u'compound:MEDI0639'], [u'compound:CHEMBL16694'], [u'compound:CID42113'], [u'compound:CID18283'], [u'compound:CID9794247'], [u'compound:CID16155604'], [u'compound:CID11647372'], [u'compound:CID44418331'], [u'compound:CHEMBL2109489'], [u'compound:CHEMBL2109337'], [u'compound:P1446a-05'], [u'compound:Hu3F8'], [u'compound:CHEMBL3545156'], [u'compound:V930'], [u'compound:CID62751'], [u'compound:BTCT4465A'], [u'compound:CID4912'], [u'compound:DS-6051b'], [u'compound:CID3080'], [u'compound:CID176885'], [u'compound:CID59757974'], [u'compound:BAY1143572'], [u'compound:CID6918508'], [u'compound:CID9908389'], [u'compound:BI 836845'], [u'compound:CID3373'], [u'compound:CID4906'], [u'compound:CID9294'], [u'compound:CID60815'], [u'compound:JCAR017'], [u'compound:CHEMBL2108061'], [u'compound:Pl225b'], [u'compound:DI-B4'], [u'compound:CID23649181'], [u'compound:SID53787773'], [u'compound:IMGN289'], [u'compound:BAY1179470 '], [u'compound:CHEMBL2108742'], [u'compound:CID44449753'], [u'compound:GSK2857916'], [u'compound:sevacizumab'], [u'compound:CID27902'], [u'compound:CID44595079'], [u'compound:CHEMBL3545284'], [u'compound:CID5505'], [u'compound:COTI-2'], [u'compound:SID249565664'], [u'compound:CHEMBL3545217'], [u'compound:Herpes zoster'], [u'compound:CID51348455'], [u'compound:AZD5312'], [u'compound:CID5287614'], [u'compound:CID10412773'], [u'compound:CID6475492'], [u'compound:CID9888123'], [u'compound:CA-170'], [u'compound:CID72199895'], [u'compound:CHEMBL3544933'], [u'compound:CV-9202'], [u'compound:CID11210478'], [u'compound:SID83063'], [u'compound:IGN002'], [u'compound:D2C7-IT'], [u'compound:CID340558'], [u'compound:CID34312'], [u'compound:CID56339'], [u'compound:CID4763'], [u'compound:CID4909'], [u'compound:CID2554'], [u'compound:CID4993'], [u'compound:SHR3680'], [u'compound:VXM01'], [u'compound:LTT462'], [u'compound:SHR6390'], [u'compound:CID25190765'], [u'compound:CID57413968'], [u'compound:CID17648'], [u'compound:CID56840960'], [u'compound:CID4436'], [u'compound:CID70688382'], [u'compound:PD-332991'], [u'compound:SID26675683'], [u'compound:CID2929'], [u'compound:CHEMBL3544961'], [u'compound:CID121412508'], [u'compound:CHEMBL2109574'], [u'compound:CHEMBL2109525'], [u'compound:CHEMBL3544963'], [u'compound:CHEMBL3545078'], [u'compound:CHEMBL3545051'], [u'compound:CID5070'], [u'compound:CID21418407'], [u'compound:CID71750'], [u'compound:ARX788'], [u'compound:Ar-42'], [u'compound:EC-0652'], [u'compound:LY3300054'], [u'compound:FPA144'], [u'compound:PLX51107'], [u'compound:CID5280335'], [u'compound:CID71454652'], [u'compound:MEHD7945 A'], [u'compound:CCT3833'], [u'compound:CID471583'], [u'compound:U3-1402'], [u'compound:CID11751922'], [u'compound:Supinoxin'], [u'compound:CID12855920'], [u'compound:ADXS-cHER2'], [u'compound:CID3394'], [u'compound:CHEMBL2107910'], [u'compound:CID89594'], [u'compound:CID170361'], [u'compound:CID14871'], [u'compound:CID49864454'], [u'compound:IMP4297'], [u'compound:CID46881239'], [u'compound:enadenotucirev'], [u'compound:Sar103168'], [u'compound:CID178'], [u'compound:CID25194767'], [u'compound:CHEMBL2108754'], [u'compound:CHEMBL2108285'], [u'compound:CID4935'], [u'compound:BIIB022'], [u'compound:CID9577124'], [u'compound:CID92337'], [u'compound:CID44177671'], [u'compound:CID586'], [u'compound:CID45142457'], [u'compound:PF-06804103'], [u'compound:CID9868037'], [u'compound:CID71587955'], [u'compound:TRC253'], [u'compound:CID54671008'], [u'compound:CID56603541'], [u'compound:MGD009'], [u'compound:SID315661189'], [u'compound:CID1986'], [u'compound:CID6433099'], [u'compound:CID216210'], [u'compound:INCB059872'], [u'compound:WX-0593'], [u'compound:INCAGN01876'], [u'compound:Ly2780301'], [u'compound:CID44456560'], [u'compound:CID65866'], [u'compound:CID46213929'], [u'compound:MEDI0562'], [u'compound:Pwt33597'], [u'compound:CID110634'], [u'compound:CID71544351'], [u'compound:CID5988'], [u'compound:CID129010506'], [u'compound:CHEMBL1200528'], [u'compound:CHEMBL1200557'], [u'compound:CID60663'], [u'compound:Cb-5083'], [u'compound:CID44567549'], [u'compound:CID25195216'], [u'compound:CID5479537'], [u'compound:CID43815'], [u'compound:Cx-5461'], [u'compound:CID4485'], [u'compound:SID315661204'], [u'compound:CID134018'], [u'compound:X-82'], [u'compound:CID49871869'], [u'compound:RG-7666'], [u'compound:CID3763'], [u'compound:KTN3379'], [u'compound:CID18444613'], [u'compound:CHEMBL397165'], [u'compound:CID25118925'], [u'compound:CID14930278'], [u'compound:CID5283731'], [u'compound:CID22123692'], [u'compound:CID2541'], [u'compound:CHEMBL1201619'], [u'compound:MSC2490484A'], [u'compound:CID16718576'], [u'compound:CID11656591'], [u'compound:CID125017'], [u'compound:MG1MA3'], [u'compound:CID4046'], [u'compound:LOAd703'], [u'compound:CHEBI:4392'], [u'compound:CID11176619'], [u'compound:Sch900353'], [u'compound:SAIT301'], [u'compound:CID11749858'], [u'compound:CID4463'], [u'compound:CID4034'], [u'compound:CID6450821'], [u'compound:Cc-8490'], [u'compound:SCT400'], [u'compound:CHEMBL2109377'], [u'compound:CHEMBL2108678'], [u'compound:CID47319'], [u'compound:CID3000715'], [u'compound:CID36207'], [u'compound:CID9855343'], [u'compound:CHEMBL3707356'], [u'compound:CID65981'], [u'compound:CHEMBL3545177'], [u'compound:Gs-9820'], [u'compound:CID5311181'], [u'compound:CID5478796'], [u'compound:SID7889084'], [u'compound:LY-3164530'], [u'compound:FLX925'], [u'compound:CID129211'], [u'compound:CID15934554'], [u'compound:CHEMBL2108757'], [u'compound:CHEMBL2109299'], [u'compound:CHEMBL2108027'], [u'compound:CHEMBL2107841'], [u'compound:GI-6207'], [u'compound:CHEMBL1742984'], [u'compound:CID11387605'], [u'compound:SID821323'], [u'compound:CHEMBL3545296'], [u'compound:CID5870'], [u'compound:CID4095'], [u'compound:CID54676537'], [u'compound:CID119607'], [u'compound:CID3410'], [u'compound:CHEBI:27902'], [u'compound:CID25263425'], [u'compound:CID23991'], [u'compound:CID23987'], [u'compound:CID25227462'], [u'compound:CID462383'], [u'compound:CID68617'], [u'compound:CHEMBL1201556'], [u'compound:CHEMBL3545179'], [u'compound:CID4680'], [u'compound:CID5775'], [u'compound:CID2435'], [u'compound:SID347909880'], [u'compound:CID3696'], [u'compound:CID56959'], [u'compound:CID44593524'], [u'compound:CID8378'], [u'compound:CID49800004'], [u'compound:CID2118'], [u'compound:Cwp232291'], [u'compound:CID393111'], [u'compound:GI-6301'], [u'compound:CHEMBL1201768'], [u'compound:CID5732'], [u'compound:CID476008'], [u'compound:On-013105'], [u'compound:CHEMBL2108465'], [u'compound:CID5997'], [u'compound:TRX518'], [u'compound:CID667484'], [u'compound:Debio-1347'], [u'compound:CID122335'], [u'compound:CID44137946'], [u'compound:CHEMBL495727'], [u'compound:CHEMBL2109276'], [u'compound:CID170623'], [u'compound:CID6433083'], [u'compound:CID1135'], [u'compound:CID5440'], [u'compound:CHEMBL1235836'], [u'compound:CID440005'], [u'compound:CID3276'], [u'compound:CID44424838'], [u'compound:CID5479530'], [u'compound:CID9898639'], [u'compound:CID39186'], [u'compound:CID3702'], [u'compound:CID3730'], [u'compound:CID3724'], [u'compound:CHEBI:149836'], [u'compound:CID6029'], [u'compound:EZN-4176'], [u'compound:Debio-0932'], [u'compound:CHEMBL1201607'], [u'compound:Ro5212054'], [u'compound:CID153241'], [u'compound:RX108'], [u'compound:CID6918784'], [u'compound:CHEMBL1187846'], [u'compound:Ds-2248'], [u'compound:ZEN003694'], [u'compound:CID3463'], [u'compound:CID2727'], [u'compound:CID441314'], [u'compound:CID32778'], [u'compound:CID9565'], [u'compound:CID3475'], [u'compound:CID3478'], [u'compound:CID444020'], [u'compound:CID1989'], [u'compound:CID5503'], [u'compound:CID91610'], [u'compound:CHEBI:31897'], [u'compound:CID6918537'], [u'compound:CHEBI:5383'], [u'compound:CID11243969'], [u'compound:CID444254'], [u'compound:CID6957673'], [u'compound:CID644077'], [u'compound:CHEMBL2108986'], [u'compound:CID493570'], [u'compound:CID1130'], [u'compound:CID23688359'], [u'compound:CID8567'], [u'compound:CID5336'], [u'compound:CID443971'], [u'compound:CHEMBL1200346'], [u'compound:CHEMBL1201464'], [u'compound:CID3052776']]



```python
print list(O.query().V().where(aql.eq("_label", "G2PAssociation")).outEdge().limit(100).render(["_label"]))
```

    [[u'genotypeOf'], [u'environmentFor'], [u'environmentFor'], [u'environmentFor'], [u'phenotypeOf'], [u'evidenceFor'], [u'genotypeOf'], [u'environmentFor'], [u'phenotypeOf'], [u'featureOf'], [u'evidenceFor'], [u'genotypeOf'], [u'environmentFor'], [u'phenotypeOf'], [u'featureOf'], [u'evidenceFor'], [u'genotypeOf'], [u'environmentFor'], [u'phenotypeOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'featureOf'], [u'evidenceFor'], [u'genotypeOf'], [u'environmentFor'], [u'phenotypeOf'], [u'featureOf'], [u'evidenceFor'], [u'genotypeOf'], [u'environmentFor'], [u'phenotypeOf'], [u'evidenceFor'], [u'genotypeOf'], [u'environmentFor'], [u'phenotypeOf'], [u'featureOf'], [u'evidenceFor'], [u'genotypeOf'], [u'environmentFor'], [u'phenotypeOf'], [u'featureOf'], [u'evidenceFor'], [u'genotypeOf'], [u'phenotypeOf'], [u'featureOf'], [u'evidenceFor'], [u'genotypeOf'], [u'environmentFor'], [u'phenotypeOf'], [u'featureOf'], [u'evidenceFor'], [u'genotypeOf'], [u'environmentFor'], [u'phenotypeOf'], [u'featureOf'], [u'evidenceFor'], [u'genotypeOf'], [u'environmentFor'], [u'environmentFor'], [u'phenotypeOf'], [u'featureOf'], [u'evidenceFor'], [u'genotypeOf'], [u'environmentFor'], [u'phenotypeOf'], [u'featureOf'], [u'evidenceFor'], [u'genotypeOf'], [u'genotypeOf'], [u'genotypeOf'], [u'genotypeOf'], [u'genotypeOf'], [u'genotypeOf'], [u'environmentFor'], [u'environmentFor'], [u'phenotypeOf'], [u'evidenceFor']]



```python
print list(O.query().V().where(aql.eq("$.label", "Individual")).outEdge("drugTherapyFrom").distinct("$.to").render(["$.to"]))
```

    [{u'data': [u'compound:CID60750']}, {u'data': [u'compound:UNKNOWN:temsirolimus']}, {u'data': [u'compound:CID36314']}, {u'data': [u'compound:CID38904']}, {u'data': [u'compound:CID143']}, {u'data': [u'compound:UNKNOWN:oxaliplatin']}, {u'data': [u'compound:UNKNOWN:eloxatin']}, {u'data': [u'compound:CID6006']}, {u'data': [u'compound:CID3385']}, {u'data': [u'compound:CID5743']}, {u'data': [u'compound:UNKNOWN:leucovorin calcium']}, {u'data': [u'compound:CID148124']}, {u'data': [u'compound:CID5311497']}, {u'data': [u'compound:CID60838']}, {u'data': [u'compound:CID36462']}, {u'data': [u'compound:UNKNOWN:gemzar']}, {u'data': [u'compound:CID3690']}, {u'data': [u'compound:UNKNOWN:pegfilgrastim']}, {u'data': [u'compound:UNKNOWN:mithramycin']}, {u'data': [u'compound:CID5978']}, {u'data': [u'compound:CID31703']}, {u'data': [u'compound:UNKNOWN:cpt-11']}, {u'data': [u'compound:CID2907']}, {u'data': [u'compound:UNKNOWN:vinorelbine tartrate']}, {u'data': [u'compound:CID5353562']}, {u'data': [u'compound:CID2733526']}, {u'data': [u'compound:CID60700']}, {u'data': [u'compound:CID13342']}, {u'data': [u'compound:UNKNOWN:vepesid']}, {u'data': [u'compound:CID3950']}, {u'data': [u'compound:UNKNOWN:paraplatin']}, {u'data': [u'compound:CID5394']}, {u'data': [u'compound:CID657181']}, {u'data': [u'compound:CID5426']}, {u'data': [u'compound:UNKNOWN:ciclosporin']}, {u'data': [u'compound:UNKNOWN:fareston']}, {u'data': [u'compound:CID2578']}, {u'data': [u'compound:CID5865']}, {u'data': [u'compound:CID2187']}, {u'data': [u'compound:CID126941']}, {u'data': [u'compound:CID6253']}, {u'data': [u'compound:CID3902']}, {u'data': [u'compound:CID5755']}, {u'data': [u'compound:CID4091']}, {u'data': [u'compound:CID5311128']}, {u'data': [u'compound:CID4674']}, {u'data': [u'compound:UNKNOWN:taxane']}, {u'data': [u'compound:CID2708']}, {u'data': [u'compound:UNKNOWN:vinorelbin']}]



```python
q = O.query().V().where(aql.eq("_label", "Compound"))
for i in q:
    print i
```

    <AttrDict({u'gid': u'compound:UNKNOWN:CIL55', u'data': {u'status': u'probe', u'smiles': u'CN(C)CCNC(=O)c1cc2CSc3cc(Cl)ccc3-c2s1', u'name': u'CIL55', u'rationale': u'pilot-set', u'report': u'screening hit', u'id': u'UNKNOWN:CIL55'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD4132', u'data': {u'status': u'probe', u'smiles': u'CC(C)N1C(=O)S\\C(=C\\c2ccc(Sc3nc4ccccc4[nH]3)o2)C1=O', u'name': u'BRD4132', u'rationale': u'chromatin;pilot-set', u'report': u'screening hit', u'id': u'UNKNOWN:BRD4132'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD6340', u'data': {u'status': u'probe', u'smiles': u'C(Cn1c2ccccc2c2ccccc12)c1nc2ccccc2[nH]1', u'name': u'BRD6340', u'rationale': u'chromatin;pilot-set', u'report': u'screening hit', u'id': u'UNKNOWN:BRD6340'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID613000', u'data': {u'status': u'probe', u'smiles': u'CC(C)(C)c1ccc2cc(C#N)c(cc2c1)C#N', u'name': u'BRD9876', u'rationale': u'pilot-set', u'report': u'screening hit', u'id': u'CID613000'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID64971', u'data': {u'status': u'probe', u'smiles': u'CC(=C)[C@@H]1CC[C@@]2(CC[C@]3(C)[C@H](CC[C@@H]4[C@@]5(C)CC[C@H](O)C(C)(C)[C@@H]5CC[C@@]34C)[C@@H]12)C(O)=O', u'name': u'betulinic acid', u'rationale': u'chromatin;lit-search', u'report': u'natural product; inhibitor of specificity protein 1 transcription factor in cells', u'id': u'CID64971'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID3503', u'data': {u'status': u'clinical', u'smiles': u'CC(C)c1c(O)c(O)c(C=O)c2c(O)c(c(C)cc12)-c1c(C)cc2c(C(C)C)c(O)c(O)c(C=O)c2c1O', u'name': u'gossypol', u'rationale': u'CTEP;pilot-set', u'report': u'inhibitor of lactate dehydrogenase; inhibitor of BCL2 family members', u'id': u'CID3503'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID2708', u'data': {u'status': u'FDA', u'smiles': u'OC(=O)CCCc1ccc(cc1)N(CCCl)CCCl', u'name': u'chlorambucil', u'rationale': u'std-of-care', u'report': u'DNA alkylator', u'id': u'CID2708'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID3385', u'data': {u'status': u'FDA', u'smiles': u'Fc1c[nH]c(=O)[nH]c1=O', u'name': u'fluorouracil', u'rationale': u'std-of-care', u'report': u'pyrimidine analog; inhibitor of thymidylate synthase', u'id': u'CID3385'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID2756', u'data': {u'status': u'FDA', u'smiles': u'CN\\C(NCCSCc1nc[nH]c1C)=N/C#N', u'name': u'cimetidine', u'rationale': u'lit-search', u'report': u'inhibitor of histidine receptor H2', u'id': u'CID2756'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:', u'data': {u'report': u'inhibitor of DNA methyltransferase', u'smiles': u'Nc1ncn([C@@H]2O[C@H](CO)[C@@H](O)[C@H]2O)c(=O)n1', u'status': u'FDA', u'name': u'azacitidine', u'rationale': u'CTEP;std-of-care'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID5566', u'data': {u'status': u'FDA', u'smiles': u'CN1CCN(CCCN2c3ccccc3Sc3ccc(cc23)C(F)(F)F)CC1', u'name': u'trifluoperazine', u'rationale': u'pilot-set', u'report': u'antagonist of dopamine receptor D2', u'id': u'CID5566'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID36314', u'data': {u'status': u'FDA', u'smiles': u'CC(=O)O[C@@H]1C2=C(C)[C@H](C[C@@](O)([C@@H](OC(=O)c3ccccc3)C3[C@@]4(CO[C@@H]4C[C@H](O)[C@@]3(C)C1=O)OC(C)=O)C2(C)C)OC(=O)[C@H](O)[C@@H](NC(=O)c1ccccc1)c1ccccc1', u'name': u'paclitaxel', u'rationale': u'std-of-care', u'report': u'inhibitor of microtubule assembly', u'id': u'CID36314'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID2733526', u'data': {u'status': u'FDA', u'smiles': u'CC\\C(c1ccccc1)=C(/c1ccccc1)c1ccc(OCCN(C)C)cc1', u'name': u'tamoxifen', u'rationale': u'chromatin;std-of-care', u'report': u'modulator of estrogen receptors', u'id': u'CID2733526'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID38904', u'data': {u'status': u'FDA', u'smiles': u'O=C1O[Pt]OC(=O)C11CCC1', u'name': u'carboplatin', u'rationale': u'std-of-care', u'report': u'inducer of DNA damage', u'id': u'CID38904'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID452548', u'data': {u'status': u'FDA', u'smiles': u'COc1cc(cc(OC)c1O)[C@H]1[C@@H]2C(COC2=O)C(O[C@@H]2O[C@@H]3CO[C@H](OC3[C@H](O)[C@H]2O)c2cccs2)c2cc3OCOc3cc12', u'name': u'teniposide', u'rationale': u'pilot-set', u'report': u'inhibitor of topoisomerase II', u'id': u'CID452548'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID5212', u'data': {u'status': u'FDA', u'smiles': u'CCCc1nn(C)c2C(=O)NC(=Nc12)c3cc(ccc3OCC)S(=O)(=O)N4CCN(C)CC4', u'name': u'sildenafil', u'rationale': u'pilot-set', u'report': u'inhibitor of phosphodiesterase 5A', u'id': u'CID5212'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID54454', u'data': {u'status': u'FDA', u'smiles': u'CCC(C)(C)C(=O)O[C@H]1C[C@@H](C)C=C2C=C[C@H](C)[C@H](CC[C@@H]3C[C@@H](O)CC(=O)O3)[C@@H]12', u'name': u'simvastatin', u'rationale': u'pilot-set', u'report': u'inhibitor of HMG-CoA reductase', u'id': u'CID54454'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID4915', u'data': {u'status': u'FDA', u'smiles': u'CNNCc1ccc(cc1)C(=O)NC(C)C', u'name': u'procarbazine', u'rationale': u'std-of-care', u'report': u'inducer of DNA damage', u'id': u'CID4915'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:curcumin', u'data': {u'status': u'clinical', u'smiles': u'COc1cc(C=CC(=O)CC(=O)C=Cc2ccc(O)c(OC)c2)ccc1O', u'name': u'curcumin', u'rationale': u'pilot-set', u'report': u'natural product; modulator of ROS; modulator of NF-kappa-B signaling', u'id': u'UNKNOWN:curcumin'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID5281672', u'data': {u'status': u'probe', u'smiles': u'Oc1cc(O)c2c(c1)oc(-c1cc(O)c(O)c(O)c1)c(O)c2=O', u'name': u'myricetin', u'rationale': u'lit-search', u'report': u'flavonoid antioxidant', u'id': u'CID5281672'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID126941', u'data': {u'status': u'FDA', u'smiles': u'CN(Cc1cnc2nc(N)nc(N)c2n1)c1ccc(cc1)C(=O)N[C@@H](CCC(O)=O)C(O)=O', u'name': u'methotrexate', u'rationale': u'std-of-care', u'report': u'inhibitor of dihydrofolate reductase', u'id': u'CID126941'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:lovastatin', u'data': {u'status': u'FDA', u'smiles': u'CCC(C)C(=O)OC1CC(C)C=C2C=CC(C)C(CCC(O)CC(O)CC(O)=O)C12', u'name': u'lovastatin', u'rationale': u'pilot-set', u'report': u'inhibitor of HMG-CoA reductase', u'id': u'UNKNOWN:lovastatin'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID5353562', u'data': {u'status': u'FDA', u'smiles': u'CN(C)\\N=N\\c1[nH]cnc1C(N)=O', u'name': u'dacarbazine', u'rationale': u'std-of-care', u'report': u'DNA alkylator', u'id': u'CID5353562'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID4917', u'data': {u'status': u'FDA', u'smiles': u'CN1CCN(CCCN2c3ccccc3Sc3ccc(Cl)cc23)CC1', u'name': u'prochlorperazine', u'rationale': u'lit-search', u'report': u'inhibitor of dopamine receptor D2', u'id': u'CID4917'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID3690', u'data': {u'status': u'FDA', u'smiles': u'ClCCNP1(=O)OCCCN1CCCl', u'name': u'ifosfamide', u'rationale': u'std-of-care', u'report': u'DNA alkylator', u'id': u'CID3690'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID31703', u'data': {u'status': u'FDA', u'smiles': u'COc1cccc2C(=O)c3c(O)c4C[C@](O)(C[C@H](O[C@H]5C[C@H](N)[C@H](O)[C@H](C)O5)c4c(O)c3C(=O)c12)C(=O)CO', u'name': u'doxorubicin', u'rationale': u'std-of-care', u'report': u'inhibitor of topoisomerase II', u'id': u'CID31703'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID439501', u'data': {u'status': u'probe', u'smiles': u'C[C@@H]1O[C@@H](O[C@H]2C[C@@H](O)[C@]3(CO)[C@H]4[C@H](O)C[C@]5(C)[C@H](CC[C@]5(O)[C@@H]4CC[C@]3(O)C2)C2=CC(=O)OC2)[C@H](O)[C@H](O)[C@H]1O', u'name': u'ouabain', u'rationale': u'lit-search', u'report': u'cardiac glycoside; inhibitor of the Na+/K+-ATPase', u'id': u'CID439501'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD9647', u'data': {u'status': u'probe', u'smiles': u'COc1ccc(cc1)N(C(=O)c1ccccc1)S(=O)(=O)c1cc(OC)ccc1OC', u'name': u'BRD9647', u'rationale': u'pilot-set', u'report': u'screening hit', u'id': u'UNKNOWN:BRD9647'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID5702613', u'data': {u'status': u'probe', u'smiles': u'CCCCCCCCCCCCC\\C=C\\[C@@H](O)[C@H](CO)NC(=O)CCCCC', u'name': u'C6-ceramide', u'rationale': u'lit-search', u'report': u'inhibitor of glucosylceramide synthase; activator of MAP kinase (ERK); stimulator of protein phosphatase 2A', u'id': u'CID5702613'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID60700', u'data': {u'status': u'FDA', u'smiles': u'CC[C@@]1(O)C(=O)OCc2c1cc1-c3nc4ccc(O)c(CN(C)C)c4cc3Cn1c2=O', u'name': u'topotecan', u'rationale': u'std-of-care', u'report': u'inhibitor of topoisomerase I', u'id': u'CID60700'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID2949965', u'data': {u'status': u'probe', u'smiles': u'CC(Nc1nc(nc2ccccc12)N1CCCC1)c1ccccc1', u'name': u'importazole', u'rationale': u'pilot-set', u'report': u'inhibitor of importin', u'id': u'CID2949965'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID36462', u'data': {u'status': u'FDA', u'smiles': u'COc1cc(cc(OC)c1O)[C@H]1[C@@H]2[C@H](COC2=O)[C@H](O[C@@H]2O[C@@H]3CO[C@@H](C)O[C@H]3[C@H](O)[C@H]2O)c2cc3OCOc3cc12', u'name': u'etoposide', u'rationale': u'pilot-set;std-of-care', u'report': u'inhibitor of topoisomerase II', u'id': u'CID36462'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:cytochalasin B', u'data': {u'status': u'probe', u'smiles': u'C[C@H]1[C@H]2[C@H](Cc3ccccc3)NC(=O)[C@]22OC(=O)\\C=C\\[C@H](O)CCC[C@@H](C)C\\C=C\\[C@H]2[C@H](O)C1=C', u'name': u'cytochalasin B', u'rationale': u'pilot-set', u'report': u'inhibitor of actin polymerization', u'id': u'UNKNOWN:cytochalasin B'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID262093', u'data': {u'status': u'probe', u'smiles': u'OCCSC1=C(SCCO)C(=O)c2ccccc2C1=O', u'name': u'NSC95397', u'rationale': u'pilot-set', u'report': u'inhibitor of cell division cycle 25 phosphatase (CDC25)', u'id': u'CID262093'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:manumycin A', u'data': {u'status': u'probe', u'smiles': u'CCCC[C@@H](C)\\C=C(C)\\C=C(/C)C(=O)NC1=C[C@@](O)(\\C=C\\C=C\\C=C\\C(=O)NC2C(=O)CCC2=O)[C@@H]2O[C@@H]2C1=O', u'name': u'manumycin A', u'rationale': u'pilot-set', u'report': u'inhibitor of RAS farnesyltransferase', u'id': u'UNKNOWN:manumycin A'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID445643', u'data': {u'status': u'FDA', u'smiles': u'CO[C@@H]1C[C@@H](CC[C@H]1O)\\C=C(/C)[C@H]1OC(=O)[C@@H]2CCCCN2C(=O)C(=O)[C@]2(O)O[C@@H]([C@H](C[C@H]2C)OC)[C@H](C[C@@H](C)C\\C(C)=C\\[C@@H](CC=C)C(=O)C[C@H](O)[C@H]1C)OC', u'name': u'tacrolimus', u'rationale': u'pilot-set', u'report': u'inhibitor of calcineurin', u'id': u'CID445643'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID4521392', u'data': {u'status': u'probe', u'smiles': u'NC(=O)c1ccc(cc1)-c1nc(c([nH]1)-c1ccccn1)-c1ccc2OCOc2c1', u'name': u'SB-431542', u'rationale': u'kinome', u'report': u'inhibitor of the transforming growth factor beta type 1 receptor', u'id': u'CID4521392'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID44259', u'data': {u'status': u'probe', u'smiles': u'CN[C@@H]1C[C@H]2O[C@@](C)([C@@H]1OC)n1c3ccccc3c3c4CNC(=O)c4c4c5ccccc5n2c4c13', u'name': u'staurosporine', u'rationale': u'lit-search', u'report': u'inhibitor of multiple kinases', u'id': u'CID44259'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID3854666', u'data': {u'status': u'probe', u'smiles': u'Oc1cc(ccc1NC(=O)Nc1ccccc1Br)[N+]([O-])=O', u'name': u'SB-225002', u'rationale': u'pilot-set', u'report': u'inhibitor of chemokine receptor 2', u'id': u'CID3854666'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID5282054', u'data': {u'status': u'probe', u'smiles': u'C\\C=C\\C\\C=C\\CCC(=O)[C@H]1O[C@H]1C(N)=O', u'name': u'cerulenin', u'rationale': u'pilot-set', u'report': u'inhibitor of fatty acid synthase; inhibitor of HMG-CoA synthase', u'id': u'CID5282054'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:GSK-3 inhibitor IX', u'data': {u'status': u'probe', u'smiles': u'O\\N=C1/C(Nc2ccccc12)=C1/C(=O)Nc2cc(Br)ccc12', u'name': u'GSK-3 inhibitor IX', u'rationale': u'kinome', u'report': u'inhibitor of JAK/STAT signaling', u'id': u'UNKNOWN:GSK-3 inhibitor IX'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K94991378', u'data': {u'status': u'probe', u'smiles': u'COCCOC(=O)N1C(=O)[C@]2([C@@H]([C@@H]3N([C@@H]2c2ccccc2OCCO)[C@H]([C@H](OC3=O)c2ccccc2)c2ccccc2)C(=O)NCC=C)c2cc(ccc12)C#CCC(C(=O)OC)C(=O)OC', u'name': u'BRD-K94991378', u'rationale': u'DOS;outreach', u'report': u'inducer of ROS', u'id': u'UNKNOWN:BRD-K94991378'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID6918837', u'data': {u'status': u'clinical', u'smiles': u'Cc1[nH]c2ccccc2c1CCNCc1ccc(\\C=C\\C(=O)NO)cc1', u'name': u'LBH-589', u'rationale': u'chromatin;outreach', u'report': u'inhibitor of HDAC1, HDAC2, HDAC3, HDAC6, and HDAC8', u'id': u'CID6918837'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID9908783', u'data': {u'status': u'probe', u'smiles': u'Cc1ccccc1-n1c(Cn2cnc3c(N)ncnc23)nc2cccc(C)c2c1=O', u'name': u'IC-87114', u'rationale': u'kinome', u'report': u'inhibitor of PI3K catalytic subunit delta', u'id': u'CID9908783'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:ciclosporin', u'data': {u'status': u'FDA', u'smiles': u'CCC1NC(=O)C([C@H](O)[C@H](C)C\\C=C\\C)N(C)C(=O)C(C(C)C)N(C)C(=O)C(CC(C)C)N(C)C(=O)C(CC(C)C)N(C)C(=O)[C@@H](C)NC(=O)C(C)NC(=O)C(CC(C)C)N(C)C(=O)C(NC(=O)C(CC(C)C)N(C)C(=O)CN(C)C1=O)C(C)C', u'name': u'ciclosporin', u'rationale': u'pilot-set', u'report': u'inhibitor of calcineurin by binding to cyclophilin D', u'id': u'UNKNOWN:ciclosporin'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID5278396', u'data': {u'status': u'probe', u'smiles': u'O=c1cc(oc(c1)-c1cccc2Sc3ccccc3Sc12)N1CCOCC1', u'name': u'KU-55933', u'rationale': u'kinome', u'report': u'inhibitor of ataxia telangiectasia mutated (ATM)', u'id': u'CID5278396'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:PDMP', u'data': {u'status': u'probe', u'smiles': u'CCCCCCCCCC(=O)N[C@H](CN1CCOCC1)[C@H](O)c1ccccc1', u'name': u'PDMP', u'rationale': u'pilot-set', u'report': u'inhibitor of ceramide glucosyltransferase', u'id': u'UNKNOWN:PDMP'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K71935468', u'data': {u'status': u'probe', u'smiles': u'COC(=O)C(CC#Cc1ccc2NC(=O)[C@@]3([C@H]([C@H]4N([C@H]3c3ccccc3OCCO)[C@@H]([C@@H](OC4=O)c3ccccc3)c3ccccc3)C(=O)N3CCN(CC3)c3ncccn3)c2c1)C(=O)OC', u'name': u'BRD-K71935468', u'rationale': u'DOS;outreach', u'report': u'inducer of ROS', u'id': u'UNKNOWN:BRD-K71935468'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BEC', u'data': {u'status': u'probe', u'smiles': u'N[C@H](CSCCB(O)O)C(O)=O', u'name': u'BEC', u'rationale': u'pilot-set', u'report': u'inhibitor of arginase I and II', u'id': u'UNKNOWN:BEC'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID6918328', u'data': {u'status': u'probe', u'smiles': u'CC[C@@H](C)[C@@H]1NC(=O)[C@H](Cc2cn(OC)c3ccccc23)NC(=O)[C@H](CCCCCC(=O)CC)NC(=O)[C@H]2CCCCN2C1=O', u'name': u'apicidin', u'rationale': u'chromatin;outreach', u'report': u'inhibitor of HDAC1, HDAC2, HDAC3, HDAC6, and HDAC8', u'id': u'CID6918328'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:Merck60', u'data': {u'status': u'probe', u'smiles': u'CC(=O)Nc1ccc(cc1)C(=O)Nc1cc(ccc1N)-c1cccs1', u'name': u'Merck60', u'rationale': u'chromatin;pilot-set', u'report': u'inhibitor of HDAC1 and HDAC2', u'id': u'UNKNOWN:Merck60'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-A94377914', u'data': {u'status': u'probe', u'smiles': u'CN1CCCCC1NC(=O)[C@H](CCCCCC(C)=O)C(=O)Nc1nc(cs1)-c1ccccc1', u'name': u'BRD-A94377914', u'rationale': u'chromatin;outreach', u'report': u'inhibitor of HDAC1, HDAC2, HDAC3, HDAC6, and HDAC8', u'id': u'UNKNOWN:BRD-A94377914'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID132496', u'data': {u'status': u'probe', u'smiles': u'CCCCCCN(CCCCCC)C(=O)Cc1c([nH]c2ccccc12)-c1ccc(F)cc1', u'name': u'FGIN-1-27', u'rationale': u'pilot-set', u'report': u'activator of peripheral benzodiazepine receptor/translocator protein', u'id': u'CID132496'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:compound 1B', u'data': {u'status': u'probe', u'smiles': u'CCN(CC)c1ccc(cc1[N+]([O-])=O)C1=NNC(=O)CC1C', u'name': u'compound 1B', u'rationale': u'chromatin;outreach', u'report': u'screening hit', u'id': u'UNKNOWN:compound 1B'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID5978', u'data': {u'status': u'FDA', u'smiles': u'CC[C@]1(O)C[C@@H]2CN(C1)CCc1c([nH]c3ccccc13)[C@@](C2)(C(=O)OC)c1cc2c(cc1OC)N(C=O)[C@@H]1[C@]22CCN3CC=C[C@](CC)([C@@H]23)[C@@H](OC(C)=O)[C@]1(O)C(=O)OC', u'name': u'vincristine', u'rationale': u'std-of-care', u'report': u'inhibitor of mictrotubule assembly', u'id': u'CID5978'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID3793', u'data': {u'status': u'FDA', u'smiles': u'CCC(C)n1ncn(-c2ccc(cc2)N2CCN(CC2)c2ccc(OCC3COC(Cn4cncn4)(O3)c3ccc(Cl)cc3Cl)cc2)c1=O', u'name': u'itraconazole', u'rationale': u'pilot-set', u'report': u'anti-fungal agent; inhibitor of hedgehog signaling pathway', u'id': u'CID3793'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:erastin', u'data': {u'status': u'probe', u'smiles': u'CCOc1ccccc1-n1c(=O)c2ccccc2nc1C(C)N1CCN(CC1)C(=O)COc1ccc(Cl)cc1', u'name': u'erastin', u'rationale': u'pilot-set', u'report': u'modulator of voltage-dependent anion channels; inhibitor of solute carrier SLC7A11', u'id': u'UNKNOWN:erastin'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:ML031', u'data': {u'status': u'probe', u'smiles': u'Cc1cc(C(=O)CN2C(=O)CCC2=O)c(C)n1Cc1ccccc1', u'name': u'ML031', u'rationale': u'pilot-set', u'report': u'inhibitor of sphingosine 1-phosphate receptor 2', u'id': u'UNKNOWN:ML031'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:CIL56', u'data': {u'status': u'probe', u'smiles': u'ON=C1c2cc(ccc2-c2ccc(cc12)S(=O)(=O)N1CCCCC1)S(=O)(=O)N1CCCCC1', u'name': u'CIL56', u'rationale': u'pilot-set', u'report': u'screening hit', u'id': u'UNKNOWN:CIL56'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:FQI-1', u'data': {u'status': u'probe', u'smiles': u'CCOc1ccccc1C1CC(=O)Nc2cc3OCOc3cc12', u'name': u'FQI-1', u'rationale': u'pilot-set', u'report': u'inhibitor of LSF1-mediated transcription', u'id': u'UNKNOWN:FQI-1'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K92856060', u'data': {u'status': u'probe', u'smiles': u'COc1ccc(cc1[N+]([O-])=O)S(=O)(=O)N(C(C)=O)c1ccc(OC(C)=O)c2ccccc12', u'name': u'BRD-K92856060', u'rationale': u'DOS;outreach', u'report': u'screening hit', u'id': u'UNKNOWN:BRD-K92856060'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:B02', u'data': {u'status': u'probe', u'smiles': u'O=c1n(Cc2ccccc2)c(\\C=C\\c2cccnc2)nc2ccccc12', u'name': u'B02', u'rationale': u'chromatin;pilot-set', u'report': u'inhibitor of RAD51', u'id': u'UNKNOWN:B02'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K45681478', u'data': {u'status': u'probe', u'smiles': u'ClC1=C(NCC=C)C(=O)c2ccccc2C1=O', u'name': u'BRD-K45681478', u'rationale': u'DOS;outreach', u'report': u'product of diversity oriented synthesis; screening hit', u'id': u'UNKNOWN:BRD-K45681478'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:ML050', u'data': {u'status': u'probe', u'smiles': u'Brc1cc2OCOc2cc1C1Nc2ccccc2C2C=CCC12', u'name': u'ML050', u'rationale': u'pilot-set', u'report': u'antagonist of GPR30', u'id': u'UNKNOWN:ML050'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:ML162', u'data': {u'status': u'probe', u'smiles': u'COc1ccc(cc1Cl)N(C(C(=O)NCCc1ccccc1)c1cccs1)C(=O)CCl', u'name': u'ML162', u'rationale': u'pilot-set', u'report': u'selectively kills engineered cells expressing mutant HRAS', u'id': u'UNKNOWN:ML162'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:CIL41', u'data': {u'status': u'probe', u'smiles': u'N=C(NOC(=O)C12CC3CC(CC(C3)C1)C2)c1ccccc1', u'name': u'CIL41', u'rationale': u'pilot-set', u'report': u'screening hit', u'id': u'UNKNOWN:CIL41'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:NSC30930', u'data': {u'status': u'probe', u'smiles': u'OC(=O)c1cc2cc(OCc3ccccc3)ccc2[nH]1', u'name': u'NSC30930', u'rationale': u'outreach', u'report': u'inhibitor of steroid 5-alpha reductase', u'id': u'UNKNOWN:NSC30930'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:CIL70', u'data': {u'status': u'probe', u'smiles': u'Clc1ccc(CC(=N)NOC(=O)c2cccc3ccccc23)cc1', u'name': u'CIL70', u'rationale': u'pilot-set', u'report': u'screening hit', u'id': u'UNKNOWN:CIL70'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:MI-1', u'data': {u'status': u'probe', u'smiles': u'CC1(C)CN=C(S1)N1CCN(CC1)c1ncnc2sc3CCCCc3c12', u'name': u'MI-1', u'rationale': u'lit-search', u'report': u'binder of menin; inhibitor of menin-MLL fusion protein', u'id': u'UNKNOWN:MI-1'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID676352', u'data': {u'status': u'probe', u'smiles': u'C(Nc1nc(NCc2ccccc2)c2ccccc2n1)c1ccccc1', u'name': u'DBeQ', u'rationale': u'lit-search', u'report': u'inhibitor of p97 in cells', u'id': u'CID676352'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:ML083', u'data': {u'status': u'probe', u'smiles': u'COc1ccc(cc1)S(=O)(=O)N1CCN(CC1)S(=O)(=O)c1ccc2OCCOc2c1', u'name': u'ML083', u'rationale': u'pilot-set', u'report': u'activator of muscle pyruvate kinase', u'id': u'UNKNOWN:ML083'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:CID-5951923', u'data': {u'status': u'probe', u'smiles': u'CN(C1CCS(=O)(=O)C1)C(=O)COC(=O)\\C=C\\c1cccc(c1)[N+]([O-])=O', u'name': u'CID-5951923', u'rationale': u'chromatin;lit-search', u'report': u'modulator of KLF5 expression', u'id': u'UNKNOWN:CID-5951923'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID675434', u'data': {u'status': u'probe', u'smiles': u'Cc1cc(C(=O)CN2CCCC2)c(C)n1-c1ccc(F)cc1', u'name': u'IU1', u'rationale': u'lit-search', u'report': u'inhibitor of the deubiquitinase activity of USP14', u'id': u'CID675434'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:ML311', u'data': {u'status': u'probe', u'smiles': u'CCN1CCN(CC1)C(c1ccc(cc1)C(F)(F)F)c1ccc2cccnc2c1O', u'name': u'ML311', u'rationale': u'outreach', u'report': u'inhibitor of MCL1', u'id': u'UNKNOWN:ML311'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID9956119', u'data': {u'status': u'probe', u'smiles': u'Cc1c[nH]c(n1)-c1cnc(NCCNc2ccc(cn2)C#N)nc1-c1ccc(Cl)cc1Cl', u'name': u'CHIR-99021', u'rationale': u'kinome;pilot-set', u'report': u'inhibitor of GSK3 beta', u'id': u'CID9956119'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID11364421', u'data': {u'status': u'clinical', u'smiles': u'CC[C@H]1N(C2CCCC2)c2nc(Nc3ccc(cc3OC)C(=O)NC3CCN(C)CC3)ncc2N(C)C1=O', u'name': u'BI-2536', u'rationale': u'kinome;pilot-set', u'report': u'inhibitor of polo-like kinase 1 (PLK1)', u'id': u'CID11364421'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K61166597', u'data': {u'status': u'probe', u'smiles': u'Nc1ccc(cc1NC(=O)c1ccc(cc1)C(=O)NCCc1ccncc1)-c1cccs1', u'name': u'BRD-K61166597', u'rationale': u'chromatin;outreach', u'report': u'inhibitor of HDAC1 and HDAC2', u'id': u'UNKNOWN:BRD-K61166597'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID9826308', u'data': {u'status': u'probe', u'smiles': u'COc1cc2ncn(-c3cc(OCc4ccccc4C(F)(F)F)c(s3)C(N)=O)c2cc1OC', u'name': u'GW-843682X', u'rationale': u'kinome;pilot-set', u'report': u'inhibitor of PLK1 and PLK3', u'id': u'CID9826308'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID5394', u'data': {u'status': u'FDA', u'smiles': u'CN1N=Nc2c(ncn2C1=O)C(=O)N', u'name': u'temozolomide', u'rationale': u'std-of-care', u'report': u'DNA alkylator', u'id': u'CID5394'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:QW-BI-011', u'data': {u'status': u'probe', u'smiles': u'COC(=O)c1ccc2n(CCCc3ccccc3)c(NC(=O)c3ccccc3)nc2c1', u'name': u'QW-BI-011', u'rationale': u'chromatin;pilot-set', u'report': u'inhibitor of G9a histone methyltransferase', u'id': u'UNKNOWN:QW-BI-011'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID24772860', u'data': {u'status': u'probe', u'smiles': u'CC1(C)Cc2c(c(nn2-c2ccc(C(N)=O)c(N[C@H]3CC[C@H](O)CC3)c2)C(F)(F)F)C(=O)C1', u'name': u'SNX-2112', u'rationale': u'pilot-set', u'report': u'inhibitor of HSP90alpha and HSP90beta', u'id': u'CID24772860'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID135411', u'data': {u'status': u'probe', u'smiles': u'OC(=O)c1ccc2cc(ccc2c1)-c1ccc(O)c(c1)C12CC3CC(CC(C3)C1)C2', u'name': u'CD-437', u'rationale': u'chromatin;pilot-set', u'report': u'agonist of retinoic acid receptor gamma', u'id': u'CID135411'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID4259181', u'data': {u'status': u'probe', u'smiles': u'CC(C)c1ccc(Cn2ccc3c2ccc2nc(NC4CC4)nc(N)c32)cc1', u'name': u'SCH-79797', u'rationale': u'pilot-set', u'report': u'antagonist of proteinase-activated receptor 1 (PAR1)', u'id': u'CID4259181'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID10410894', u'data': {u'status': u'probe', u'smiles': u'CN1c2cc3c(cc2N=C(c2ccc(cc2)C(O)=O)c2ccccc12)C(C)(C)CCC3(C)C', u'name': u'LE-135', u'rationale': u'pilot-set', u'report': u'antagonist of retinoic acid receptor beta', u'id': u'CID10410894'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:Platin', u'data': {u'status': u'FDA', u'smiles': u'N[Pt](N)(Cl)Cl', u'name': u'Platin', u'rationale': u'std-of-care', u'report': u'DNA alkylator; organoplatinum reagent', u'id': u'UNKNOWN:Platin'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID9911463', u'data': {u'status': u'probe', u'smiles': u'COc1ccc2n(C(=O)c3cccc(Cl)c3Cl)c(C)c(CCN3CCOCC3)c2c1', u'name': u'GW-405833', u'rationale': u'pilot-set', u'report': u'partial agonist of cannabinoid receptor 2', u'id': u'CID9911463'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID1714884', u'data': {u'status': u'probe', u'smiles': u'CCCCCCCCc1ccc(cc1)-c1ccc(cc1)C(O)=O', u'name': u'AC55649', u'rationale': u'chromatin;pilot-set', u'report': u'agonist of retinoic acid receptor beta', u'id': u'CID1714884'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID374536', u'data': {u'status': u'probe', u'smiles': u'OCc1ccc(s1)-c1ccc(o1)-c1ccc(CO)s1', u'name': u'RITA', u'rationale': u'pilot-set', u'report': u'inhibitor of p53-MDM2 interaction', u'id': u'CID374536'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID11507802', u'data': {u'status': u'probe', u'smiles': u'CN(C)C(=O)n1nnnc1Cc1ccc(cc1)-c1ccccc1', u'name': u'LY-2183240', u'rationale': u'pilot-set', u'report': u'inhibitor of fatty acid amide hydrolase; inhibitor of anandamide uptake', u'id': u'CID11507802'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:CD-1530', u'data': {u'status': u'probe', u'smiles': u'OC(=O)c1ccc(cc1)-c1ccc2cc(c(O)cc2c1)C12CC3CC(CC(C3)C1)C2', u'name': u'CD-1530', u'rationale': u'chromatin;pilot-set', u'report': u'agonist of retinoic acid receptor gamma', u'id': u'UNKNOWN:CD-1530'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID9903786', u'data': {u'status': u'probe', u'smiles': u'NC(=O)Nc1sc(cc1C(N)=O)-c1ccc(F)cc1', u'name': u'TPCA-1', u'rationale': u'chromatin;outreach', u'report': u'inhibitor of IKK-2', u'id': u'CID9903786'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:NSC632839', u'data': {u'status': u'probe', u'smiles': u'Cc1ccc(C=C2CNCC(=Cc3ccc(C)cc3)C2=O)cc1', u'name': u'NSC632839', u'rationale': u'pilot-set', u'report': u'inhibitor of ubiquitin isopeptidase', u'id': u'UNKNOWN:NSC632839'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID104842', u'data': {u'status': u'probe', u'smiles': u'CCc1c2Cn3c(cc4c(COC(=O)C4(O)CC)c3=O)-c2nc2ccc(O)cc12', u'name': u'SN-38', u'rationale': u'pilot-set', u'report': u'metabolite of irinotecan; inhibitor of topoisomerase I', u'id': u'CID104842'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K80183349', u'data': {u'status': u'probe', u'smiles': u'CC(=O)N1CCC(CC1)C(=O)Nc1cc(ccc1N)-c1cccs1', u'name': u'BRD-K80183349', u'rationale': u'chromatin;outreach', u'report': u'inhibitor of HDAC1 and HDAC2', u'id': u'UNKNOWN:BRD-K80183349'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K66532283', u'data': {u'status': u'probe', u'smiles': u'Nc1ccc(cc1NC(=O)C1=CCCC1)-c1cccs1', u'name': u'BRD-K66532283', u'rationale': u'chromatin;outreach', u'report': u'inhibitor of HDAC1 and HDAC2', u'id': u'UNKNOWN:BRD-K66532283'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:MK-2206', u'data': {u'status': u'clinical', u'smiles': u'NC1(CCC1)c1ccc(cc1)-c1nc2ccn3c(n[nH]c3=O)c2cc1-c1ccccc1', u'name': u'MK-2206', u'rationale': u'chromatin;CTEP;kinome;pilot-set', u'report': u'inhibitor of AKT1', u'id': u'UNKNOWN:MK-2206'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:triazolothiadiazine', u'data': {u'status': u'probe', u'smiles': u'COc1ccc(OC)c(c1)-c1nnc2SCC(=Nn12)c1ccc(OC)c(OC)c1', u'name': u'triazolothiadiazine', u'rationale': u'pilot-set', u'report': u'inhibitor of phosphdiesterase 4A/B/D', u'id': u'UNKNOWN:triazolothiadiazine'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K66453893', u'data': {u'status': u'GE-active', u'smiles': u'C[C@@H](CO)N1C[C@H](C)[C@H](CN(C)S(=O)(=O)c2ccc(Cl)cc2)Oc2ccc(NC(=O)CCC(F)(F)F)cc2CC1=O', u'name': u'BRD-K66453893', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K66453893'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K11533227', u'data': {u'status': u'probe', u'smiles': u'CC(=O)NC1CCN(CC1)C(=O)Nc1cc(ccc1N)-c1cccs1', u'name': u'BRD-K11533227', u'rationale': u'chromatin;outreach', u'report': u'inhibitor of HDAC1 and HDAC2', u'id': u'UNKNOWN:BRD-K11533227'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K27224038', u'data': {u'status': u'GE-active', u'smiles': u'C[C@@H](CO)N1C[C@H](C)[C@@H](CN(C)C(=O)C2CCOCC2)Oc2ncc(cc2C1=O)C#CC1(O)CCCC1', u'name': u'BRD-K27224038', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K27224038'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K14844214', u'data': {u'status': u'GE-active', u'smiles': u'CC(C)CC#Cc1ccc2c(O[C@@H](CN(C)C(=O)c3cnccn3)[C@H](C)CN([C@H](C)CO)S2(=O)=O)c1', u'name': u'BRD-K14844214', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K14844214'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD1835', u'data': {u'status': u'probe', u'smiles': u'C[C@@H](CO)N1C[C@H](C)[C@@H](CN(C)Cc2ccc(cc2)C(O)=O)Oc2cc(ccc2S1(=O)=O)C#CCC1CCCC1', u'name': u'BRD1835', u'rationale': u'chromatin;DOS;outreach', u'report': u'product of diversity oriented synthesis; screening hit', u'id': u'UNKNOWN:BRD1835'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K41597374', u'data': {u'status': u'GE-active', u'smiles': u'C[C@H](CO)N1C[C@H](C)[C@H](CN(C)C(=O)Nc2cc(F)ccc2F)Oc2cc(ccc2S1(=O)=O)C#CC1CCCC1', u'name': u'BRD-K41597374', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K41597374'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K63431240', u'data': {u'status': u'probe', u'smiles': u'C[C@@H](CO)N1C[C@H](C)[C@@H](CN(C)C(=O)Nc2ccc3OCOc3c2)Oc2cc(ccc2S1(=O)=O)C#Cc1ccncc1', u'name': u'BRD-K63431240', u'rationale': u'DOS;outreach', u'report': u'product of diversity oriented synthesis; screening hit', u'id': u'UNKNOWN:BRD-K63431240'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K13999467', u'data': {u'status': u'GE-active', u'smiles': u'C[C@@H](CO)N1C[C@H](C)[C@H](CN(C)C(=O)Cc2ccncc2)Oc2cc(ccc2S1(=O)=O)C#Cc1ccccc1F', u'name': u'BRD-K13999467', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K13999467'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K96970199', u'data': {u'status': u'GE-active', u'smiles': u'C\\C=C\\c1ccc2c(O[C@@H](CN(C)C(=O)c3ccccc3)[C@@H](C)CN([C@@H](C)CO)S2(=O)=O)c1', u'name': u'BRD-K96970199', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K96970199'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:brefeldin A', u'data': {u'status': u'probe', u'smiles': u'CC1CCC\\C=C/C2CC(O)CC2C(O)\\C=C/C(=O)O1', u'name': u'brefeldin A', u'rationale': u'pilot-set', u'report': u'modulator of ADP-ribosylation factor 1; inhibitor of protein translocation from ER to Golgi', u'id': u'UNKNOWN:brefeldin A'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID2130404', u'data': {u'status': u'probe', u'smiles': u'Clc1ccc(Cl)c(c1)-c1ccc(\\C=C(/C#N)C(=O)Nc2cccc3ncccc23)o1', u'name': u'AGK-2', u'rationale': u'chromatin;pilot-set', u'report': u'inhibitor of sirtuin 2', u'id': u'CID2130404'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID5479543', u'data': {u'status': u'probe', u'smiles': u'CC(C)C[C@H](NC(=O)[C@@H](C[C@@H](O)[C@H](Cc1ccccc1)NC(=O)OC(C)(C)C)Cc1ccccc1)C(=O)N[C@@H](Cc1ccccc1)C(N)=O', u'name': u'L-685458', u'rationale': u'pilot-set', u'report': u'inhibitor of gamma-secretase', u'id': u'CID5479543'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID25154868', u'data': {u'status': u'probe', u'smiles': u'O=C(Nc1ccccc1)N1CCC(Cc2cnc3ccccc3c2)CC1', u'name': u'PF-750', u'rationale': u'pilot-set', u'report': u'inhibitor of fatty acid amide hydrolase', u'id': u'CID25154868'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:triptolide', u'data': {u'status': u'clinical', u'smiles': u'CC(C)[C@]12O[C@H]1[C@@H]1O[C@]11[C@]3(O[C@H]3CC3C4=C(CC[C@]13C)C(=O)OC4)[C@@H]2O', u'name': u'triptolide', u'rationale': u'pilot-set', u'report': u'natural product; inhibitor of RNA polymerase II', u'id': u'UNKNOWN:triptolide'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:nutlin-3', u'data': {u'status': u'clinical', u'smiles': u'COc1ccc(C2=NC(C(N2C(=O)N2CCNC(=O)C2)c2ccc(Cl)cc2)c2ccc(Cl)cc2)c(OC(C)C)c1', u'name': u'nutlin-3', u'rationale': u'pilot-set', u'report': u'inhibitor of p53-MDM2 interaction', u'id': u'UNKNOWN:nutlin-3'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:16-beta-bromoandrosterone', u'data': {u'status': u'probe', u'smiles': u'C[C@]12CC[C@H]3[C@@H](CC[C@H]4C[C@H](O)CC[C@]34C)[C@@H]1C[C@H](Br)C2=O', u'name': u'16-beta-bromoandrosterone', u'rationale': u'pilot-set', u'report': u'dehydroepiandrosterone (DHEA) analog', u'id': u'UNKNOWN:16-beta-bromoandrosterone'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:PRL-3 inhibitor I', u'data': {u'status': u'probe', u'smiles': u'Brc1ccc(OCc2ccccc2Br)c(\\C=C2\\SC(=S)NC2=O)c1', u'name': u'PRL-3 inhibitor I', u'rationale': u'pilot-set', u'report': u'inhibitor of phosphatase of regenerating liver-3 (PRL3)', u'id': u'UNKNOWN:PRL-3 inhibitor I'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:SID 26681509', u'data': {u'status': u'probe', u'smiles': u'CCc1ccccc1NC(=O)CSC(=O)NNC(=O)[C@@H](Cc1c[nH]c2ccccc12)NC(=O)OC(C)(C)C', u'name': u'SID 26681509', u'rationale': u'pilot-set', u'report': u'inhibitor of cathepsin L', u'id': u'UNKNOWN:SID 26681509'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID11228183', u'data': {u'status': u'clinical', u'smiles': u'CN(C)CC[C@H](CSc1ccccc1)Nc1ccc(cc1[N+]([O-])=O)S(=O)(=O)NC(=O)c1ccc(cc1)N1CCN(Cc2ccccc2-c2ccc(Cl)cc2)CC1', u'name': u'ABT-737', u'rationale': u'pilot-set', u'report': u'inhibitor of BCL2, BCL-xL, and BCL-W', u'id': u'CID11228183'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:zebularine', u'data': {u'status': u'probe', u'smiles': u'OC[C@H]1O[C@H](C(O)[C@H]1O)n1cccnc1=O', u'name': u'zebularine', u'rationale': u'chromatin;pilot-set', u'report': u'inhibitor of DNA methyltransferases', u'id': u'UNKNOWN:zebularine'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID9884685', u'data': {u'status': u'probe', u'smiles': u'Oc1cccc(c1)-c1nc(N2CCOCC2)c2oc3ncccc3c2n1', u'name': u'PI-103', u'rationale': u'kinome;pilot-set', u'report': u'inhibitor of DNA-PK, PI3K p110 delta, mTORC1, and catalytic subunits of PI3K', u'id': u'CID9884685'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:SR-II-138A', u'data': {u'status': u'probe', u'smiles': u'CON(C)C(=O)[C@H]1[C@@H](O)[C@@]2(O)c3c(O[C@]2([C@@H]1c1ccccc1)c1ccc(OC)cc1)cc(OC)cc3OC', u'name': u'SR-II-138A', u'rationale': u'pilot-set', u'report': u'silvestrol analog; inhibits translation by modulating the eIF4F complex', u'id': u'UNKNOWN:SR-II-138A'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:neopeltolide', u'data': {u'status': u'probe', u'smiles': u'CCC[C@H]1C[C@H](C[C@H](C)C[C@@H]2C[C@H](C[C@H](CC(=O)O1)O2)OC(=O)\\C=C/CCc1coc(\\C=C/CNC(=O)OC)n1)OC', u'name': u'neopeltolide', u'rationale': u'pilot-set', u'report': u'inhibitor of cellular respiration', u'id': u'UNKNOWN:neopeltolide'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID7251185', u'data': {u'status': u'probe', u'smiles': u'C\\C1=C\\CC[C@@]2(C)O[C@@H]2[C@H]2OC(=O)C(=C)[C@@H]2CC1', u'name': u'parthenolide', u'rationale': u'pilot-set', u'report': u'natural product; modulator of ROS; modulator of NF-kappa-B signaling', u'id': u'CID7251185'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID16741245', u'data': {u'status': u'probe', u'smiles': u'CN(C)C(=O)c1ccc(cc1)S(=O)(=O)c1ccc(NC(=O)[C@@](C)(O)C(F)(F)F)c(Cl)c1', u'name': u'AZD7545', u'rationale': u'kinome;pilot-set', u'report': u'inhibitor of pyruvate dehydrogenase kinase 2', u'id': u'CID16741245'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID25195348', u'data': {u'status': u'probe', u'smiles': u'Nc1ncnc2n([C@@H]3O[C@H](COCc4ccc(cc4)C#N)[C@@H](O)[C@H]3O)c(NCc3ccc(Cl)c(Cl)c3)nc12', u'name': u'VER-155008', u'rationale': u'pilot-set', u'report': u'inhibitor of HSP70', u'id': u'CID25195348'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:ML203', u'data': {u'status': u'probe', u'smiles': u'Nc1cccc(c1)S(=O)(=O)N1CCCN(CC1)S(=O)(=O)c1ccc2OCCOc2c1', u'name': u'ML203', u'rationale': u'pilot-set', u'report': u'activator of muscle pyruvate kinase (PKM2)', u'id': u'UNKNOWN:ML203'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:SRT-1720', u'data': {u'status': u'probe', u'smiles': u'O=C(Nc1cc(CN2CCNCC2)cc(c1)-c1nc2ccccc2[nH]1)c1cnc2ccccc2n1', u'name': u'SRT-1720', u'rationale': u'chromatin;pilot-set', u'report': u'activator of sirtuin-1', u'id': u'UNKNOWN:SRT-1720'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:CAY10594', u'data': {u'status': u'probe', u'smiles': u'O=C(NCCN1CCC2(CC1)N(CNC2=O)c1ccccc1)c1ccc2ccccc2c1', u'name': u'CAY10594', u'rationale': u'pilot-set', u'report': u'inhibitor of phospholipase D2', u'id': u'UNKNOWN:CAY10594'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:Compound 1541A', u'data': {u'status': u'probe', u'smiles': u'Oc1cccc2cc(C(=O)Nc3cccc(c3)-c3cn4ccccc4n3)c(=O)oc12', u'name': u'Compound 1541A', u'rationale': u'pilot-set', u'report': u'activators of executioner procaspases 3, 6, and 7', u'id': u'UNKNOWN:Compound 1541A'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID702558', u'data': {u'status': u'probe', u'smiles': u'OC(=O)[C@H](Cc1c[nH]c2ccccc12)N1C(=O)c2ccccc2C1=O', u'name': u'RG-108', u'rationale': u'pilot-set', u'report': u'inhibitor of DNA methyltransferase', u'id': u'CID702558'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID6753378', u'data': {u'status': u'probe', u'smiles': u'Oc1c(CC=C)cccc1\\C=N\\NC(=O)CN1CCN(Cc2ccccc2)CC1', u'name': u'PAC-1', u'rationale': u'pilot-set', u'report': u'activator of procaspase-3', u'id': u'CID6753378'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID148198', u'data': {u'status': u'clinical', u'smiles': u'Clc1ccc(OCCCCCC\\N=C(\\NC#N)Nc2ccncc2)cc1', u'name': u'GMX-1778', u'rationale': u'pilot-set', u'report': u'inhibitor of nicotinamide phosphoribosyltransferase', u'id': u'CID148198'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID60750', u'data': {u'status': u'FDA', u'smiles': u'Nc1ccn([C@@H]2O[C@H](CO)[C@@H](O)C2(F)F)c(=O)n1', u'name': u'gemcitabine', u'rationale': u'pilot-set;std-of-care', u'report': u'inhibitor of DNA replication; inhibitor of ribonucleotide reductase, thymidylate synthetase, and cytidine monophosphate (UMP-CMP) kinase ', u'id': u'CID60750'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:MST-312', u'data': {u'status': u'probe', u'smiles': u'Oc1cccc(C(=O)Nc2cccc(NC(=O)c3cccc(O)c3O)c2)c1O', u'name': u'MST-312', u'rationale': u'chromatin;pilot-set', u'report': u'inhibitor of telomerase reverse transcriptase', u'id': u'UNKNOWN:MST-312'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:oligomycin A', u'data': {u'status': u'probe', u'smiles': u'CCC1CCC2OC3(CC[C@@H](C)C(C[C@H](C)O)O3)[C@H](C)C(OC(=O)\\C=C\\[C@@H](C)[C@H](O)[C@@H](C)C(=O)[C@H](C)[C@@H](O)[C@H](C)C(=O)[C@@](C)(O)[C@H](O)[C@@H](C)C\\C=C\\C=C\\1)[C@H]2C', u'name': u'oligomycin A', u'rationale': u'pilot-set', u'report': u'inhibitor of mitochondrial ATP synthase', u'id': u'UNKNOWN:oligomycin A'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K49290616', u'data': {u'status': u'GE-active', u'smiles': u'OC[C@@H]1O[C@@H](CC(=O)NCc2ccncn2)CC[C@H]1NC(=O)c1ccc(F)cc1', u'name': u'BRD-K49290616', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K49290616'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K02492147', u'data': {u'status': u'GE-active', u'smiles': u'CN1CCN(CC1)C(=O)C[C@@H]1O[C@H](CO)[C@@H](NS(=O)(=O)c2cccc(F)c2)C=C1', u'name': u'BRD-K02492147', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K02492147'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:austocystin D', u'data': {u'status': u'probe', u'smiles': u'CC(C)(O)CCc1ccc(O)c2c1oc1cc3O[C@H]4OC=C[C@@]4(O)c3c(O)c1c2=O', u'name': u'austocystin D', u'rationale': u'pilot-set', u'report': u'natural product; inducer of DNA damage', u'id': u'UNKNOWN:austocystin D'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:SJ-172550', u'data': {u'status': u'probe', u'smiles': u'CCOc1cc(cc(Cl)c1OCC(=O)OC)\\C=C1C(=O)N(N=C/1C)c1ccccc1', u'name': u'SJ-172550', u'rationale': u'pilot-set', u'report': u'inhibitor of p53-MDM2 interaction', u'id': u'UNKNOWN:SJ-172550'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:pandacostat', u'data': {u'status': u'probe', u'smiles': u'ONC(=O)\\C=C\\c1ccc(cc1)C(=O)N\\N=C\\c1ccc(O)c(O)c1O', u'name': u'pandacostat', u'rationale': u'chromatin;pilot-set', u'report': u'inhibitor of HDAC1, HDAC2, HDAC3, HDAC6, and HDAC8', u'id': u'UNKNOWN:pandacostat'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K96431673', u'data': {u'status': u'GE-active', u'smiles': u'CN1CCN(CC1)C(=O)C[C@H]1CC[C@H](NC(=O)c2ccc3OCOc3c2)[C@@H](CO)O1', u'name': u'BRD-K96431673', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K96431673'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:cyanoquinoline 11', u'data': {u'status': u'clinical', u'smiles': u'Fc1ccc(Nc2c(cnc3c(Cl)cc(NCc4cnc[nH]4)cc23)C#N)cc1Cl', u'name': u'cyanoquinoline 11', u'rationale': u'kinome;pilot-set', u'report': u'inhibitor of MAP3K8; inhibitor of phosphorylated EGFR in cells', u'id': u'UNKNOWN:cyanoquinoline 11'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:tipifarnib-P1', u'data': {u'status': u'clinical', u'smiles': u'Cn1cncc1[C@](N)(c1ccc(Cl)cc1)c1ccc2n(C)c(=O)cc(-c3cccc(Cl)c3)c2c1', u'name': u'tipifarnib-P1', u'rationale': u'pilot-set', u'report': u'inhibitor of farnesyltransferase', u'id': u'UNKNOWN:tipifarnib-P1'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:Compound 23 citrate', u'data': {u'status': u'probe', u'smiles': u'CN(C)[C@H]1CC[C@H]2[C@@H](CC[C@H]3[C@@H]4CC=C(c5ccc6cnccc6c5)[C@@]4(C)CC[C@H]23)C1', u'name': u'Compound 23 citrate', u'rationale': u'pilot-set', u'report': u'analog of natural product cortistatin', u'id': u'UNKNOWN:Compound 23 citrate'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:nakiterpiosin', u'data': {u'status': u'probe', u'smiles': u'C[C@H]1C[C@@H](OC1=O)[C@@H](O)[C@@H](C(Cl)Cl)c1ccc2[C@@H]3C[C@@H](Br)[C@]45O[C@H](C[C@]4(C)[C@H]3C(=O)c2c1C)CO[C@H]5O', u'name': u'nakiterpiosin', u'rationale': u'pilot-set', u'report': u'natural product; inhibitor of microtubule assembly', u'id': u'UNKNOWN:nakiterpiosin'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:CCT036477', u'data': {u'status': u'probe', u'smiles': u'Cc1[nH]c2ccccc2c1C(Nc1ccccn1)c1ccc(Cl)cc1', u'name': u'CCT036477', u'rationale': u'pilot-set', u'report': u'inhibitor of WNT signaling by blocking beta-catenin transcription', u'id': u'UNKNOWN:CCT036477'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID11213558', u'data': {u'status': u'clinical', u'smiles': u'COc1cc(Nc2ncc(F)c(Nc3ccc4OC(C)(C)C(=O)Nc4n3)n2)cc(OC)c1OC', u'name': u'tamatinib', u'rationale': u'CTEP;kinome;pilot-set', u'report': u'inhibitor of spleen tyrosine kinase', u'id': u'CID11213558'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:myriocin', u'data': {u'status': u'probe', u'smiles': u'CCCCCCC(=O)CCCCCC\\C=C\\C[C@H](O)[C@@H](O)C(N)(CO)C(O)=O', u'name': u'myriocin', u'rationale': u'pilot-set', u'report': u'inhibitor of serine palmitoyltransferase', u'id': u'UNKNOWN:myriocin'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID11178236', u'data': {u'status': u'clinical', u'smiles': u'COCCn1c2c(C(=O)c3ccccc3C2=O)[n+](Cc2cnccn2)c1C', u'name': u'YM-155', u'rationale': u'pilot-set', u'report': u'inhibitor of survivin expression', u'id': u'CID11178236'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID24785538', u'data': {u'status': u'probe', u'smiles': u'C[C@]1(CCCN1c1nc(Nc2cc(n[nH]2)C2CC2)c2cccn2n1)C(=O)Nc1ccc(F)nc1', u'name': u'BMS-754807', u'rationale': u'pilot-set', u'report': u'inhibitor of insulin-like growth factor 1 receptor and insulin receptor', u'id': u'CID24785538'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID9927531', u'data': {u'status': u'probe', u'smiles': u'C\\C(=C/C(=O)Nc1ccccc1C(O)=O)c1ccc2ccccc2c1', u'name': u'BIBR-1532', u'rationale': u'chromatin;pilot-set', u'report': u'inhibitor of telomerase reverse transcriptase', u'id': u'CID9927531'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD8958', u'data': {u'status': u'probe', u'smiles': u'CC1=NN(C(=O)C\\1=C\\c1ccc(o1)-c1cc(C)c(C)cc1[N+]([O-])=O)c1ccc(cc1)C(O)=O', u'name': u'BRD8958', u'rationale': u'chromatin;pilot-set', u'report': u'inhibitor of E1A binding protein p300', u'id': u'UNKNOWN:BRD8958'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:serdemetan', u'data': {u'status': u'clinical', u'smiles': u'C(Cc1c[nH]c2ccccc12)Nc1cccc(Nc2ccncc2)c1', u'name': u'serdemetan', u'rationale': u'pilot-set', u'report': u'inhibitor of MDM2', u'id': u'UNKNOWN:serdemetan'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID24856436', u'data': {u'status': u'clinical', u'smiles': u'CN1CCN(CC1)c1ccc(Nc2ncc3c(n2)n(-c2cccc(n2)C(C)(C)O)n(CC=C)c3=O)cc1', u'name': u'MK-1775', u'rationale': u'CTEP;kinome;pilot-set', u'report': u'inhibitor of WEE1', u'id': u'CID24856436'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID10322450', u'data': {u'status': u'probe', u'smiles': u'COc1ccc2c3C[C@@H]4N([C@@H](CC(C)C)c3[nH]c2c1)C(=O)[C@H](CCC(=O)OC(C)(C)C)NC4=O', u'name': u'Ko-143', u'rationale': u'pilot-set', u'report': u'inhibitor of breast cancer resistance protein multidrug transporter (BCRP)', u'id': u'CID10322450'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:CR-1-31B', u'data': {u'status': u'probe', u'smiles': u'CONC(=O)[C@H]1[C@@H](O)[C@@]2(O)c3c(O[C@]2([C@@H]1c1ccccc1)c1ccc(OC)cc1)cc(OC)cc3OC', u'name': u'CR-1-31B', u'rationale': u'pilot-set', u'report': u'silvestrol analog; inhibits translation by modulating the eIF4F complex', u'id': u'UNKNOWN:CR-1-31B'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K71781559', u'data': {u'status': u'probe', u'smiles': u'OC(=O)c1ccc(NCc2nc3cc4ccccc4cc3[nH]2)cc1', u'name': u'BRD-K71781559', u'rationale': u'outreach', u'report': u'screening hit', u'id': u'UNKNOWN:BRD-K71781559'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K86535717', u'data': {u'status': u'GE-active', u'smiles': u'CO[C@@H]1CC[C@H]2CCN(C)C(=O)[C@@H](C)[C@H](CN(C)C(=O)c3cccc(C#N)c3OC[C@H]1O2)OC', u'name': u'BRD-K86535717', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K86535717'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K48334597', u'data': {u'status': u'GE-active', u'smiles': u'C[C@H](CO)N1C[C@H](C)[C@@H](CN(C)C(=O)NC2CCCCC2)Oc2ccc(NC(=O)Cc3cn(C)c4ccccc34)cc2C1=O', u'name': u'BRD-K48334597', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K48334597'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:ML312', u'data': {u'status': u'probe', u'smiles': u'CC(C)NC(=O)Nc1ccc2O[C@@H](CN(C)S(=O)(=O)c3ccc(Cl)cc3)[C@H](C)CN([C@H](C)CO)C(=O)c2c1', u'name': u'ML312', u'rationale': u'MLPCN;outreach', u'report': u'inhibitor of scavenger receptor class B, member 1 (SCARB1)-mediated lipid uptake', u'id': u'UNKNOWN:ML312'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K04800985', u'data': {u'status': u'GE-active', u'smiles': u'C[C@@H](CO)N1C[C@@H](C)[C@@H](CN(C)CC2CCCCC2)Oc2ccc(NC(=O)Nc3c(C)noc3C)cc2C1=O', u'name': u'BRD-K04800985', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K04800985'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K78574327', u'data': {u'status': u'GE-active', u'smiles': u'C[C@H](CO)N1C[C@H](C)[C@H](CN(C)CC2CC2)Oc2ccc(NS(=O)(=O)c3cn(C)cn3)cc2C1=O', u'name': u'BRD-K78574327', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K78574327'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K19103580', u'data': {u'status': u'GE-active', u'smiles': u'C[C@H](CO)N1C[C@H](C)[C@H](CN(C)Cc2ccc(Cl)c(Cl)c2)Oc2ccc(cc2C1=O)N(C)C', u'name': u'BRD-K19103580', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K19103580'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K30019337', u'data': {u'status': u'GE-active', u'smiles': u'CC(C)NC(=O)N(C)C[C@H]1Oc2ccc(cc2C(=O)N(C[C@H]1C)[C@H](C)CO)N(C)C', u'name': u'BRD-K30019337', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K30019337'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K84807411', u'data': {u'status': u'GE-active', u'smiles': u'C[C@H](CO)N1C[C@H](C)[C@@H](CN(C)C)Oc2c(NC(=O)c3cc(C)nn3C)cccc2C1=O', u'name': u'BRD-K84807411', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K84807411'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K44224150', u'data': {u'status': u'GE-active', u'smiles': u'CNC[C@@H]1Oc2ccc(NC(=O)C3CCCCC3)cc2C(=O)N(C[C@@H]1C)[C@@H](C)CO', u'name': u'BRD-K44224150', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K44224150'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K75293299', u'data': {u'status': u'GE-active', u'smiles': u'C[C@@H](CO)N1C[C@@H](C)[C@H](CN(C)C(=O)Nc2cccc3ccccc23)Oc2c(NC(=O)c3ccncc3)cccc2C1=O', u'name': u'BRD-K75293299', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K75293299'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K64610608', u'data': {u'status': u'probe', u'smiles': u'COc1ccc(cc1)S(=O)(=O)N(C)C[C@@H]1Oc2c(NC(=O)Nc3cccc4ccccc34)cccc2C(=O)N(C[C@H]1C)[C@@H](C)CO', u'name': u'BRD-K64610608', u'rationale': u'DOS;outreach', u'report': u'product of diversity oriented synthesis; screening hit', u'id': u'UNKNOWN:BRD-K64610608'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K02251932', u'data': {u'status': u'GE-active', u'smiles': u'C[C@H](CO)N1C[C@H](C)[C@H](CN(C)C(=O)NC2CCCCC2)Oc2c(NS(=O)(=O)c3ccc(F)cc3)cccc2C1=O', u'name': u'BRD-K02251932', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K02251932'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K55116708', u'data': {u'status': u'probe', u'smiles': u'C[C@@H](CO)N1C[C@@H](C)[C@@H](CN(C)Cc2ccc(cc2)C(=O)Nc2ccccc2N)Oc2c(NC(=O)Nc3ccccc3)cccc2C1=O', u'name': u'BRD-K55116708', u'rationale': u'DOS;outreach', u'report': u'product of diversity oriented synthesis; inhibitor of leukemic stem cells', u'id': u'UNKNOWN:BRD-K55116708'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K41334119', u'data': {u'status': u'GE-active', u'smiles': u'CNC[C@@H]1Oc2ccc(NS(C)(=O)=O)cc2CC(=O)N(C[C@@H]1C)[C@H](C)CO', u'name': u'BRD-K41334119', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K41334119'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K34485477', u'data': {u'status': u'GE-active', u'smiles': u'CNC[C@@H]1Oc2ccc(NC(=O)CCN3CCOCC3)cc2CC(=O)N(C[C@@H]1C)[C@H](C)CO', u'name': u'BRD-K34485477', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K34485477'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K16147474', u'data': {u'status': u'GE-active', u'smiles': u'CC(C)NC(=O)Nc1ccc2O[C@@H](CN(C)S(C)(=O)=O)[C@@H](C)CN([C@H](C)CO)C(=O)Cc2c1', u'name': u'BRD-K16147474', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K16147474'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K29086754', u'data': {u'status': u'GE-active', u'smiles': u'C[C@H](CO)N1C[C@@H](C)[C@@H](CN(C)Cc2ccc(cc2)C(O)=O)Oc2ccc(NC(=O)Nc3ccc(F)cc3)cc2CC1=O', u'name': u'BRD-K29086754', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K29086754'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K33199242', u'data': {u'status': u'GE-active', u'smiles': u'CNC[C@@H]1Oc2ccc(cc2CC(=O)N(C[C@@H]1C)[C@@H](C)CO)N(C)C', u'name': u'BRD-K33199242', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K33199242'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K52037352', u'data': {u'status': u'GE-active', u'smiles': u'C[C@@H](CO)N1C[C@H](C)[C@H](CN(C)C(=O)Nc2cccc3ccccc23)Oc2ccc(NC(=O)NC3CCCCC3)cc2CC1=O', u'name': u'BRD-K52037352', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K52037352'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K27986637', u'data': {u'status': u'probe', u'smiles': u'C[C@H](CO)N1C[C@H](C)[C@H](CN(C)Cc2ccc3OCCOc3c2)OCc2cn(CCCC1=O)nn2', u'name': u'BRD-K27986637', u'rationale': u'DOS;outreach', u'report': u'product of diversity oriented synthesis; screening hit', u'id': u'UNKNOWN:BRD-K27986637'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K37390332', u'data': {u'status': u'GE-active', u'smiles': u'C[C@H](CO)N1C[C@H](C)[C@@H](CN(C)C(=O)Nc2cccc3ccccc23)Oc2ccc(NC(=O)c3ccncc3)cc2CC1=O', u'name': u'BRD-K37390332', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K37390332'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID435678', u'data': {u'status': u'probe', u'smiles': u'CN(C)CCCNc1c2ccccc2n(C)c2nc(=O)n(C)c(=O)c12', u'name': u'HLI 373', u'rationale': u'pilot-set', u'report': u'inhibitor of MDM2', u'id': u'CID435678'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:NSC48300', u'data': {u'status': u'probe', u'smiles': u'O[As](O)(=O)c1ccc(Cc2ccc(cc2)[As](O)(O)=O)cc1', u'name': u'NSC48300', u'rationale': u'outreach', u'report': u'inhibitor of threonine endopeptidase taspase 1', u'id': u'UNKNOWN:NSC48300'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:PRIMA-1-Met', u'data': {u'status': u'probe', u'smiles': u'COC[C@]1(CO)[N@@]2CC[C@@H](CC2)C1=O', u'name': u'PRIMA-1-Met', u'rationale': u'pilot-set', u'report': u're-activator of the pro-apoptotic activity of mutant p53', u'id': u'UNKNOWN:PRIMA-1-Met'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID46224516', u'data': {u'status': u'probe', u'smiles': u'COc1cc2c(NC3CCN(CC3)C(C)C)nc(nc2cc1OCCCN1CCCC1)C1CCCCC1', u'name': u'UNC0638', u'rationale': u'chromatin;lit-search;pilot-set', u'report': u'inhibitor of EHMT2 and GLP methyltransferase', u'id': u'CID46224516'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:cucurbitacin I', u'data': {u'status': u'probe', u'smiles': u'CC(C)(O)\\C=C\\C(=O)[C@](C)(O)C1[C@H](O)C[C@@]2(C)C3CC=C4C(CC(=O)C(=O)C4(C)C)[C@]3(C)C(=O)C[C@]12C', u'name': u'cucurbitacin I', u'rationale': u'chromatin;outreach', u'report': u'natural product; modulator of NFKB1 and STAT3 signaling', u'id': u'UNKNOWN:cucurbitacin I'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K50799972', u'data': {u'status': u'GE-active', u'smiles': u'COc1ccccc1-c1cccc(c1)-c1nc(cc2CN([C@@H](CCO)c12)[S@@](=O)C(C)(C)C)C(=O)NCc1ccncc1', u'name': u'BRD-K50799972', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K50799972'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K17060750', u'data': {u'status': u'GE-active', u'smiles': u'CN(C)CC(=O)N[C@@H]1CC[C@@H](CCNC(=O)Nc2ccc(F)cc2)O[C@H]1CO', u'name': u'BRD-K17060750', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K17060750'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID11647372', u'data': {u'status': u'clinical', u'smiles': u'FC(F)c1nc2ccccc2n1-c1nc(nc(n1)N1CCOCC1)N1CCOCC1', u'name': u'ZSTK474', u'rationale': u'kinome', u'report': u'inhibitor of PI3K catalytic subunits beta, delta, and gamma', u'id': u'CID11647372'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID11717001', u'data': {u'status': u'probe', u'smiles': u'OCCn1cc(c(n1)-c1ccncc1)-c1ccc2c(CC\\C2=N/O)c1', u'name': u'GDC-0879', u'rationale': u'kinome', u'report': u'inhibitor of BRAF', u'id': u'CID11717001'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID16038120', u'data': {u'status': u'probe', u'smiles': u'COc1cc(ccc1Nc1ncc(Cl)c(Nc2ccccc2S(=O)(=O)C(C)C)n1)N1CCC(CC1)N1CCN(C)CC1', u'name': u'NVP-TAE684', u'rationale': u'kinome', u'report': u'inhibitor of ALK and ALK-NPM fusion protein', u'id': u'CID16038120'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID3025986', u'data': {u'status': u'clinical', u'smiles': u'CC(C)(C)c1cnc(CSc2cnc(NC(=O)C3CCNCC3)s2)o1', u'name': u'SNS-032', u'rationale': u'chromatin;kinome;lit-search', u'report': u'inhibitor of cyclin-dependent kinases', u'id': u'CID3025986'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID24180719', u'data': {u'status': u'probe', u'smiles': u'CCCS(=O)(=O)Nc1ccc(F)c(C(=O)c2c[nH]c3ncc(Cl)cc23)c1F', u'name': u'PLX-4720', u'rationale': u'kinome', u'report': u'inhibitor of BRAF', u'id': u'CID24180719'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID9907093', u'data': {u'status': u'probe', u'smiles': u'CC(Nc1ccccc1)c1cc(C)cn2c1nc(cc2=O)N1CCOCC1', u'name': u'TGX-221', u'rationale': u'kinome', u'report': u'inhibitor of PI3K catalytic subunit beta', u'id': u'CID9907093'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID9549297', u'data': {u'status': u'probe', u'smiles': u'CN(c1cccc(Cl)c1)S(=O)(=O)c1ccc2NC(=O)\\C(=C/c3[nH]c(C)c(C(=O)N4CCN(C)CC4)c3C)c2c1', u'name': u'SU11274', u'rationale': u'kinome', u'report': u'inhibitor of MET', u'id': u'CID9549297'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K88742110', u'data': {u'status': u'probe', u'smiles': u'COc1ccc(Cn2ccc3ccc(cc23)C(=O)NO)cc1', u'name': u'BRD-K88742110', u'rationale': u'chromatin;outreach', u'report': u'inhibitor of HDAC8', u'id': u'UNKNOWN:BRD-K88742110'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD8899', u'data': {u'status': u'probe', u'smiles': u'CC(=O)NC[C@@H]1C[C@H](CN1)NS(=O)(=O)c1cccc2cncc(C)c12', u'name': u'BRD8899', u'rationale': u'lit-search;synthesis', u'report': u'inhibitor of serine/threonine kinasase STK33', u'id': u'UNKNOWN:BRD8899'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID5113032', u'data': {u'status': u'clinical', u'smiles': u'NC(=O)[C@H]1CCCc2c1[nH]c1ccc(Cl)cc21', u'name': u'EX-527', u'rationale': u'chromatin;pilot-set', u'report': u'inhibitor of sirtuin 1', u'id': u'CID5113032'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:ELCPK', u'data': {u'status': u'probe', u'smiles': u'O=S(=O)(N1CCCc2ccccc12)c1ccc(cc1)-c1cnc(o1)C1CC1', u'name': u'ELCPK', u'rationale': u'pilot-set', u'report': u'screening hit', u'id': u'UNKNOWN:ELCPK'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:NPC-26', u'data': {u'status': u'probe', u'smiles': u'CCOC(=O)c1c(NC(=O)c2ccc(s2)[N+]([O-])=O)sc2c1CC(C)(C)NC2(C)C', u'name': u'NPC-26', u'rationale': u'pilot-set', u'report': u'induces cell death through a non-apoptotic, mitochondrial-dependent mechanism', u'id': u'UNKNOWN:NPC-26'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:1S,3R-RSL-3', u'data': {u'status': u'probe', u'smiles': u'COC(=O)[C@H]1Cc2c([nH]c3ccccc23)[C@@H](N1C(=O)CCl)c1ccc(cc1)C(=O)OC', u'name': u'1S,3R-RSL-3', u'rationale': u'pilot-set', u'report': u'synthetic lethal with HRAS in engineered cells; inhibitor of GPX4', u'id': u'UNKNOWN:1S,3R-RSL-3'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:CIL55A', u'data': {u'status': u'probe', u'smiles': u'CN(C)CCNC(=O)c1cc2CSc3ccc(Cl)cc3-c2s1', u'name': u'CIL55A', u'rationale': u'pilot-set', u'report': u'screening hit', u'id': u'UNKNOWN:CIL55A'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:SCH-529074', u'data': {u'status': u'probe', u'smiles': u'CN(C)CCCNc1nc(CN2CCN(CC2)C(c2ccc(Cl)cc2)c2ccc(Cl)cc2)nc2ccccc12', u'name': u'SCH-529074', u'rationale': u'pilot-set', u'report': u'activator of mutant p53', u'id': u'UNKNOWN:SCH-529074'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID46199207', u'data': {u'status': u'probe', u'smiles': u'CC(C)n1cnc2c(NCCc3ccc(O)cc3)nc(nc12)-c1csc2ccccc12', u'name': u'StemRegenin 1', u'rationale': u'chromatin;lit-search;outreach', u'report': u'inhibitor of aryl hydrocarbon receptor', u'id': u'CID46199207'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:FQI-2', u'data': {u'status': u'probe', u'smiles': u'CCOc1ccccc1-c1cc(=O)[nH]c2cc3OCOc3cc12', u'name': u'FQI-2', u'rationale': u'chromatin;pilot-set', u'report': u'inhibitor of LSF1-mediated transcription', u'id': u'UNKNOWN:FQI-2'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:ML210', u'data': {u'status': u'probe', u'smiles': u'Cc1onc(C(=O)N2CCN(CC2)C(c2ccc(Cl)cc2)c2ccc(Cl)cc2)c1[N+]([O-])=O', u'name': u'ML210', u'rationale': u'pilot-set', u'report': u'selectively kills engineered cells expressing mutant HRAS', u'id': u'UNKNOWN:ML210'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID219104', u'data': {u'status': u'clinical', u'smiles': u'CCC(C)SSc1ncc[nH]1', u'name': u'PX-12', u'rationale': u'pilot-set', u'report': u'inhibitor of thioredoxin-1', u'id': u'CID219104'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID421610', u'data': {u'status': u'probe', u'smiles': u'CN(C)c1ccccc1CN1CCCN(Cc2ccccc2N(C)C)C1c1ccncc1', u'name': u'GANT-61', u'rationale': u'chromatin;lit-search', u'report': u'inhibitor of hedgehog signaling pathway', u'id': u'CID421610'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:PL-DI', u'data': {u'status': u'probe', u'smiles': u'COc1cc(\\C=C\\C(=O)N2CCC=CC2=O)cc(OC)c1OCCN(C)CCOc1c(OC)cc(\\C=C\\C(=O)N2CCC=CC2=O)cc1OC', u'name': u'PL-DI', u'rationale': u'pilot-set', u'report': u'dimer of piperlongumine; inducer of ROS', u'id': u'UNKNOWN:PL-DI'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:TW-37', u'data': {u'status': u'probe', u'smiles': u'CC(C)c1ccccc1Cc1cc(C(=O)Nc2ccc(cc2)S(=O)(=O)c2ccccc2C(C)(C)C)c(O)c(O)c1O', u'name': u'TW-37', u'rationale': u'pilot-set', u'report': u'inhibitor of BCL2 and BCL-xL', u'id': u'UNKNOWN:TW-37'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID25262965', u'data': {u'status': u'clinical', u'smiles': u'COc1ccc(cc1CO)-c1ccc2c(nc(nc2n1)N1CCOC[C@@H]1C)N1CCOC[C@@H]1C', u'name': u'AZD8055', u'rationale': u'kinome', u'report': u'inhibitor of mTOR', u'id': u'CID25262965'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID375860', u'data': {u'status': u'probe', u'smiles': u'Fc1ccccc1-c1cc(=O)c2cc3OCOc3cc2[nH]1', u'name': u'CHM-1', u'rationale': u'pilot-set', u'report': u'inhibitor of tubulin polymerization', u'id': u'CID375860'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:QS-11', u'data': {u'status': u'probe', u'smiles': u'OC[C@H](Cc1ccccc1)Nc1nc(Oc2ccc3CCCc3c2)nc2n(Cc3ccc(cc3)-c3ccccc3)cnc12', u'name': u'QS-11', u'rationale': u'pilot-set', u'report': u'inhibitor of GTPase activating protein of ARF 1 (ARFGAP1)', u'id': u'UNKNOWN:QS-11'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:ML239', u'data': {u'status': u'probe', u'smiles': u'Clc1cc(Cl)c(OCC(=O)N\\N=C\\c2ccc[nH]2)c(Cl)c1', u'name': u'ML239', u'rationale': u'MLPCN;outreach', u'report': u'ML239; inhibitor of breast cancer stem cell proliferation', u'id': u'UNKNOWN:ML239'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:fumonisin B1', u'data': {u'status': u'probe', u'smiles': u'CCCC[C@@H](C)[C@@H](OC(=O)C[C@@H](CC(O)=O)C(O)=O)[C@H](CC(C)C[C@H](O)CCCC[C@@H](O)C[C@H](O)[C@H](C)N)OC(=O)C[C@@H](CC(O)=O)C(O)=O', u'name': u'fumonisin B1', u'rationale': u'pilot-set', u'report': u'inhibitor of ceramide synthase', u'id': u'UNKNOWN:fumonisin B1'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID46907787', u'data': {u'status': u'probe', u'smiles': u'Cc1sc-2c(c1C)C(=N[C@@H](CC(=O)OC(C)(C)C)c1nnc(C)n-21)c1ccc(Cl)cc1', u'name': u'JQ-1', u'rationale': u'chromatin;lit-search;pilot-set', u'report': u'inhibitor of bromodomain (BRD) and extra-C terminal domain (BET) proteins', u'id': u'CID46907787'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K51490254', u'data': {u'status': u'probe', u'smiles': u'ONC(=O)c1cccc(c1)C(=O)Nc1ccccc1', u'name': u'BRD-K51490254', u'rationale': u'chromatin;outreach', u'report': u'inhibitor of HDAC6 and HDAC8', u'id': u'UNKNOWN:BRD-K51490254'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K85133207', u'data': {u'status': u'probe', u'smiles': u'CC(=O)N[C@H]1C[C@H](C1)C(=O)Nc1cc(ccc1N)-c1ccc(F)cc1', u'name': u'BRD-K85133207', u'rationale': u'chromatin;outreach', u'report': u'inhibitor of HDAC1', u'id': u'UNKNOWN:BRD-K85133207'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID11626927', u'data': {u'status': u'probe', u'smiles': u'COc1cc2ncn(-c3cc(OCc4ccccc4S(C)(=O)=O)c(s3)C#N)c2cc1OC', u'name': u'CAY10576', u'rationale': u'kinome;outreach', u'report': u'inhibitor of IKK-epsilon', u'id': u'CID11626927'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:Repligen 136', u'data': {u'status': u'probe', u'smiles': u'Cc1ccc(cc1)C(=O)NCCCCCC(=O)Nc1ccc(F)cc1N', u'name': u'Repligen 136', u'rationale': u'chromatin;outreach', u'report': u'inhibitor of HDAC3', u'id': u'UNKNOWN:Repligen 136'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:WZ8040', u'data': {u'status': u'probe', u'smiles': u'CN1CCN(CC1)c1ccc(Nc2ncc(Cl)c(Sc3cccc(NC(=O)C=C)c3)n2)cc1', u'name': u'WZ8040', u'rationale': u'kinome', u'report': u'inhibitor of EGFR targeting T790M resistance', u'id': u'UNKNOWN:WZ8040'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID9868037', u'data': {u'status': u'clinical', u'smiles': u'FC(F)(F)Oc1ccc(NC(=O)c2sccc2NCc2ccnc3ccccc23)cc1', u'name': u'OSI-930', u'rationale': u'kinome', u'report': u'inhibitor of c-KIT and VEGFR2', u'id': u'CID9868037'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID24901704', u'data': {u'status': u'clinical', u'smiles': u'Cn1cnc(c1)-c1cc2nccc(Oc3ccc(NC(=S)NC(=O)Cc4ccccc4)cc3F)c2s1', u'name': u'MGCD-265', u'rationale': u'kinome', u'report': u'inhibitor of c-MET and VEGFRs', u'id': u'CID24901704'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:YK 4-279', u'data': {u'status': u'probe', u'smiles': u'COc1ccc(cc1)C(=O)CC1(O)C(=O)Nc2c1c(Cl)ccc2Cl', u'name': u'YK 4-279', u'rationale': u'chromatin;pilot-set', u'report': u'inhibitor of RNA helicase A (RHA) binding to EWS-FLI1; inhibitor of ERG and ETV1 activity', u'id': u'UNKNOWN:YK 4-279'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:CAY10618', u'data': {u'status': u'probe', u'smiles': u'O=C(CCCCCCCn1cc(nn1)-c1cccnc1)Nc1ccccc1-c1ccccc1', u'name': u'CAY10618', u'rationale': u'pilot-set', u'report': u'inhibitor of nicotinamide phosphoribosyltransferase', u'id': u'UNKNOWN:CAY10618'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID11964036', u'data': {u'status': u'probe', u'smiles': u'CCN1CCN(CC(=O)Nc2ccc(-c3cccc4c3oc(cc4=O)N3CCOCC3)c3sc4ccccc4c23)CC1', u'name': u'KU 0060648', u'rationale': u'kinome;pilot-set', u'report': u'inhibitor of DNA-dependent protein kinase', u'id': u'CID11964036'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID25183872', u'data': {u'status': u'clinical', u'smiles': u'CC(C)C[C@H](NC(=O)CNC(=O)c1cc(Cl)ccc1Cl)B(O)O', u'name': u'MLN2238', u'rationale': u'pilot-set', u'report': u'inhibitor of 20S proteasome at the chymotrypsin-like proteolytic (beta-5) site', u'id': u'CID25183872'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K29313308', u'data': {u'status': u'probe', u'smiles': u'CC(=O)Nc1ccc(cc1)C(=O)Nc1ccc(F)cc1N', u'name': u'BRD-K29313308', u'rationale': u'chromatin;outreach', u'report': u'inhibitor of HDAC3', u'id': u'UNKNOWN:BRD-K29313308'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID46901937', u'data': {u'status': u'probe', u'smiles': u'COc1cc2c(NC3CCN(C)CC3)nc(nc2cc1OCCOCCN(C)C)N1CCCN(C)CC1', u'name': u'UNC0321', u'rationale': u'chromatin;pilot-set', u'report': u'inhibitor of G9a histone methyltransferase', u'id': u'CID46901937'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID24779724', u'data': {u'status': u'clinical', u'smiles': u'Cn1cc(cn1)-c1ccc2nnc(Sc3ccc4ncccc4c3)n2n1', u'name': u'SGX-523', u'rationale': u'kinome', u'report': u'inhibitor of MET', u'id': u'CID24779724'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID44137675', u'data': {u'status': u'clinical', u'smiles': u'C[C@@H](Nc1ccccc1C(O)=O)c1cc(C)cn2c1nc(cc2=O)N1CCOCC1', u'name': u'AZD6482', u'rationale': u'kinome', u'report': u'inhibitor of PI3K catalytic subunits beta and delta', u'id': u'CID44137675'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:bleomycin A2', u'data': {u'status': u'FDA', u'smiles': u'C[C@@H](O)[C@@H](NC(=O)[C@H](C)[C@@H](O)[C@H](C)NC(=O)[C@@H](NC(=O)c1nc(nc(N)c1C)[C@H](CC(N)=O)NC[C@@H](N)C(N)=O)C(O[C@H]1O[C@H](CO)[C@H](O)[C@@H](O)[C@H]1O[C@H]1O[C@H](CO)[C@@H](O)[C@H](OC(N)=O)[C@@H]1O)c1c[nH]cn1)C(=O)NCCc1nc(cs1)-c1nc(cs1)C(=O)NCCC[S+](C)C', u'name': u'bleomycin A2', u'rationale': u'std-of-care', u'report': u'inducer of DNA damage', u'id': u'UNKNOWN:bleomycin A2'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID17755052', u'data': {u'status': u'clinical', u'smiles': u'CS(=O)(=O)N1CCN(Cc2cc3nc(nc(N4CCOCC4)c3s2)-c2cccc3[nH]ncc23)CC1', u'name': u'GDC-0941', u'rationale': u'kinome', u'report': u'inhibitor of PI3K kinase activity', u'id': u'CID17755052'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID9967941', u'data': {u'status': u'probe', u'smiles': u'Cc1cccc(n1)-c1[nH]c(nc1-c1ccc2nccnc2c1)C(C)(C)C', u'name': u'SB-525334', u'rationale': u'kinome', u'report': u'inhibitor of the transforming growth factor beta type 1 receptor', u'id': u'CID9967941'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID46191454', u'data': {u'status': u'clinical', u'smiles': u'CC(C)CC(=O)Nc1n[nH]c2c1CN(C(=O)C1CCN(C)CC1)C2(C)C', u'name': u'PHA-793887', u'rationale': u'chromatin;kinome', u'report': u'inhibitor of cyclin-dependent kinases', u'id': u'CID46191454'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K24690302', u'data': {u'status': u'probe', u'smiles': u'CN(C)CC1CN(C1)C(=O)Nc1cc(ccc1N)-c1ccc(F)cc1', u'name': u'BRD-K24690302', u'rationale': u'chromatin;outreach', u'report': u'inhibitor of HDAC1', u'id': u'UNKNOWN:BRD-K24690302'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K70511574', u'data': {u'status': u'probe', u'smiles': u'COc1ccc(cc1)S(=O)(=O)N(C(=O)C)c2ccccc2C=Cc3cc[n+]([O-])cc3', u'name': u'BRD-K70511574', u'rationale': u'kinome', u'report': u'inhibitor of polo-like kinase 1 (PLK1)', u'id': u'UNKNOWN:BRD-K70511574'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID42611257', u'data': {u'status': u'FDA', u'smiles': u'CCCS(=O)(=O)Nc1ccc(F)c(C(=O)c2c[nH]c3ncc(cc23)-c2ccc(Cl)cc2)c1F', u'name': u'PLX-4032', u'rationale': u'kinome;pilot-set;std-of-care', u'report': u'inhibitor of BRAF', u'id': u'CID42611257'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID15983966', u'data': {u'status': u'clinical', u'smiles': u'C[C@@H](Oc1cc(sc1C(N)=O)-n1cnc2ccc(CN3CCN(C)CC3)cc12)c1ccccc1C(F)(F)F', u'name': u'GSK461364', u'rationale': u'kinome', u'report': u'inhibitor of polo-like kinase 1 (PLK1)', u'id': u'CID15983966'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K20514654', u'data': {u'status': u'probe', u'smiles': u'CC[C@H](C)[C@H](NC(=O)[C@H](CCCNC(N)=N)NC(=O)[C@H](CCCNC(N)=N)NC(=O)CCNC(C)=O)C(=O)N[C@@H](CCC(N)=O)C(=O)N[C@@H](CCSC)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H](CCC(O)=O)C(=O)N[C@@H](C)C(=O)N[C@@H](C)C(=O)N[C@@H](CC(N)=O)C(=O)N[C@@H](CCCNC(N)=N)C(=O)N[C@]1(C)CCC\\C=C/CCC[C@@](C)(NC(=O)[C@H](CCCNC(N)=N)NC(=O)[C@H](CCCNC(N)=N)NC(=O)[C@H](CCC(O)=O)NC1=O)C(=O)N[C@@H](CCCNC(N)=N)C(N)=O', u'name': u'BRD-K20514654', u'rationale': u'outreach', u'report': u'stapled helical peptide', u'id': u'UNKNOWN:BRD-K20514654'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K28456706', u'data': {u'status': u'probe', u'smiles': u'Cc1c(oc2ccc3ccccc3c12)[N+]([O-])=O', u'name': u'BRD-K28456706', u'rationale': u'chromatin;lit-search;synthesis', u'report': u'inhibitor of hepatocyte nuclear factor 4 alpha', u'id': u'UNKNOWN:BRD-K28456706'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:STF-31', u'data': {u'status': u'probe', u'smiles': u'CC(C)(C)c1ccc(cc1)S(=O)(=O)NCc1ccc(cc1)C(=O)Nc1cccnc1', u'name': u'STF-31', u'rationale': u'lit-search;synthesis', u'report': u'inhibitor of nicotinamide phosphoribosyltransferase', u'id': u'UNKNOWN:STF-31'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:spautin-1', u'data': {u'status': u'probe', u'smiles': u'Fc1ccc(CNc2ncnc3ccc(F)cc23)cc1', u'name': u'spautin-1', u'rationale': u'lit-search', u'report': u'inhibitor of the deubiquitinase activity of USP13 and USP10', u'id': u'UNKNOWN:spautin-1'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-A02303741', u'data': {u'status': u'probe', u'smiles': u'CC(C)N(CCCNC(=O)Nc1ccc(cc1)C(C)(C)C)C[C@H]1O[C@H](C(O)[C@H]1O)n1cnc2c(N)ncnc12', u'name': u'BRD-A02303741', u'rationale': u'chromatin;lit-search;synthesis', u'report': u'inhibitor of histone methyltransferases', u'id': u'UNKNOWN:BRD-A02303741'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:ML320', u'data': {u'status': u'probe', u'smiles': u'COc1ccccc1[C@H]1c2c(NC3=C1C(=O)CC(C)(C)C3)n[nH]c2C(F)(F)F', u'name': u'ML320', u'rationale': u'MLPCN;outreach', u'report': u'inhibitor of GSK3 beta', u'id': u'UNKNOWN:ML320'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:tigecycline', u'data': {u'status': u'FDA', u'smiles': u'CN(C)[C@H]1[C@@H]2C[C@@H]3Cc4c(cc(NC(=O)CNC(C)(C)C)c(O)c4C(=O)C3C(=O)[C@]2(O)C(=O)C(C(N)=O)C1=O)N(C)C', u'name': u'tigecycline', u'rationale': u'lit-search;outreach', u'report': u'analog of tetracycline', u'id': u'UNKNOWN:tigecycline'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K34099515', u'data': {u'status': u'probe', u'smiles': u'CC(C)N1C[C@@H](C)[C@H](CN(C)Cc2ccc(Oc3ccccc3)cc2)Oc2c(NC(=O)c3ccncc3)cccc2C1=O', u'name': u'BRD-K34099515', u'rationale': u'DOS;outreach', u'report': u'screening hit', u'id': u'UNKNOWN:BRD-K34099515'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID66577038', u'data': {u'status': u'probe', u'smiles': u'Cc1cc(CS(=O)(=O)c2ccccc2)cc(OCc2ccc(CN3CCC[C@@H]3CO)cc2)c1', u'name': u'PF-543', u'rationale': u'kinome', u'report': u'inhibitor of sphingosine kinase-1', u'id': u'CID66577038'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID11612883', u'data': {u'status': u'probe', u'smiles': u'CS(=O)(=O)c1cccc(CNc2nc(Nc3ccc4NC(=O)CCc4c3)ncc2C(F)(F)F)c1', u'name': u'PF-573228', u'rationale': u'kinome', u'report': u'inhibitor of focal adhesion kinase', u'id': u'CID11612883'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:ceranib-2', u'data': {u'status': u'probe', u'smiles': u'COc1ccc(\\C=C\\C(=O)c2c(-c3ccccc3)c3ccccc3[nH]c2=O)cc1', u'name': u'ceranib-2', u'rationale': u'lit-search', u'report': u'inhibitor of ceramidase activity', u'id': u'UNKNOWN:ceranib-2'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:FSC231', u'data': {u'status': u'probe', u'smiles': u'CCOC(=O)NC(=O)C(=C\\c1ccc(Cl)c(Cl)c1)\\C#N', u'name': u'FSC231', u'rationale': u'lit-search', u'report': u'inhibitor of PDZ domain of protein interacting with PRKCA 1 (PICK1)', u'id': u'UNKNOWN:FSC231'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:968', u'data': {u'status': u'probe', u'smiles': u'CN(C)c1ccc(cc1Br)C1Nc2ccc3ccccc3c2C2=C1C(=O)CC(C)(C)C2', u'name': u'968', u'rationale': u'lit-search', u'report': u'inhibitor of glutaminase', u'id': u'UNKNOWN:968'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID50905018', u'data': {u'status': u'probe', u'smiles': u'CC(C)(C)OC(=O)CN(Cc1ccc(s1)[N+]([O-])=O)Cc1ccc(Cl)cc1', u'name': u'GSK4112', u'rationale': u'lit-search', u'report': u'antagonist of Rev-ErbAalpha', u'id': u'CID50905018'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID2742550', u'data': {u'status': u'probe', u'smiles': u'Cc1c(cc(-c2ccccc2)n1CCCN1CCOCC1)C(=O)Nc1cccc(c1)C(F)(F)F', u'name': u'HC-067047', u'rationale': u'lit-search', u'report': u'inhibitor of cation channel TRPV4', u'id': u'CID2742550'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:IPR-456', u'data': {u'status': u'probe', u'smiles': u'CC1CC(C)CN(C1)c1cc(Nc2ccccc2C(O)=O)c2C(=O)c3ccccc3-c3onc1c23', u'name': u'IPR-456', u'rationale': u'lit-search;synthesis', u'report': u'inhibitor of the interaction of urokinase receptor with binding partners', u'id': u'UNKNOWN:IPR-456'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID56973724', u'data': {u'status': u'probe', u'smiles': u'COc1cc(OC2CCN(C)CC2)ccc1Nc1ncc2n(C)c(=O)n(C3CCCC3)c2n1', u'name': u'AZ-3146', u'rationale': u'lit-search', u'report': u'inhibitor of TTK protein kinase', u'id': u'CID56973724'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:VU0155056', u'data': {u'status': u'probe', u'smiles': u'O=C(NCCN1CCC(CC1)n1c2ccccc2[nH]c1=O)c1ccc2ccccc2c1', u'name': u'VU0155056', u'rationale': u'lit-search', u'report': u'inhibitor of phospholipase D1/D2', u'id': u'UNKNOWN:VU0155056'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K97651142', u'data': {u'status': u'probe', u'smiles': u'CN(CCc1cc(Br)c(OCCCNc2ncnc3n(C)cnc23)c(Br)c1)C(=O)c1ccc(C)cc1', u'name': u'BRD-K97651142', u'rationale': u'outreach', u'report': u'aphrocallistin derivative', u'id': u'UNKNOWN:BRD-K97651142'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID6184667', u'data': {u'status': u'probe', u'smiles': u'CC(C)(C)c1cc(cc(c1)C(C)(C)C)C(=O)\\C=C\\c1ccc(cc1)C(O)=O', u'name': u'Ch-55', u'rationale': u'chromatin;lit-search', u'report': u'agonist of retinoid acid receptors', u'id': u'CID6184667'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K79669418', u'data': {u'status': u'probe', u'smiles': u'CC(C)C[C@@H]1NC(=O)[C@H](CCCNC(N)=N)NC(=O)[C@H](Cc2c[nH]c3ccccc23)NC(=O)[C@H](CC(C)C)NC(=O)[C@H](CC(N)=O)NC(=O)[C@@](C)(CCCCCC\\C=C/CCC[C@](C)(NC(=O)[C@H](CC(C)C)NC1=O)C(=O)N[C@@H](CCC(N)=O)C(=O)N[C@@H](CC(N)=O)C(N)=O)NC(=O)[C@H](Cc1ccccc1)NC(=O)[C@@H](NC(=O)[C@H](CCC(N)=O)NC(=O)[C@H](CCC(N)=O)NC(=O)[C@H](CO)NC(=O)[C@H](CCC(N)=O)NC(C)=O)[C@@H](C)O', u'name': u'BRD-K79669418', u'rationale': u'outreach', u'report': u'inhibitor of MDM4-p53 interaction', u'id': u'UNKNOWN:BRD-K79669418'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K99584050', u'data': {u'status': u'probe', u'smiles': u'CC[C@H](C)[C@H](NC(C)=O)C(=O)N[C@@H](Cc1c[nH]c2ccccc12)C(=O)N[C@@H]([C@@H](C)CC)C(=O)N[C@@H](C)C(=O)N[C@@H](CCC(N)=O)C(=O)N[C@@H](CCC(O)=O)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H](CCCNC(N)=N)C(=O)N[C@@]1(C)CCC\\C=C/CCC[C@](C)(NC(=O)[C@H](CC(O)=O)NC(=O)CNC(=O)[C@@H](NC1=O)[C@@H](C)CC)C(=O)N[C@@H](Cc1ccccc1)C(=O)N[C@@H](CC(N)=O)C(=O)N[C@@H](C)C(=O)N[C@@H](Cc1ccc(O)cc1)C(=O)N[C@@H](Cc1ccc(O)cc1)C(=O)N[C@@H](C)C(=O)N[C@@H](CCCNC(N)=N)C(=O)N[C@@H](CCCNC(N)=N)C(N)=O', u'name': u'BRD-K99584050', u'rationale': u'outreach', u'report': u'stapled helical peptide', u'id': u'UNKNOWN:BRD-K99584050'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-A71883111', u'data': {u'status': u'probe', u'smiles': u'Fc1cccc(c1)N(C(C(=O)NC1CCCCC1)c1ccccc1Cl)C(=O)Cc1cccs1', u'name': u'BRD-A71883111', u'rationale': u'lit-search', u'report': u'putative inhibitor of IDH1 R132H', u'id': u'UNKNOWN:BRD-A71883111'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID444795', u'data': {u'status': u'probe', u'smiles': u'CC(=C/CO)\\C=C\\C=C(C)\\C=C\\C1=C(C)CCCC1(C)C.Cn1cnc2c(F)c(Nc3ccc(Br)cc3Cl)c(cc12)C(=O)NOCCO', u'name': u'selumetinib:tretinoin (2:1 mol/mol)', u'rationale': u'combination', u'report': u'inhibitor of MEK1 and MEK2;agonist of retinoid acid receptors', u'id': u'CID444795'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:necrostatin-7', u'data': {u'status': u'probe', u'smiles': u'Fc1ccc(cc1)-c1n[nH]cc1C=C1SC(=N)N(C1=O)c1nccs1', u'name': u'necrostatin-7', u'rationale': u'lit-search', u'report': u'inhibitor of necroptosis', u'id': u'UNKNOWN:necrostatin-7'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:PYR-41', u'data': {u'status': u'probe', u'smiles': u'CCOC(=O)c1ccc(cc1)N1NC(=O)C(=Cc2ccc(o2)[N+]([O-])=O)C1=O', u'name': u'PYR-41', u'rationale': u'lit-search', u'report': u'inhibitor of ubiquitin-activating enzyme in cells', u'id': u'UNKNOWN:PYR-41'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID52912189', u'data': {u'status': u'probe', u'smiles': u'COc1cc2c3n([C@H](C)c4ccccn4)c(=O)[nH]c3cnc2cc1-c1c(C)noc1C', u'name': u'I-BET151', u'rationale': u'chromatin;lit-search', u'report': u'inhibitor of bromodomain (BRD) and extra-C terminal domain (BET) proteins', u'id': u'CID52912189'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID148124', u'data': {u'status': u'probe', u'smiles': u'CO[C@H]1C[C@H](C)CC2=C(NCC=C)C(=O)C=C(NC(=O)\\C(C)=C\\C=C/[C@H](OC)[C@@H](OC(N)=O)\\C(C)=C\\[C@H](C)[C@H]1O)C2=O.CC(=O)O[C@@]12CO[C@@H]1C[C@H](O)[C@]1(C)C2[C@H](OC(=O)c2ccccc2)[C@]2(O)C[C@H](OC(=O)[C@H](O)[C@@H](NC(=O)OC(C)(C)C)c3ccccc3)C(C)=C([C@@H](O)C1=O)C2(C)C', u'name': u'docetaxel:tanespimycin (2:1 mol/mol)', u'rationale': u'combination', u'report': u'inhibitor of microtubule assembly;inhibitor of HSP90', u'id': u'CID148124'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:JW-480', u'data': {u'status': u'probe', u'smiles': u'CC(C)c1ccccc1OC(=O)NCCc1ccc2ccccc2c1', u'name': u'JW-480', u'rationale': u'lit-search', u'report': u'inhibitor of serine hydrolase enzyme NCEH', u'id': u'UNKNOWN:JW-480'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID445091', u'data': {u'status': u'probe', u'smiles': u'CC1(C)CC=C(c2cnc3ccccc3c2)c2cc(ccc12)C(=O)Nc1ccc(cc1)C(O)=O', u'name': u'BMS-195614', u'rationale': u'chromatin;lit-search', u'report': u'antagonist of retinoic acid receptors', u'id': u'CID445091'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K07442505', u'data': {u'status': u'probe', u'smiles': u'CCOc1ccccc1N\\N=C1C(=O)N(N=C\\1C)c1nc(cs1)-c1ccccc1', u'name': u'BRD-K07442505', u'rationale': u'outreach', u'report': u'stapled helical peptide activating BAX', u'id': u'UNKNOWN:BRD-K07442505'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K35604418', u'data': {u'status': u'probe', u'smiles': u'Cc1cs\\c(=N/C2CCCCC2)n1\\N=C\\c1ccc(O)c(O)c1O', u'name': u'BRD-K35604418', u'rationale': u'outreach', u'report': u'inhibitor of MCL1', u'id': u'UNKNOWN:BRD-K35604418'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:SB-743921', u'data': {u'status': u'clinical', u'smiles': u'CC(C)[C@H](N(CCCN)C(=O)c1ccc(C)cc1)c1oc2cc(Cl)ccc2c(=O)c1Cc1ccccc1', u'name': u'SB-743921', u'rationale': u'lit-search', u'report': u'inhibitor of kinesin 11', u'id': u'UNKNOWN:SB-743921'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID46943432', u'data': {u'status': u'probe', u'smiles': u'CCNC(=O)C[C@@H]1N=C(c2ccc(Cl)cc2)c2cc(OC)ccc2-n2c(C)nnc12', u'name': u'GSK525762A', u'rationale': u'chromatin;lit-search', u'report': u'inhibitor of bromodomain (BRD) and extra-C terminal domain (BET) proteins', u'id': u'CID46943432'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:pluripotin', u'data': {u'status': u'probe', u'smiles': u'CN1C(=O)N(Cc2cnc(Nc3cc(C)nn3C)nc12)c1cc(NC(=O)c2cccc(c2)C(F)(F)F)ccc1C.CC1(C)CCC(=C(CN2CCN(CC2)c2ccc(cc2)C(=O)NS(=O)(=O)c2ccc(N[C@H](CCN3CCOCC3)CSc3ccccc3)c(c2)S(=O)(=O)C(F)(F)F)C1)c1ccc(Cl)cc1', u'name': u'navitoclax:pluripotin (1:1 mol/mol)', u'rationale': u'combination', u'report': u'inhibitor of BCL2, BCL-xL, and BCL-W;promoter of embryonic stem cell self-renewal; inhibitor of Ras-GAP and ERK', u'id': u'UNKNOWN:pluripotin'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID9803433', u'data': {u'status': u'probe', u'smiles': u'OC(=O)CC[C@H]1CC[C@@](CC1)(c1cc(F)ccc1F)S(=O)(=O)c1ccc(Cl)cc1.Cc1sc-2c(c1C)C(=N[C@@H](CC(=O)OC(C)(C)C)c1nnc(C)n-21)c1ccc(Cl)cc1', u'name': u'JQ-1:MK-0752 (1:1 mol/mol)', u'rationale': u'combination', u'report': u'inhibitor of bromodomain (BRD) and extra-C terminal domain (BET) proteins;inhibitor of gamma-secretase', u'id': u'CID9803433'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:SMER-3', u'data': {u'status': u'probe', u'smiles': u'O=C1c2ccccc2-c2nc3nonc3nc12', u'name': u'SMER-3', u'rationale': u'lit-search', u'report': u'inhibitor of E3-ubiquitin ligase', u'id': u'UNKNOWN:SMER-3'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID9825149', u'data': {u'status': u'probe', u'smiles': u'Nc1ncnc2n(cc(-c3cccc(OCc4ccccc4)c3)c12)[C@H]1C[C@H](CN2CCCC2)C1', u'name': u'NVP-ADW742', u'rationale': u'kinome', u'report': u'inhibitor of insulin-like growth factor 1 receptor', u'id': u'CID9825149'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID49867926', u'data': {u'status': u'clinical', u'smiles': u'COc1cc(Nc2nc3ccccc3nc2NS(=O)(=O)c2ccc(NC(=O)c3ccc(C)c(OC)c3)cc2)cc(OC)c1', u'name': u'XL765', u'rationale': u'kinome', u'report': u'inhibitor of mTOR and PI3K kinase acitivities', u'id': u'CID49867926'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:ML258', u'data': {u'status': u'probe', u'smiles': u'COc1ccc(CN2c3nnnn3C3C(C2=O)C2(CCCC2)Cc2ccccc32)cc1', u'name': u'ML258', u'rationale': u'outreach', u'report': u'inhibitor of BIM-BCL-B interaction', u'id': u'UNKNOWN:ML258'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID44241473', u'data': {u'status': u'probe', u'smiles': u'CC(=O)Nc1nc(C)c(s1)S(=O)(=O)Nc1ccc(cc1)C(O)(C(F)(F)F)C(F)(F)F', u'name': u'SR1001', u'rationale': u'chromatin;lit-search', u'report': u'synthetic ROR ligand; suppressor of TH17 differentiation', u'id': u'CID44241473'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BMS-270394', u'data': {u'status': u'probe', u'smiles': u'CC1(C)CCC(C)(C)c2cc(ccc12)[C@@H](O)C(=O)Nc1ccc(cc1F)C(O)=O', u'name': u'BMS-270394', u'rationale': u'chromatin;lit-search', u'report': u'antagonist of retinoic acid receptor gamma', u'id': u'UNKNOWN:BMS-270394'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:fluvastatin', u'data': {u'status': u'FDA', u'smiles': u'CC(C)N1C(\\C=C\\C(O)CC(O)CC(O)=O)C(c2ccccc12)c1ccc(F)cc1', u'name': u'fluvastatin', u'rationale': u'lit-search', u'report': u'inhibitor of HMG-CoA reductase', u'id': u'UNKNOWN:fluvastatin'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID51039095', u'data': {u'status': u'clinical', u'smiles': u'COc1cc(CCc2cc(NC(=O)c3ccc(cc3)N3C[C@H](C)N[C@H](C)C3)n[nH]2)cc(OC)c1', u'name': u'AZD4547', u'rationale': u'lit-search', u'report': u'inhibitor of fibroblast growth factor receptors', u'id': u'CID51039095'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID441298', u'data': {u'status': u'clinical', u'smiles': u'CC(C)C(=O)[C@@]12C(=O)C(CC=C(C)C)C(=O)C(CC=C(C)C)(C[C@H](CC=C(C)C)[C@@]1(C)CCC=C(C)C)C2=O', u'name': u'hyperforin', u'rationale': u'lit-search', u'report': u'agonist of calcium-permeable ion channels', u'id': u'CID441298'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:NVP-231', u'data': {u'status': u'probe', u'smiles': u'O=C(Nc1nc2ccc(NC(=O)C34C[C@H]5C[C@H](C[C@H](C5)C3)C4)cc2s1)c1ccccc1', u'name': u'NVP-231', u'rationale': u'kinome', u'report': u'inhibitor of ceramide kinase', u'id': u'UNKNOWN:NVP-231'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:bosutinib', u'data': {u'status': u'FDA', u'smiles': u'COc1cc(Nc2cc(nc3cc(OCCCN4CCN(C)CC4)c(OC)cc23)C#N)c(Cl)cc1Cl', u'name': u'bosutinib', u'rationale': u'kinome', u'report': u'inhibitor of SRC and ABL1', u'id': u'UNKNOWN:bosutinib'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:temsirolimus', u'data': {u'status': u'FDA', u'smiles': u'CO[C@@H]1C[C@H](C[C@@H](C)[C@@H]2CC(=O)[C@H](C)\\C=C(C)\\[C@@H](O)[C@@H](OC)C(=O)[C@H](C)C[C@H](C)\\C=C\\C=C\\C=C(C)\\[C@H](C[C@@H]3CC[C@@H](C)[C@@](O)(O3)C(=O)C(=O)N3CCCC[C@H]3C(=O)O2)OC)CC[C@H]1OC(=O)C(C)(CO)CO', u'name': u'temsirolimus', u'rationale': u'CTEP;kinome;std-of-care', u'report': u'inhibitor of mTOR', u'id': u'UNKNOWN:temsirolimus'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:PD318088', u'data': {u'status': u'probe', u'smiles': u'OCC(O)CONC(=O)c1cc(Br)c(F)c(F)c1Nc1ccc(I)cc1F', u'name': u'PD318088', u'rationale': u'kinome', u'report': u'inhibitor of MEK1 and MEK2', u'id': u'UNKNOWN:PD318088'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID15953870', u'data': {u'status': u'probe', u'smiles': u'C[C@H]1CN(CC(=O)Nc2ccc3Sc4c(Cc3c2)cccc4-c2cc(=O)cc(o2)N2CCOCC2)C[C@@H](C)O1', u'name': u'KU-60019', u'rationale': u'kinome', u'report': u'inhibitor of ataxia telangiectasia mutated (ATM)', u'id': u'CID15953870'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID156422', u'data': {u'status': u'probe', u'smiles': u'Cc1ccc(cc1)-n1nc(cc1NC(=O)Nc1ccc(OCCN2CCOCC2)c2ccccc12)C(C)(C)C', u'name': u'BIRB-796', u'rationale': u'kinome', u'report': u'inhibitor of p38 MAPK', u'id': u'CID156422'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID11427553', u'data': {u'status': u'clinical', u'smiles': u'O=C(N1CCNCC1)c1ccc(cc1)\\C=C\\c1n[nH]c2ccccc12', u'name': u'KW-2449', u'rationale': u'kinome', u'report': u'inhibitor of FLT3 and AURKA', u'id': u'CID11427553'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID11656518', u'data': {u'status': u'clinical', u'smiles': u'Cn1c(Nc2ccc(cc2)C(F)(F)F)nc2cc(Oc3ccnc(c3)-c3ncc([nH]3)C(F)(F)F)ccc12', u'name': u'RAF265', u'rationale': u'kinome', u'report': u'ihibitor of VEGFR2 and BRAF', u'id': u'CID11656518'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K03911514', u'data': {u'status': u'probe', u'smiles': u'CCCC[C@H](NC(=O)[C@H](CCCNC(N)=N)NC(=O)[C@H](CCC(N)=O)NC(=O)[C@@H](NC(=O)[C@]1(C)CCC\\C=C/CCC[C@](C)(NC(=O)[C@H](CC(C)C)NC(=O)[C@H](CO)NC(=O)[C@H](CCCNC(N)=N)NC(=O)[C@H](CCC(O)=O)NC(=O)[C@H](CCCNC(N)=N)NC(=O)[C@H](Cc2cnc[nH]2)NC(=O)[C@H](CCC(O)=O)NC(=O)[C@H](CC(C)C)NC(=O)[C@H](CCC(N)=O)NC(=O)[C@H](CCC(O)=O)NC(=O)[C@H](CCC(N)=O)NC(=O)[C@H](CO)NC(=O)[C@H](CC(C)C)NC(C)=O)C(=O)N[C@@H]([C@@H](C)O)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H](CCCNC(N)=N)C(=O)N1)[C@@H](C)CC)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H](Cc1ccccc1)C(N)=O', u'name': u'BRD-K03911514', u'rationale': u'outreach', u'report': u'stapled helical peptide', u'id': u'UNKNOWN:BRD-K03911514'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K16130065', u'data': {u'status': u'probe', u'smiles': u'CC[C@H](C)[C@H](NC(C)=O)C(=O)N[C@@H](Cc1c[nH]c2ccccc12)C(=O)N[C@@H]([C@@H](C)CC)C(=O)N[C@@H](C)C(=O)N[C@@H](CCC(N)=O)C(=O)N[C@@H](CCC(O)=O)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H](CC(O)=O)C(=O)N[C@@]1(C)CCC\\C=C/CCC[C@](C)(NC(=O)[C@H](CC(O)=O)NC(=O)CNC(=O)[C@@H](NC1=O)[C@@H](C)CC)C(=O)N[C@@H](Cc1ccccc1)C(=O)N[C@@H](CC(N)=O)C(=O)N[C@@H](C)C(=O)N[C@@H](Cc1ccc(O)cc1)C(=O)N[C@@H](Cc1ccc(O)cc1)C(=O)N[C@@H](C)C(=O)N[C@@H](CCCNC(N)=N)C(=O)N[C@@H](CCCNC(N)=N)C(N)=O', u'name': u'BRD-K16130065', u'rationale': u'outreach', u'report': u'stapled helical peptide', u'id': u'UNKNOWN:BRD-K16130065'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID11625818', u'data': {u'status': u'clinical', u'smiles': u'CC[C@H](Nc1ncnc2[nH]cnc12)c1nc2cccc(F)c2c(=O)n1-c1ccccc1', u'name': u'CAL-101', u'rationale': u'kinome', u'report': u'inhibitor of PI3K catalytic subunit delta', u'id': u'CID11625818'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:LY-2157299', u'data': {u'status': u'probe', u'smiles': u'Cc1cccc(n1)-c1nn2CCCc2c1-c1ccnc2ccc(cc12)C(N)=O', u'name': u'LY-2157299', u'rationale': u'kinome', u'report': u'inhibitor of the transforming growth factor beta type 1 receptor', u'id': u'UNKNOWN:LY-2157299'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:WP1130', u'data': {u'status': u'probe', u'smiles': u'CCC[C@H](NC(=O)C(=C\\c1cccc(Br)n1)\\C#N)c1ccccc1', u'name': u'WP1130', u'rationale': u'lit-search', u'report': u'inhibitor of the deubiquitinase activity of USP9X, USP5, USP14, and UCH37', u'id': u'UNKNOWN:WP1130'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID44224160', u'data': {u'status': u'clinical', u'smiles': u'COc1cccc2cc([nH]c12)-c1nc([C@H]2CC[C@@H](CC2)C(O)=O)n2ncnc(N)c12', u'name': u'OSI-027', u'rationale': u'lit-search', u'report': u'inhibitor of mTORC1 and mTORC2', u'id': u'CID44224160'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:NVP-BSK805', u'data': {u'status': u'probe', u'smiles': u'Fc1cc(cc(F)c1CN1CCOCC1)-c1cccc2ncc(nc12)-c1cnn(c1)C1CCNCC1', u'name': u'NVP-BSK805', u'rationale': u'kinome', u'report': u'inhibitor of Janus kinase 2', u'id': u'UNKNOWN:NVP-BSK805'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID6852167', u'data': {u'status': u'probe', u'smiles': u'CC(=O)Nc1nc(C)c(s1)-c1ccc(Cl)c(c1)S(=O)(=O)NCCO', u'name': u'PIK-93', u'rationale': u'kinome', u'report': u'inhibitor of PI3K catalytic subunit gamma', u'id': u'CID6852167'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID11152667', u'data': {u'status': u'clinical', u'smiles': u'NC(=O)Nc1cc(sc1C(=O)N[C@H]1CCCNC1)-c1cccc(F)c1', u'name': u'AZD7762', u'rationale': u'kinome', u'report': u'inhibitor of checkpoint kinases 1 and 2', u'id': u'CID11152667'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID23635314', u'data': {u'status': u'clinical', u'smiles': u'O=C(Cc1ccc(cn1)-c1ccc(OCCN2CCOCC2)cc1)NCc1ccccc1', u'name': u'KX2-391', u'rationale': u'kinome', u'report': u'peptide mimetic; inhibitor of SRC activity in cells', u'id': u'CID23635314'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID9866186', u'data': {u'status': u'probe', u'smiles': u'OC(=O)\\C=C\\c1ccc(c(Cl)c1)-c1ccc(O)c(c1)C12C[C@H]3C[C@H](C[C@H](C3)C1)C2', u'name': u'3-Cl-AHPC', u'rationale': u'outreach', u'report': u'binder of nuclear receptor SHP', u'id': u'CID9866186'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K58730230', u'data': {u'status': u'probe', u'smiles': u'CC(C)C[C@H](NC(=O)[C@H](C)NC(=O)[C@H](CCCCN)NC(=O)[C@H](CCCNC(N)=N)NC(C)=O)C(=O)N[C@@H](CCC(O)=O)C(=O)N[C@@H]([C@@H](C)O)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H](CCCNC(N)=N)C(=O)N[C@@H](CCCNC(N)=N)C(=O)N[C@@H](C(C)C)C(=O)NCC(=O)N[C@@H](CC(O)=O)C(=O)N[C@@H](CCC(O)=O)C(=O)N[C@@H](C(C)C)C(=O)N[C@@]1(C)CCC\\C=C/CCC[C@](C)(NC(=O)[C@H](Cc2cnc[nH]2)NC(=O)[C@H](CC(N)=O)NC(=O)[C@H](CCCNC(N)=N)NC1=O)C(=O)N[C@@H]([C@@H](C)O)C(=O)N[C@@H](C)C(=O)N[C@@H](Cc1ccccc1)C(N)=O', u'name': u'BRD-K58730230', u'rationale': u'outreach', u'report': u'stapled helical peptide', u'id': u'UNKNOWN:BRD-K58730230'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K27188169', u'data': {u'status': u'probe', u'smiles': u'CC(C)C[C@H](NC(=O)[C@H](C)NC(=O)[C@H](CCCCN)NC(=O)[C@H](CCCNC(N)=N)NC(C)=O)C(=O)N[C@@H](CCC(O)=O)C(=O)N[C@@H]([C@@H](C)O)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H](CCCNC(N)=N)C(=O)N[C@@H](CCCNC(N)=N)C(=O)N[C@@H](C(C)C)C(=O)NCC(=O)N[C@@H](CC(O)=O)C(=O)NCC(=O)N[C@@H](C(C)C)C(=O)N[C@@]1(C)CCC\\C=C/CCC[C@](C)(NC(=O)[C@H](Cc2cnc[nH]2)NC(=O)[C@H](CC(N)=O)NC(=O)[C@H](CCCNC(N)=N)NC1=O)C(=O)N[C@@H]([C@@H](C)O)C(=O)N[C@@H](C)C(=O)N[C@@H](Cc1ccccc1)C(N)=O', u'name': u'BRD-K27188169', u'rationale': u'outreach', u'report': u'stapled helical peptide', u'id': u'UNKNOWN:BRD-K27188169'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:KHS101', u'data': {u'status': u'probe', u'smiles': u'CC(C)CNc1ccnc(NCc2csc(n2)-c2ccccc2)n1', u'name': u'KHS101', u'rationale': u'lit-search', u'report': u'binder of TACC3, a component of the centrosome and mitotic spindle', u'id': u'UNKNOWN:KHS101'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID10026128', u'data': {u'status': u'probe', u'smiles': u'CC(C)OC(=O)C1=CN(CC(C)(C)c2c1[nH]c1ccccc21)C(=O)c1ccc(F)c(F)c1', u'name': u'WAY-362450', u'rationale': u'chromatin;lit-search', u'report': u'agonist of farnesoid X receptor', u'id': u'CID10026128'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K13185470', u'data': {u'status': u'probe', u'smiles': u'CC(C)C[C@H](NC(=O)[C@H](C)NC(=O)[C@H](CCCCN)NC(=O)[C@H](CCCNC(N)=N)NC(C)=O)C(=O)N[C@@H](CCC(O)=O)C(=O)N[C@@H]([C@@H](C)O)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H](CCCNC(N)=N)C(=O)N[C@@H](CCCNC(N)=N)C(=O)N[C@@H](C(C)C)C(=O)N[C@@H](CCC(O)=O)C(=O)N[C@@H](CC(O)=O)C(=O)NCC(=O)N[C@@H](C(C)C)C(=O)N[C@@]1(C)CCC\\C=C/CCC[C@](C)(NC(=O)[C@H](Cc2cnc[nH]2)NC(=O)[C@H](CC(N)=O)NC(=O)[C@H](CCCNC(N)=N)NC1=O)C(=O)N[C@@H]([C@@H](C)O)C(=O)N[C@@H](C)C(=O)N[C@@H](Cc1ccccc1)C(N)=O', u'name': u'BRD-K13185470', u'rationale': u'outreach', u'report': u'stapled helical peptide targeting MCL1', u'id': u'UNKNOWN:BRD-K13185470'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K03536150', u'data': {u'status': u'probe', u'smiles': u'CC1=NN(C(=O)C\\1=N\\Nc1ccccc1C(O)=O)c1nc(cs1)-c1ccccc1', u'name': u'BRD-K03536150', u'rationale': u'outreach', u'report': u'activator of BAX', u'id': u'UNKNOWN:BRD-K03536150'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K34222889', u'data': {u'status': u'probe', u'smiles': u'COc1ccc(cc1)C#CC1=CCCN(C(=O)\\C=C\\c2cc(OC)c(OC)c(OC)c2)C1=O', u'name': u'BRD-K34222889', u'rationale': u'outreach', u'report': u'analog of the natural product piperlongumine', u'id': u'UNKNOWN:BRD-K34222889'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:linsitinib', u'data': {u'status': u'clinical', u'smiles': u'CC1(O)CC(C1)c2nc(c3ccc4ccc(nc4c3)c5ccccc5)c6c(N)nccn26', u'name': u'linsitinib', u'rationale': u'CTEP;kinome;pilot-set', u'report': u'inhibitor of insulin-like growth factor 1 receptor and insulin receptor', u'id': u'UNKNOWN:linsitinib'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:ML006', u'data': {u'status': u'probe', u'smiles': u'C1CN(CCO1)c1nnc(-c2ccccc2)c(n1)-c1ccccc1', u'name': u'ML006', u'rationale': u'pilot-set', u'report': u'agonist of sphingosine 1-phosphate receptor 3', u'id': u'UNKNOWN:ML006'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:Bax channel blocker', u'data': {u'status': u'probe', u'smiles': u'OC(CN1CCNCC1)Cn1c2ccc(Br)cc2c2cc(Br)ccc12', u'name': u'Bax channel blocker', u'rationale': u'pilot-set', u'report': u'inhibitor of BAX-mediated mitochondrial cytochrome c release', u'id': u'UNKNOWN:Bax channel blocker'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID638278', u'data': {u'status': u'probe', u'smiles': u'Oc1ccc(cc1)\\C=C\\C(=O)c1ccc(O)cc1O', u'name': u'isoliquiritigenin', u'rationale': u'pilot-set', u'report': u'natural product', u'id': u'CID638278'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID409805', u'data': {u'status': u'probe', u'smiles': u'CCN(CC)CCCC(C)Nc1nc(C)cc(Nc2ccc3nc(C)cc(N)c3c2)n1', u'name': u'NSC23766', u'rationale': u'pilot-set', u'report': u'inhibitor of RAC1-GEF interaction; prevents Rac1 activation by Rac-specific guanine nucleotide exchange factors (GEFs) TrioN and Tiam1', u'id': u'CID409805'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID25150857', u'data': {u'status': u'probe', u'smiles': u'COc1cc2nc(nc(NC3CCN(Cc4ccccc4)CC3)c2cc1OC)N1CCCN(C)CC1', u'name': u'BIX-01294', u'rationale': u'chromatin;pilot-set', u'report': u'inhibitor of G9a histone methyltransferase', u'id': u'CID25150857'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID5743', u'data': {u'status': u'FDA', u'smiles': u'CC1CC2C3CCC4=CC(=O)C=CC4(C)C3(F)C(O)CC2(C)C1(O)C(=O)CO', u'name': u'dexamethasone', u'rationale': u'pilot-set', u'report': u'agonist of glucocorticoid receptor', u'id': u'CID5743'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:ML029', u'data': {u'status': u'probe', u'smiles': u'Cc1cc2nc(NCCCO)n(CC(=O)c3cc(c(O)c(c3)C(C)(C)C)C(C)(C)C)c2cc1C', u'name': u'ML029', u'rationale': u'chromatin;pilot-set', u'report': u'inhibitor of antigen receptor-mediated NFkappaB activity', u'id': u'UNKNOWN:ML029'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID122327', u'data': {u'status': u'probe', u'smiles': u'CCCCCCCCCCC(C)(C)C(=O)Nc1c(OC)cc(OC)cc1OC', u'name': u'CI-976', u'rationale': u'pilot-set', u'report': u'inhibitor of acetyl-CoA acetyltransferase I', u'id': u'CID122327'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BMS-536924', u'data': {u'status': u'probe', u'smiles': u'Cc1cc(cc2[nH]c(nc12)-c1c(NC[C@@H](O)c2cccc(Cl)c2)cc[nH]c1=O)N1CCOCC1', u'name': u'BMS-536924', u'rationale': u'pilot-set', u'report': u'inhibitor of insulin-like growth factor 1 receptor (IGF1R) and insulin receptor (INSR)', u'id': u'UNKNOWN:BMS-536924'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K09587429', u'data': {u'status': u'GE-active', u'smiles': u'C[C@@H](NC(=O)C[C@@H]1CC[C@@H](NC(=O)CN2CCOCC2)[C@H](CO)O1)c1ccccc1', u'name': u'BRD-K09587429', u'rationale': u'DOS;profiling', u'report': u'product of diversity oriented synthesis', u'id': u'UNKNOWN:BRD-K09587429'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID10427712', u'data': {u'status': u'clinical', u'smiles': u'Nc1nc(N)c2nc(-c3cccc(O)c3)c(nc2n1)-c1cccc(O)c1', u'name': u'TG-100-115', u'rationale': u'kinome', u'report': u'inhibitor of PI3K catalytic subunits delta and gamma', u'id': u'CID10427712'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:elocalcitol', u'data': {u'status': u'clinical', u'smiles': u'CCC(O)(CC)\\C=C\\CC(C)C1=CC[C@@H]2[C@]1(C)CCC\\C2=C/C=C1/C[C@@H](O)C[C@H](F)C1=C', u'name': u'elocalcitol', u'rationale': u'lit-search', u'report': u'agonist of vitamin D receptor', u'id': u'UNKNOWN:elocalcitol'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID4788', u'data': {u'status': u'probe', u'smiles': u'Oc1ccc(CCC(=O)c2c(O)cc(O)cc2O)cc1', u'name': u'phloretin', u'rationale': u'pilot-set', u'report': u'natural product; inhibitor of glucose uptake', u'id': u'CID4788'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K26531177', u'data': {u'status': u'probe', u'smiles': u'COc1cc(CCC(=O)N2CCC=CC2=O)cc(OC)c1OC', u'name': u'BRD-K26531177', u'rationale': u'outreach', u'report': u'analog of the natural product piperlongumine', u'id': u'UNKNOWN:BRD-K26531177'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID9813758', u'data': {u'status': u'probe', u'smiles': u'Cc1cnc2c(NCCN)nc3ccc(C)cc3n12', u'name': u'BMS-345541', u'rationale': u'kinome', u'report': u'inhibitor of IKK-2', u'id': u'CID9813758'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID2907', u'data': {u'status': u'FDA', u'smiles': u'ClCCN(CCCl)P1(=O)NCCCO1', u'name': u'cyclophosphamide', u'rationale': u'std-of-care', u'report': u'DNA alkylator', u'id': u'CID2907'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID4477', u'data': {u'status': u'FDA', u'smiles': u'Oc1ccc(Cl)cc1C(=O)Nc1ccc(cc1Cl)[N+]([O-])=O', u'name': u'niclosamide', u'rationale': u'lit-search', u'report': u'inhibitor of STAT3 signaling', u'id': u'CID4477'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID2126', u'data': {u'status': u'probe', u'smiles': u'CC1(C)CCC(C)(C)c2cc(ccc12)C(=O)Nc1ccc(cc1)C(O)=O', u'name': u'AM-580', u'rationale': u'chromatin;pilot-set', u'report': u'agonist of retinoic acid receptor alpha', u'id': u'CID2126'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID3825829', u'data': {u'status': u'probe', u'smiles': u'COc1cc(c(Cl)cc1Cl)-n1c(=S)[nH]c2ccccc2c1=O', u'name': u'Mdivi-1', u'rationale': u'lit-search', u'report': u'inhibitor of dynamin 1; inhibitor of mitrochondrial division inhibitor', u'id': u'CID3825829'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID11317348', u'data': {u'status': u'probe', u'smiles': u'COc1cc2nccc(Oc3ccc(NC(=O)Nc4ccc(F)cc4F)c(F)c3)c2cc1OC', u'name': u'Ki8751', u'rationale': u'kinome', u'report': u'inhibitor of VEGFR2, c-KIT, and PDGFRA', u'id': u'CID11317348'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:oxaliplatin', u'data': {u'status': u'FDA', u'smiles': u'O=C1O[Pt]2(NC3CCCCC3N2)OC1=O', u'name': u'oxaliplatin', u'rationale': u'std-of-care', u'report': u'DNA alkylator; organoplatinum reagent', u'id': u'UNKNOWN:oxaliplatin'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:tosedostat', u'data': {u'status': u'clinical', u'smiles': u'CC(C)C[C@H]([C@H](O)C(=O)NO)C(=O)N[C@H](C(=O)OC1CCCC1)c1ccccc1', u'name': u'tosedostat', u'rationale': u'pilot-set', u'report': u'inhibitor of leucine aminopeptidase 3 (LAP), puromycin-sensitive aminopeptidase (PuSA), and aminopeptidase N', u'id': u'UNKNOWN:tosedostat'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:YL54', u'data': {u'status': u'probe', u'smiles': u'CC[C@H](C)[C@H](NC(=O)[C@H](CCCNC(N)=N)NC(=O)[C@H](CCCNC(N)=N)NC(=O)CCNC(C)=O)C(=O)N[C@]1(C)CCC\\C=C/CCC[C@@](C)(NC(=O)[C@H](CC(C)C)NC(=O)[C@H](CC(C)C)NC(=O)[C@H](CCSC)NC1=O)C(=O)N[C@@H](C)C(=O)N[C@@H](C)C(=O)N[C@@H](CC(N)=O)C(=O)N[C@@H](CCCNC(N)=N)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H](CCC(O)=O)C(=O)N[C@@H](CCCNC(N)=N)C(O)=O', u'name': u'YL54', u'rationale': u'outreach', u'report': u'stapled helical peptide', u'id': u'UNKNOWN:YL54'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:PF-184', u'data': {u'status': u'probe', u'smiles': u'C[C@@]1(CO)CN(C[C@]1(C)CO)c1cc(C(=O)Nc2ccc3CCc4c(nn(c4-c3c2)-c2ccc(F)cc2)C(N)=O)c(Cl)cn1', u'name': u'PF-184', u'rationale': u'kinome', u'report': u'inhibitor of IKK-2', u'id': u'UNKNOWN:PF-184'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:AT7867', u'data': {u'status': u'probe', u'smiles': u'Clc1ccc(cc1)C1(CCNCC1)c1ccc(cc1)-c1cn[nH]c1', u'name': u'AT7867', u'rationale': u'chromatin;kinome', u'report': u'inhibitor of AKT1/2/3 and S6K', u'id': u'UNKNOWN:AT7867'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID11977753', u'data': {u'status': u'clinical', u'smiles': u'Cn1c2cnc3ccc(cc3c2n(-c2ccc(cc2)C(C)(C)C#N)c1=O)-c1cnc2ccccc2c1', u'name': u'NVP-BEZ235', u'rationale': u'kinome;outreach;pilot-set', u'report': u'inhibitor of PI3K and mTOR kinase activity', u'id': u'CID11977753'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:avrainvillamide', u'data': {u'status': u'probe', u'smiles': u'CC1(C)Oc2ccc3C4=C[C@@]56NC(=O)[C@]7(CCCN7C5=O)C[C@H]6C(C)(C)C4=[N+]([O-])c3c2C=C1', u'name': u'avrainvillamide', u'rationale': u'pilot-set', u'report': u'natural product; inhibitor of nucleophosmin', u'id': u'UNKNOWN:avrainvillamide'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K09344309', u'data': {u'status': u'probe', u'smiles': u'C[C@H](CO)N1C[C@@H](C)[C@H](CN(C)Cc2ccc3OCOc3c2)Oc2c(NC(=O)c3ccncc3)cccc2C1=O', u'name': u'BRD-K09344309', u'rationale': u'DOS;outreach', u'report': u'screening hit', u'id': u'UNKNOWN:BRD-K09344309'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID227681', u'data': {u'status': u'probe', u'smiles': u'CCC(=O)OCN1C(=O)C=CC1=O', u'name': u'NSC19630', u'rationale': u'lit-search', u'report': u'inhibitor of Werner syndrome helicase activity', u'id': u'CID227681'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID46843906', u'data': {u'status': u'probe', u'smiles': u'COc1cc(ccc1Nc1ncc2N(C)C(=O)c3ccccc3N(C)c2n1)C(=O)N1CCC(CC1)N1CCN(C)CC1', u'name': u'LRRK2-IN-1', u'rationale': u'kinome', u'report': u'inhibitor of leucine-rich repeat kinase 2; inhibitor of doublecortin-like kinase', u'id': u'CID46843906'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID44237094', u'data': {u'status': u'probe', u'smiles': u'CCOC(=O)c1c(C(=CN)C#N)c2ccc(Cl)c(Cl)c2n1C', u'name': u'KH-CB19', u'rationale': u'kinome', u'report': u'inhibitor of CDC2-like kinases 1 and 4', u'id': u'CID44237094'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:KPT185', u'data': {u'status': u'probe', u'smiles': u'COc1cc(cc(c1)C(F)(F)F)-c1ncn(\\C=C/C(=O)OC(C)C)n1', u'name': u'KPT185', u'rationale': u'outreach', u'report': u'inhibitor of exportin 1', u'id': u'UNKNOWN:KPT185'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:pitstop2', u'data': {u'status': u'probe', u'smiles': u'Brc1ccc(cc1)\\C=C1/SC(NS(=O)(=O)c2cccc3ccccc23)=NC1=O', u'name': u'pitstop2', u'rationale': u'lit-search', u'report': u'inhibitor of clathrin and clathrin-independent endocytosis', u'id': u'UNKNOWN:pitstop2'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:R428', u'data': {u'status': u'probe', u'smiles': u'Nc1nc(Nc2ccc3CC[C@@H](CCc3c2)N2CCCC2)nn1-c1cc2CCCc3ccccc3-c2nn1', u'name': u'R428', u'rationale': u'kinome', u'report': u'inhibitor of the tyrosine-protein kinase receptor UFO', u'id': u'UNKNOWN:R428'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:A-804598', u'data': {u'status': u'probe', u'smiles': u'C[C@H](\\N=C(\\NC#N)Nc1cccc2ncccc12)c1ccccc1', u'name': u'A-804598', u'rationale': u'lit-search', u'report': u'inhibitor of purinergic receptor P2X', u'id': u'UNKNOWN:A-804598'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:COL-3', u'data': {u'status': u'clinical', u'smiles': u'NC(=O)C1C(=O)C[C@@H]2C[C@@H]3Cc4cccc(O)c4C(=O)C3C(=O)[C@]2(O)C1=O', u'name': u'COL-3', u'rationale': u'outreach', u'report': u'analog of tetracycline', u'id': u'UNKNOWN:COL-3'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID49846579', u'data': {u'status': u'clinical', u'smiles': u'CC1(C)CCC(CN2CCN(CC2)c2ccc(C(=O)NS(=O)(=O)c3ccc(NCC4CCOCC4)c(c3)[N+]([O-])=O)c(Oc3cnc4[nH]ccc4c3)c2)=C(C1)c1ccc(Cl)cc1', u'name': u'ABT-199', u'rationale': u'lit-search', u'report': u'inhibitor of BCL2', u'id': u'CID49846579'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:ETP-46464', u'data': {u'status': u'probe', u'smiles': u'CC(C)(C#N)c1ccc(cc1)N1C(=O)OCc2cnc3ccc(cc3c12)-c1cnc2ccccc2c1', u'name': u'ETP-46464', u'rationale': u'lit-search', u'report': u'inhibitor of serine/threonine-protein kinase ATR', u'id': u'UNKNOWN:ETP-46464'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:marinopyrrole A', u'data': {u'status': u'probe', u'smiles': u'Oc1ccccc1C(=O)c1[nH]c(Cl)c(Cl)c1-n1c(cc(Cl)c1Cl)C(=O)c1ccccc1O', u'name': u'marinopyrrole A', u'rationale': u'outreach', u'report': u'natural product; putative inhibitor of MCL1', u'id': u'UNKNOWN:marinopyrrole A'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:methylstat', u'data': {u'status': u'probe', u'smiles': u'COC(=O)\\C=C\\C(=O)N(O)CCCCNCc1ccc(COC(=O)Nc2cccc3ccccc23)cc1', u'name': u'methylstat', u'rationale': u'chromatin;lit-search;outreach', u'report': u'inhibitor of lysine specific demethylases', u'id': u'UNKNOWN:methylstat'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID56649450', u'data': {u'status': u'clinical', u'smiles': u'Cc1nc(NC(=O)N2CCC[C@H]2C(N)=O)sc1-c1ccnc(c1)C(C)(C)C(F)(F)F', u'name': u'BYL-719', u'rationale': u'kinome', u'report': u'inhibitor of PI3K catalytic subunit alpha', u'id': u'CID56649450'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID56949517', u'data': {u'status': u'clinical', u'smiles': u'Cc1nc2c(cc(cc2n1Cc1cccc(c1C)C(F)(F)F)N1CCOCC1)C(O)=O', u'name': u'GSK2636771', u'rationale': u'kinome', u'report': u'inhibitor of PI3K catalytic subunit beta', u'id': u'CID56949517'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:JW-74', u'data': {u'status': u'probe', u'smiles': u'COc1ccc(cc1)-n1c(SCc2nc(no2)-c2ccc(C)cc2)nnc1-c1ccncc1', u'name': u'JW-74', u'rationale': u'lit-search', u'report': u'inhibitor of WNT signaling', u'id': u'UNKNOWN:JW-74'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:necrosulfonamide', u'data': {u'status': u'probe', u'smiles': u'COc1nccnc1NS(=O)(=O)c1ccc(NC(=O)\\C=C\\c2ccc(s2)[N+]([O-])=O)cc1', u'name': u'necrosulfonamide', u'rationale': u'lit-search', u'report': u'inhibitor of downstream signaling of RIP3 associated with MLKL', u'id': u'UNKNOWN:necrosulfonamide'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:HBX-41108', u'data': {u'status': u'probe', u'smiles': u'Clc1ccc-2c(c1)C(=O)c1nc(C#N)c(nc-21)C#N', u'name': u'HBX-41108', u'rationale': u'lit-search', u'report': u'inhibitor of the deubiquitinase activity of USP7', u'id': u'UNKNOWN:HBX-41108'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:palmostatin B', u'data': {u'status': u'probe', u'smiles': u'CCCCCCCCCC[C@H]1[C@H](CCc2ccc(OC)c(OC)c2)OC1=O', u'name': u'palmostatin B', u'rationale': u'lit-search', u'report': u'inhibitor of acyl-protein thioesterase 1', u'id': u'UNKNOWN:palmostatin B'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:JW-55', u'data': {u'status': u'probe', u'smiles': u'COc1ccc(cc1)C1(CNC(=O)c2ccc(NC(=O)c3ccco3)cc2)CCOCC1', u'name': u'JW-55', u'rationale': u'lit-search', u'report': u'inhibitor of tankyrase', u'id': u'UNKNOWN:JW-55'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID25022340', u'data': {u'status': u'probe', u'smiles': u'CNC(C)C(=O)NC1CN(CCC2CCC(N2C1=O)C(=O)NC(c3ccccc3)c4ccccc4)C(=O)CC(C)C', u'name': u'AT-406', u'rationale': u'lit-search;synthesis', u'report': u'SMAC mimetic; inhibitor of inhibitor of apoptosis proteins (IAPs)', u'id': u'CID25022340'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID44607530', u'data': {u'status': u'probe', u'smiles': u'COc1cc(ccc1Nc1ncc(Cl)c(Oc2cccc(NC(=O)C=C)c2)n1)N1CCN(C)CC1', u'name': u'WZ4002', u'rationale': u'kinome', u'report': u'inhibitor of EGFR targeting T790M resistance', u'id': u'CID44607530'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:ML334 diastereomer', u'data': {u'status': u'probe', u'smiles': u'OC(=O)[C@@H]1CCCC[C@@H]1C(=O)N1CCc2ccccc2[C@H]1CN1C(=O)c2ccccc2C1=O', u'name': u'ML334 diastereomer', u'rationale': u'lit-search;synthesis', u'report': u'inhibitor of KEAP1-NFE2L2 protein-protein interaction', u'id': u'UNKNOWN:ML334 diastereomer'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:GSK1059615', u'data': {u'status': u'clinical', u'smiles': u'O=C1NC(=O)\\C(S1)=C\\c1ccc2nccc(-c3ccncc3)c2c1', u'name': u'GSK1059615', u'rationale': u'kinome', u'report': u'inhibitor of PI3K and mTOR kinase activity', u'id': u'UNKNOWN:GSK1059615'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K55473186', u'data': {u'status': u'probe', u'smiles': u'CCC(C)C(NC(=O)C(CCCNC(=N)N)NC(=O)C(CCCNC(=N)N)NC(=O)C(CCCNC(=N)N)NC(=O)C(CC(C)C)NC(=O)C(CCCNC(=N)N)NC(=O)C(CCC(=O)O)NC(=O)CCNC(=O)C)C(=O)NC1(C)CCCC=CCCCC(C)(NC(=O)C(CCCNC(=N)N)NC(=O)C(CS)NC(=O)C(CC(C)C)NC1=O)C(=O)NC(Cc2c[nH]cn2)C(=O)NC(Cc3c[nH]cn3)C(=O)NC(CO)C(=O)NC(C(C)O)C(=O)N', u'name': u'BRD-K55473186', u'rationale': u'outreach', u'report': u'stapled helical peptide targeting NOTCH1', u'id': u'UNKNOWN:BRD-K55473186'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:VAF-347', u'data': {u'status': u'probe', u'smiles': u'FC(F)(F)c1ccc(Nc2nccc(n2)-c2cccc(Cl)c2)cc1', u'name': u'VAF-347', u'rationale': u'lit-search;synthesis', u'report': u'inhibitor of aryl hydrocarbon receptor', u'id': u'UNKNOWN:VAF-347'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-M00053801', u'data': {u'status': u'probe', u'smiles': u'C[C@H](O)[C@@H]1[C@H](CO)ON(Cc2cccc(CN(CCN(C)C)[C@H](C3CCCCC3)c3ccccc3)c2)[C@@H]1C(=O)N[C@H]1C[C@H]2C[C@@H]([C@@H]1C)C2(C)C.C[C@H](O)[C@@H]1[C@H](CO)ON(Cc2cccc(CN(CCN(C)C)[C@@H](C3CCCCC3)c3ccccc3)c2)[C@@H]1C(=O)N[C@H]1C[C@H]2C[C@@H]([C@@H]1C)C2(C)C', u'name': u'BRD-M00053801', u'rationale': u'lit-search;synthesis', u'report': u'inhibitor of BCL2', u'id': u'UNKNOWN:BRD-M00053801'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID5426', u'data': {u'status': u'FDA', u'smiles': u'O=C1N(C2CCC(=O)NC2=O)C(=O)c2ccccc12', u'name': u'thalidomide', u'rationale': u'CTEP;kinome', u'report': u'immunomodulatory drug; binder of cereblon', u'id': u'CID5426'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID462382', u'data': {u'status': u'probe', u'smiles': u'CC(C)C[C@H](NC(=O)[C@H](CC(C)C)NC(=O)[C@H](CC(C)C)NC(=O)OCc1ccccc1)C=O', u'name': u'MG-132', u'rationale': u'lit-search', u'report': u'inhibitor of the proteosome', u'id': u'CID462382'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K90370028', u'data': {u'status': u'probe', u'smiles': u'CC(=O)N[C@@H]1C\\C=C\\CCC(=O)N[C@@H](COC1=O)c1ccccc1', u'name': u'BRD-K90370028', u'rationale': u'outreach', u'report': u'screening hit', u'id': u'UNKNOWN:BRD-K90370028'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K48477130', u'data': {u'status': u'probe', u'smiles': u'Cc1n[nH]c2NC3=C([C@@H](c12)c1ccccc1)C(=O)CC(C)(C)C3', u'name': u'BRD-K48477130', u'rationale': u'lit-search;synthesis', u'report': u'screening hit', u'id': u'UNKNOWN:BRD-K48477130'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID16659841', u'data': {u'status': u'clinical', u'smiles': u'C[C@H](Nc1ncc(Cl)c(Nc2cc(C)[nH]n2)n1)c1ncc(F)cn1', u'name': u'AZD1480', u'rationale': u'CTEP;kinome', u'report': u'inhibitor of Janus kinases 1 and 2', u'id': u'CID16659841'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-A05715709', u'data': {u'status': u'probe', u'smiles': u'Cc1ccccc1C(N(C(=O)Cc1ccncc1)c1cccc(F)c1)C(=O)NC1CCCCC1', u'name': u'BRD-A05715709', u'rationale': u'outreach', u'report': u'putative inhibitor of IDH1 R132H', u'id': u'UNKNOWN:BRD-A05715709'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K99006945', u'data': {u'status': u'probe', u'smiles': u'CCN(CC)c1ccc(cc1)C1=NNC(=O)C[C@H]1C', u'name': u'BRD-K99006945', u'rationale': u'chromatin;lit-search;synthesis', u'report': u'screening hit', u'id': u'UNKNOWN:BRD-K99006945'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID49867930', u'data': {u'status': u'clinical', u'smiles': u'CC(C)(C(=O)NCC(F)(F)C(F)(F)F)C(=O)N[C@H]1c2ccccc2-c2ccccc2NC1=O', u'name': u'RO4929097', u'rationale': u'CTEP', u'report': u'inhibitor of gamma-secretase', u'id': u'CID49867930'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:MLN2480', u'data': {u'status': u'clinical', u'smiles': u'C[C@@H](NC(=O)c1ncnc(N)c1Cl)c1ncc(s1)C(=O)Nc1cc(c(Cl)cn1)C(F)(F)F', u'name': u'MLN2480', u'rationale': u'lit-search', u'report': u'inhibitor of RAF kinases', u'id': u'UNKNOWN:MLN2480'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K51831558', u'data': {u'status': u'probe', u'smiles': u'CC(C)n1ncc2c(cc(Br)cc12)C(=O)NCc1c(C)cc(C)[nH]c1=O', u'name': u'BRD-K51831558', u'rationale': u'chromatin;lit-search;synthesis', u'report': u'inhibitor of enhancer of zeste polycomb repressive complex 2 subunit', u'id': u'UNKNOWN:BRD-K51831558'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:MI-2', u'data': {u'status': u'probe', u'smiles': u'CCCc1cc2c(ncnc2s1)N1CCN(CC1)C1=NCC(C)(C)S1', u'name': u'MI-2', u'rationale': u'chromatin;lit-search;synthesis', u'report': u'binder of menin; inhibitor of menin-MLL fusion protein', u'id': u'UNKNOWN:MI-2'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K42260513', u'data': {u'status': u'probe', u'smiles': u'CC(C)n1ncc2c(cc(cc12)-c1ccc(nc1)N1CCNCC1)C(=O)NCc1c(C)cc(C)[nH]c1=O', u'name': u'BRD-K42260513', u'rationale': u'chromatin;lit-search;synthesis', u'report': u'inhibitor of enhancer of zeste polycomb repressive complex 2 subunit', u'id': u'UNKNOWN:BRD-K42260513'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:CBB-1007', u'data': {u'status': u'probe', u'smiles': u'COC(=O)c1cc(CN2CCN(CC2)C(N)=N)cc(c1)C(=O)N1CCN(CC1)C(=O)c1ccc(cc1)C(N)=N', u'name': u'CBB-1007', u'rationale': u'lit-search', u'report': u'inhibitor of lysine-specific demethylase 1A (LSD1)', u'id': u'UNKNOWN:CBB-1007'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-A86708339', u'data': {u'status': u'probe', u'smiles': u'Cc1ccc(cc1)C(NC(=O)c1ccccc1)c1ccc2cccnc2c1O', u'name': u'BRD-A86708339', u'rationale': u'outreach', u'report': u'screening hit', u'id': u'UNKNOWN:BRD-A86708339'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID25227462', u'data': {u'status': u'probe', u'smiles': u'CN(C)C[C@@H](NC(=O)N1Cc2c(Nc3nc(C)nc4ccsc34)n[nH]c2C1(C)C)c1ccccc1', u'name': u'PF-3758309', u'rationale': u'kinome', u'report': u'inhibitor of serine/threonine p21-activating kinase 4', u'id': u'CID25227462'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:SZ4TA2', u'data': {u'status': u'probe', u'smiles': u'CC1(C)CCN(CC1)c1ccc(cc1)C(=O)NS(=O)(=O)c1ccc(NCCSc2ccccc2)c(c1)[N+]([O-])=O', u'name': u'SZ4TA2', u'rationale': u'lit-search', u'report': u'inhibitor of BCL-xL', u'id': u'UNKNOWN:SZ4TA2'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID11955716', u'data': {u'status': u'clinical', u'smiles': u'CC(C)c1cc(C(=O)N2Cc3ccc(CN4CCN(C)CC4)cc3C2)c(O)cc1O', u'name': u'AT13387', u'rationale': u'CTEP', u'report': u'inhibitor of HSP90', u'id': u'CID11955716'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BCL-LZH-4', u'data': {u'status': u'probe', u'smiles': u'COc1ccc(cc1)C1C(C(=O)Nc2ccccc2)=C(C)N=c2s\\c(=C/c3cn(Cc4ccccc4)c4ccccc34)c(=O)n12', u'name': u'BCL-LZH-4', u'rationale': u'lit-search;synthesis', u'report': u'inhibitor of BCL2, BCL-xL, and MCL1', u'id': u'UNKNOWN:BCL-LZH-4'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:avicin D', u'data': {u'status': u'probe', u'smiles': u'CC1O[C@@H](OCC2O[C@@H](O[C@H]3CC[C@@]4(C)C(CC[C@]5(C)C4CC=C4C6CC(C)(C)[C@H](C[C@@]6([C@H](O)C[C@@]54C)C(=O)O[C@@H]4OC(CO)[C@@H](O)[C@@H](O)[C@@H]4O[C@@H]4OC(C)[C@H](O[C@@H]5O[C@@H](CO)[C@H](O)[C@@H]5O)[C@@H](O[C@@H]5OC(CO)[C@@H](O)[C@@H](O)[C@@H]5O)[C@@H]4O)OC(=O)C(\\CO)=C\\CC[C@](C)(O[C@@H]4OC(C)[C@@H](OC(=O)C(\\CO)=C\\CCC(C)(O)C=C)[C@@H](O)[C@@H]4O)C=C)C3(C)C)[C@@H](NC(C)=O)[C@H](O)[C@@H]2O)[C@@H](O[C@@H]2OC[C@@H](O)[C@@H](O)[C@@H]2O)[C@H](O)[C@H]1O', u'name': u'avicin D', u'rationale': u'outreach', u'report': u'natural product', u'id': u'UNKNOWN:avicin D'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID5494449', u'data': {u'status': u'clinical', u'smiles': u'CN1CCN(CC1)c1cc(Nc2cc(C)[nH]n2)nc(Sc2ccc(NC(=O)C3CC3)cc2)n1', u'name': u'VX-680', u'rationale': u'pilot-set', u'report': u'inhibitor of aurora kinases', u'id': u'CID5494449'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K33514849', u'data': {u'status': u'probe', u'smiles': u'C[C@H](CO)N1C[C@@H](C)[C@H](CN(C)C(=O)Nc2ccc3OCOc3c2)Oc2cc(ccc2S1(=O)=O)C#Cc1ccncc1', u'name': u'BRD-K33514849', u'rationale': u'outreach', u'report': u'screening hit', u'id': u'UNKNOWN:BRD-K33514849'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K01737880', u'data': {u'status': u'probe', u'smiles': u'COc1ccc(NC(=O)Nc2ccc3O[C@@H](CN(C)Cc4ccc5OCOc5c4)[C@@H](C)CN([C@@H](C)CO)C(=O)c3c2)cc1', u'name': u'BRD-K01737880', u'rationale': u'outreach', u'report': u'screening hit', u'id': u'UNKNOWN:BRD-K01737880'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID6436223', u'data': {u'status': u'probe', u'smiles': u'CO[C@H]1\\C=C\\C=C(C)\\C[C@@H](C)[C@H](O)[C@H](C)\\C=C(C)\\C=C(OC)\\C(=O)O[C@@H]1[C@@H](C)[C@@H](O)[C@H](C)[C@H]1C[C@@H](O)[C@H](C)[C@H](O1)C(C)C', u'name': u'bafilomycin A1', u'rationale': u'outreach', u'report': u'inhibitor of the vacuolar-type H+-ATPase', u'id': u'CID6436223'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:SR8278', u'data': {u'status': u'probe', u'smiles': u'CCOC(=O)C1Cc2ccccc2CN1C(=O)c1ccc(SC)s1', u'name': u'SR8278', u'rationale': u'lit-search', u'report': u'antagonist of Rev-ErbAalpha', u'id': u'UNKNOWN:SR8278'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:CID71729975', u'data': {u'status': u'probe', u'smiles': u'CCOC(=O)CCNc1cc(nc(n1)-c1ccccn1)N1CCc2ccccc2CC1', u'name': u'GSK-J4', u'rationale': u'chromatin;lit-search', u'report': u'inhibitor of lysine-specific demethylases', u'id': u'CID71729975'}, u'label': u'Compound'})>
    <AttrDict({u'gid': u'compound:UNKNOWN:BRD-K30748066', u'data': {u'status': u'probe', u'smiles': u'Cc1c(sc(=O)n1C)-c1ccnc(Nc2ccc(cc2)N2CCNCC2)n1', u'name': u'BRD-K30748066', u'rationale': u'kinome', u'report': u'inhibitor of CDK9', u'id': u'UNKNOWN:BRD-K30748066'}, u'label': u'Compound'})>



```python
q = O.query().V("compound:UNKNOWN:oxaliplatin").inEdge().distinct("_label").render(["_label"])
print list(q)
```

    [[u'sameAs'], [u'responseTo'], [u'drugTherapyFrom']]



```python
q =  O.query().V("compound:UNKNOWN:oxaliplatin").inEdge("sameAs")
print list(q)
```

    [<AttrDict({u'to': u'compound:UNKNOWN:oxaliplatin', u'gid': u'(compound:BRD-M14820059)--sameAs->(compound:UNKNOWN:oxaliplatin)', u'from': u'compound:BRD-M14820059', u'data': {}, u'label': u'sameAs'})>]



```python
print list(O.query().V("compound:UNKNOWN:BRD-M14820059"))
```

    []



```python
q = O.query().V().where(aql.eq("_label", "ResponseCurve")).aggregate(aql.term("test", "ResponseCurve", "source"))
print list(q)
```

    [<AttrDict({u'test': {u'buckets': [{u'value': 275549, u'key': u'ccle'}]}})>]



```python
print O.aggregate(aql.term("test", "ResponseCurve", "responseType"))
```

    {u'aggregations': {u'test': {u'buckets': [{u'value': 275549, u'key': u'ACTIVITY'}]}}}
    {u'test': {u'buckets': [{u'value': 275549, u'key': u'ACTIVITY'}]}}



```python

```
