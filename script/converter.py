import csv
import json
from collections import defaultdict


def main ():
	outputpath1 = '../app/data/MOESM1_merge2.json'
	outputpath2 = '../app/data/MOESM3_merge.json'
	nodesDict = firstParser(outputpath1)
	secondParser(outputpath2, nodesDict)

# Parse Viral protein file
def firstParser (op):
	filenames = ["MOESM1_CIYVV", "MOESM1_PPV", "MOESM1_PRSV-P", "MOESM1_PSbMV", "MOESM1_PVA", "MOESM1_SMV-G7H", "MOESM1_SMV-P", "MOESM1_SYSV-O"]
	finalfile = open(op, 'w')
	finalfile.write('{ "links" : [')
	intractionslist = defaultdict(list)
	# Unique nodes
	nodes = defaultdict(list)
	# Protein species
	species = defaultdict(list)

	for filename in filenames:
		csvfile = open('../app/data/csv/' + filename + '.csv', 'r')
		# jsonfile = open('../data/' + filename + '.json', 'w')
		reader = csv.DictReader(csvfile)
		firstrow = True
		for row in reader:
			if firstrow:
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
					json.dump(row, finalfile)
					finalfile.write(',\n')
					if row["Source"] not in nodes["id"]:
						nodes["id"].append(row["Source"])

					if row["sp"] not in species[row["Source"]]:
						species[row["Source"]].append(row["sp"])

					if row["Target"] not in nodes["id"]:
						nodes["id"].append(row["Target"])

					if row["sp"] not in species[row["Target"]]:
						species[row["Target"]].append(row["sp"])
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
		finalfile.write('","group":["Viral')
		finalfile.write('"],"sp":')
		print(species[node])
		json.dump(species[node], finalfile)
		if count < len(nodes["id"]):
			finalfile.write('},')
		else:
			finalfile.write('}]}')
	finalfile.close()
	return(nodes)


# Parse Host protein file
def secondParser(op, oldnodes):
	filename = "MOESM3_ESM"
	finalfile = op
	finalfile = open(op, 'w')
	finalfile.write('{ "links" : [')
	intractionslist = defaultdict(list)
	nodes = defaultdict(list)

	csvfile = open('../app/data/csv/' + filename + '.csv', 'r')
	csvreader = csv.DictReader(csvfile)
	firstrow = True
	for line in csvreader:
		if firstrow:
			# Viral -> Source, Host -> Target
			fieldnames = ["Source","Target"]
			firstrow = False
			csvreader.fieldnames = fieldnames
			continue
		json.dump(line, finalfile)
		finalfile.write(',\n')
		if line["Source"] not in nodes["id"] and line["Source"] not in oldnodes["id"] :
			nodes["id"].append(line["Source"].replace("-", ""))

		if line["Target"] not in nodes["id"] and line["Target"] not in oldnodes["id"]:
			nodes["id"].append(line["Target"].replace("-", ""))

		if line["Target"] not in intractionslist[line["Source"]]:
			intractionslist[line["Source"]].append(line["Target"].replace("-", ""))
	csvfile.close()
	finalfile.write('],"nodes":[')
	count = 0
	for node in nodes["id"]:
		count = count + 1
		finalfile.write('{"id":')
		json.dump(node, finalfile)
		finalfile.write(',"interaction":"')
		json.dump(len(intractionslist[node])-1, finalfile)
		finalfile.write('","group"[:[Host')
		finalfile.write('"],"sp":["Arabidopsis')
		if count < len(nodes["id"]):
			finalfile.write('"]},')
		else:
			finalfile.write('"]}]}')
	finalfile.close()


if __name__ == "__main__":
	main()