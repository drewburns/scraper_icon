import pandas as pd

data = [
    ['Tooth, tooth,dentist,dental,healthcare and medical,premolar,dirty,medical', 
        {'bytes': None, 'path': 'https://cdn-icons-png.flaticon.com/512/1041/1041275.png'}],
    ['Insurance, dental,tooth,teeth,shield,prevention,dentist,sterilization,files and folders,healthcare and medical,premolar,insurance,security,medical, tooth,dentist,dental,healthcare and medical,premolar,dirty,medical', 
        {'bytes': None, 'path': 'https://cdn-icons-png.flaticon.com/512/1041/1041276.png'}],
]
  
# Create the pandas DataFrame
df = pd.DataFrame(data, columns=['text', 'image'])
  
# print dataframe.
print(df)
df.to_parquet('myfile.parquet')
