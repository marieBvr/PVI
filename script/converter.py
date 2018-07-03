import csv
import json
from collections import defaultdict

filenames = ["MOESM1_CIYVV", "MOESM1_PPV", "MOESM1_PRSV-P", "MOESM1_PSbMV", "MOESM1_PVA", "MOESM1_SMV-G7H", "MOESM1_SMV-P", "MOESM1_SYSV-O"]
finalfile = open('../app/data/MOESM1_merge2.json', 'w')
finalfile.write('{ "links" : [')
intractionslist = defaultdict(list)
nodes = defaultdict(list)

for filename in filenames:
	csvfile = open('../app/data/csv/' + filename + '.csv', 'r')
	# jsonfile = open('../data/' + filename + '.json', 'w')
	reader = csv.DictReader(csvfile)
	firstrow = True
	for row in reader:
		if firstrow:
			# fieldnames["Source"] = fieldnames["Protein A"]
			# del fieldnames["Protein A"]
			# fieldnames["Target"] = fieldnames["Protein B"]
			# del fieldnames["Protein B"]
			if len(row) > 8:
				# source -> Protein A
				# target -> Protein B
				fieldnames = ["Interaction","Source","Target","Reference","sp","Detection","Intensity","Detected","Tested"]
			else:
				fieldnames = ["Interaction","Source","Target","Reference","sp","Detection","Detected","Tested"]
			firstrow = False
			reader.fieldnames = fieldnames
		if row["Reference"] != "" and row["Reference"] != "Reference" :
			if row['Detected'] == "0" and row['Tested'] == "0" :
				continue
			else:
				# json.dump(row, jsonfile)
				# jsonfile.write('\n')
				json.dump(row, finalfile)
				finalfile.write(',\n')
				if row["Source"] not in nodes["id"]:
					nodes["id"].append(row["Source"])
				if row["Target"] not in nodes["id"]:
					nodes["id"].append(row["Target"])
				# Recense les interactions les interactions
				if row["Target"] not in intractionslist[row["Source"]]:
					intractionslist[row["Source"]].append(row["Target"])
	csvfile.close()

finalfile.write('],"nodes":[')
count = 0
for node in nodes["id"]:
	count = count + 1
	finalfile.write('{"id":')
	json.dump(node, finalfile)
	finalfile.write(',"interaction":"')
	json.dump(len(intractionslist[node])-1, finalfile)
	if count < len(nodes["id"]):
		finalfile.write('"},')
	else:
		finalfile.write('"}]}')




finalfile.close()


	# finalfile.write('},{"interaction":')
	# json.dump(len(intractionslist[node]), finalfile)