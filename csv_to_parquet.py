import random
import string
import pandas as pd
import csv
import cv2
import urllib.request
from PIL import Image
import boto3
import io


def upload_to_aws(old_url):
    key = ''.join(random.choices(string.ascii_uppercase + string.digits, k=15))

    urllib.request.urlretrieve(
    old_url,
    f"images/{key}.png")
    img = Image.open(f"images/{key}.png")
    rgb_im = img.convert('RGB')
    in_mem_file = io.BytesIO()

    rgb_im.save(in_mem_file, "JPEG")
    in_mem_file.seek(0)

    session = boto3.Session(
                    aws_access_key_id="AKIAULFJV5VXSQH54VHL",
                    aws_secret_access_key="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",
                )
    s3 = session.resource('s3') 

    # user_email
    s3.Bucket('keystroke-assets').put_object(Key= f'images/{key}.jpg', Body=in_mem_file, ContentType='image/jpeg')
    return f"https://keystroke-assets.s3.amazonaws.com/images/{key}.jpg"

data = []
with open('flat_icons.csv', newline='') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        title = row[0]
        category = row[1]
        icon_type = row[2]
        link = row[3]
        tags = row[4]
        if icon_type == "Flat":
            new_link = upload_to_aws(link)
            data.append([f"{title}, {tags}", {'bytes': None, 'path': new_link}])

df = pd.DataFrame(data, columns=['text', 'image'])
  
  
# print dataframe.
# print(df)
df.to_parquet('flat_icons_jpg.parquet')

