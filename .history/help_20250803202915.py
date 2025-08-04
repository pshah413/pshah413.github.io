import pandas as pd
from io import StringIO

csv_data = '''"Country Name","Country Code","Indicator Name","Indicator Code","1960","1961","1962","1963","1964","1965","1966","1967","1968","1969","1970","1971","1972","1973","1974","1975","1976","1977","1978","1979","1980","1981","1982","1983","1984","1985","1986","1987","1988","1989","1990","1991","1992","1993","1994","1995","1996","1997","1998","1999","2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019","2020","2021","2022","2023","2024",
"World","WLD","Individuals using the Internet (% of population)","IT.NET.USER.ZS","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","15.6","17.2","20.2","22.8","25.3","28.4","30.9","33.3","35.3","37.4","39.8","42.8","45.2","48.5","52.9","58.6","61.7","63.7","65.4","67.6",'''

df = pd.read_csv(StringIO(csv_data))

# Extract year columns with data (skip empty values)
years = [col for col in df.columns if col.isdigit()]

# Select only year and corresponding data
result = pd.DataFrame({
    'Year': years,
    'InternetPenetration': df.loc[0, years].values
})

print(result)