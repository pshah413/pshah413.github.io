import csv

input_file = "API_IT.NET.USER.ZS_DS2_en_csv_v2_112825.csv"
output_file = "country_internet.csv"

with open(input_file, newline='', encoding='utf-8') as infile, \
     open(output_file, 'w', newline='', encoding='utf-8') as outfile:

    reader = csv.reader(infile)
    writer = csv.writer(outfile)

    # Skip the first two metadata rows
    next(reader)
    next(reader)

    # Read header row (the third line)
    header = next(reader)

    # Columns: Country Name at index 0, years start at index 4
    years = header[4:]

    # Write output header
    writer.writerow(["Country", "Year", "LifeExpectancy"])

for row in reader:
    if not row or len(row) < 5:  # Skip empty or incomplete rows
        continue
    country = row[0]
    for i, year in enumerate(years, start=4):
        if i >= len(row):
            continue
        value = row[i].strip()
        if value != "":
            writer.writerow([country, year, value])
