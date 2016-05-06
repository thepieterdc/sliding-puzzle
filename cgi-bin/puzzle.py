#!/usr/bin/env python3

import cgi
import json
import os.path
import urllib.request

from PIL import Image, ImageOps


def download(url):
    return urllib.request.urlretrieve(url)


def getLastFM(method: str, a: str) -> dict:
    return json.loads(urllib.request.urlopen(urllib.request.Request(
        "http://ws.audioscrobbler.com/2.0/?method={}&artist={}&api_key=c94f6bae579e47179e8fbde12880a85c&format=json".format(
            method, a))).read().decode("utf8"))


def respond(success: bool, parameters):
    print(json.dumps({'success': False, 'error': parameters}) if not success else json.dumps(
        {'success': True, 'content': parameters}))
    exit()


def respondOk(a: str, r: int, tS: int):
    respond(True,
            {"directoryname": "assets/images/{}/{}".format(a, str(r)), "extension": "png", "nrofpieces": r * r,
             "size": {"width": tS, "height": tS}})

print("Access-Control-Allow-Origin: *")
print("Content-Type: application/json\n")

artist = str(cgi.FieldStorage().getvalue("artiest")).lower()
rows = int(cgi.FieldStorage().getvalue("rijen"))
cols = int(cgi.FieldStorage().getvalue("kolommen"))

if os.path.exists("assets/images/{}/{}".format(artist, str(rows))):
    respondOk(artist, rows, Image.open("assets/images/{}/{}/0-0.png".format(artist, rows)).size[0])

sizes = ['thumbnail', 'small', 'medium', 'large', 'extralarge', 'mega']

correctedArtist = getLastFM('artist.getcorrection', artist).get('corrections')
if "correction" not in correctedArtist:
    respond(False, "Artist not found.")
artist = str(correctedArtist['correction']['artist']['name']).lower()

if os.path.exists("assets/images/{}/{}".format(artist, str(rows))):
    respondOk(artist, rows, Image.open("assets/images/{}/{}/0-0.png".format(artist, rows)).size[0])

os.makedirs("assets/images/{}/{}".format(artist, str(rows)))

albums = getLastFM('artist.search', artist).get('results')
if not int(albums['opensearch:totalResults']):
    respond(False, "No albums found.")
albums = [album for album in albums.get('artistmatches').get('artist') if str(album['name']).lower() == artist]
results = {sizes.index(album['size']): album['#text'] for album in albums[0].get('image')}

img = Image.open(download(results[max(results)])[0])
borderedImg = ImageOps.expand(img, border=5 + (rows - (img.size[0] + 5) % rows), fill='black')
borderedImg.save("assets/images/{}/original.png".format(artist))
tileSize = borderedImg.size[0] // cols, borderedImg.size[1] // rows

[borderedImg.copy().crop((c * tileSize[0], r * tileSize[1], (c + 1) * tileSize[0], (r + 1) * tileSize
[1])).save("assets/images/{}/{}/{}-{}.{}".format(artist, str(rows), r, c, 'png')) for c in range(0, cols)
 for r in range(0, rows)]

respondOk(artist, rows, tileSize[0])
