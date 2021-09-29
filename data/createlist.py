"""
Download surname list from https://www.avoindata.fi/data/fi/dataset/none
and create CSV file from it.
"""

import csv
import json

CSV_FILE = '/tmp/sukunimet.csv'
DELIMITER = ';'
QUOTECHAR = '"'
NAME_LEN = 4

def read_rows():
    f = open(CSV_FILE)
    reader = csv.reader(f, delimiter=DELIMITER, quotechar=QUOTECHAR)
    rows = []
    i = 0
    for row in reader:
        if i > 0:
            datarow = [row[0], int(row[1])]
            rows.append(datarow)
        i += 1

    f.close()
    return rows

def count_total(rows):
    total = 0
    for row in rows:
        total += row[1]
    return total

def sorter(val):
    """Sort by percentage."""
    return val['per']

def analyze(rows):
    total = count_total(rows)
    data = {}
    for row in rows:
        name, c = row
        if len(name) < NAME_LEN:
            key = name
        else:
            key = name[0:NAME_LEN] + '*'
        key = key.upper()

        if key not in data:
            data[key] = { 'start': key, 'num': 0 }
        data[key]['num'] += c

    values = list(data.values())
    for value in values:
        value['per'] = value['num'] / total * 100

    # sort values by their percentage
    values.sort(reverse=True, key=sorter)
    return values

rows = read_rows()
values = analyze(rows)
data = json.dumps(values)
print(data)
