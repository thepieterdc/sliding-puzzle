#!/usr/bin/env python3

import cgi
import json
import os.path
import urllib.request

from PIL import Image, ImageOps


def download(url):
    return urllib.request.urlretrieve(url)


def lastfm(method: str, a: str) -> dict:
    return json.loads(urllib.request.urlopen(urllib.request.Request(
        "http://ws.audioscrobbler.com/2.0/?method={}&artist={}&api_key=c94f6bae579e47179e8fbde12880a85c&format=json".format(
            method, a))).read().decode("utf8"))


def respond(success: bool, parameters):
    print(json.dumps({'success': False, 'error': parameters}) if not success else json.dumps(
        {'success': True, 'content': parameters}))
    exit()


def ok(a: str, r: int, ts: int):
    respond(True,
            {"directoryname": "assets/images/{}/{}".format(a, str(r)), "extension": "png", "nrofpieces": r * r,
             "size": {"width": ts, "height": ts}})


print("Access-Control-Allow-Origin: *")
print("Content-Type: application/json\n")

artist = str(cgi.FieldStorage().getvalue("artiest")).lower()
rows = int(cgi.FieldStorage().getvalue("rijen"))
cols = int(cgi.FieldStorage().getvalue("kolommen"))

if os.path.exists("assets/images/{}/{}".format(artist, str(rows))):
    ok(artist, rows, Image.open("assets/images/{}/{}/0_0.png".format(artist, rows)).size[0])

sizes = ['thumbnail', 'small', 'medium', 'large', 'extralarge', 'mega']

if os.path.exists("assets/images/{}/{}".format(artist, str(rows))):
    ok(artist, rows, Image.open("assets/images/{}/{}/0_0.png".format(artist, rows)).size[0])

albums = lastfm('artist.search', artist).get('results')
albums = [album for album in albums.get('artistmatches').get('artist') if str(album['name']).lower() == artist]
if not len(albums):
    respond(False, "No albums found.")
results = {sizes.index(album['size']): album['#text'] for album in albums[0].get('image')}

os.makedirs("assets/images/{}/{}".format(artist, str(rows)))

img = Image.open(download(results[max(results)])[0])
borderedImg = ImageOps.expand(img, border=5 + (rows - (img.size[0] + 5) % rows), fill='black')
borderedImg.save("assets/images/{}/original.png".format(artist))
tileSize = borderedImg.size[0] // cols, borderedImg.size[1] // rows

[borderedImg.copy().crop((c * tileSize[0], r * tileSize[1], (c + 1) * tileSize[0], (r + 1) * tileSize
[1])).save("assets/images/{}/{}/{}_{}.{}".format(artist, str(rows), r, c, 'png')) for c in range(0, cols)
 for r in range(0, rows)]

ok(artist, rows, tileSize[0])
