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


print("Content-Type: application/json\n")

artist = str(cgi.FieldStorage().getvalue("artiest")).lower()
rows = int(cgi.FieldStorage().getvalue("rijen"))
cols = int(cgi.FieldStorage().getvalue("kolommen"))

if not os.path.exists("images/{}/{}".format(artist, str(rows))):
    os.makedirs("images/{}/{}".format(artist, str(rows)))

sizes = ['thumbnail', 'small', 'medium', 'large', 'extralarge', 'mega']

correctedArtist = getLastFM('artist.getcorrection', artist).get('corrections')
if "correction" not in correctedArtist:
    respond(False, "Artist not found.")
artist = str(correctedArtist['correction']['artist']['name']).lower()

albums = getLastFM('artist.search', artist).get('results')
if not int(albums['opensearch:totalResults']):
    respond(False, "No albums found.")
albums = [album for album in albums.get('artistmatches').get('artist') if album['name'] == artist]
results = {sizes.index(album['size']): album['#text'] for album in albums[0].get('image')}

img = Image.open(download(results[max(results)])[0])
borderedImg = ImageOps.expand(img, border=5 + (rows - (img.size[0] + 5) % rows), fill='black')
tileSize = borderedImg.size[0] // cols, borderedImg.size[1] // rows

if not os.path.exists("images/{}/{}".format(artist, str(rows))):
    os.makedirs("images/{}/{}".format(artist, str(rows)))

[borderedImg.copy().crop((c * tileSize[0], r * tileSize[1], (c + 1) * tileSize[0], (r + 1) * tileSize
[1])).save("images/{}/{}/{}-{}.{}".format(artist, str(rows), r, c, 'png')) for c in range(0, cols)
 for r in range(0, rows)]

respond(True, {"directoryname": "images/{}/{}".format(artist, str(rows)), "extension": "png", "nrofpieces": rows * cols,
               "size": {"width": tileSize[0], "height": tileSize[1]}})