#!/usr/bin/env python3

#
# Created by Pieter De Clercq <pieterdeclercq@outlook.com>.
#

import cgi
import json
import hashlib
import os.path
import urllib.parse
import urllib.request

from PIL import Image, ImageOps


def download(url):
    return urllib.request.urlretrieve(url)


def lastfm(method: str, a: str) -> dict:
    return json.loads(urllib.request.urlopen(urllib.request.Request(
        "http://ws.audioscrobbler.com/2.0/?method={}&format=json&artist={}&api_key=c94f6bae579e47179e8fbde12880a85c".format(
            method, a))).read().decode("utf8"))


def hash(s: str) -> str:
    return hashlib.md5(s).hexdigest()


def parseartist(a: str) -> str:
    return urllib.parse.quote(a.lower().replace("%20", " ").replace(" ", "_"))


def respond(success: bool, parameters):
    print(json.dumps({'success': False, 'error': parameters}) if not success else json.dumps(
        {'success': True, 'content': parameters}))
    exit()


def ok(f: str, c: int, r: int, ts: tuple):
    respond(True,
            {"directoryname": f, "extension": "png", "nrofpieces": c * r,
             "size": {"width": ts[0], "height": ts[1]}})


print("Access-Control-Allow-Origin: *")
print("Content-Type: text/html\n")

sizes = ['thumbnail', 'small', 'medium', 'large', 'extralarge', 'mega']

artist = cgi.FieldStorage().getvalue("artiest").lower()
artisthash = hash(artist.encode("utf-8"))
rows = int(cgi.FieldStorage().getvalue("rijen"))
cols = int(cgi.FieldStorage().getvalue("kolommen"))

artistFolder = "assets/puzzles/{}".format(artisthash)
folder = "{}/{}x{}".format(artistFolder, str(cols), str(rows))

if os.path.exists(folder):
    ok(folder, cols, rows, Image.open("{}/1.png".format(folder)).size)

if not os.path.isfile("{}/original.png".format(artistFolder)):
    albums = lastfm('artist.search', artist).get('results')
    albums = [album for album in albums.get('artistmatches').get('artist') if artist in str(album.get('name')).lower() ]
    if not len(albums):
        respond(False, "No albums found.")
    results = {sizes.index(album['size']): album['#text'] for album in albums[0].get('image')}
    
    os.makedirs(artistFolder)

    img = Image.open(download(results[max(results)])[0])
    if img.mode != "RGBA":
        img = img.convert("RGBA")

    pxls = img.copy().resize((5, 5)).getdata()

    black = 0
    for pxl in pxls:
        if sum(pxl) - 255 < 50:
            black += 1
    borderCol = 'black' if (black / float(len(pxls))) < 0.4 else 'red'
    borderedImg = ImageOps.expand(img, border=7 + (rows - (img.size[0] + 7) % rows), fill=borderCol)
    borderedImg.save("{}/original.png".format(artistFolder))
else:
    borderedImg = Image.open("{}/original.png".format(artistFolder))
tileSize = borderedImg.size[0] // cols, borderedImg.size[1] // rows

os.makedirs(folder)

[borderedImg.copy().crop((c * tileSize[0], r * tileSize[1], (c + 1) * tileSize[0], (r + 1) * tileSize
[1])).save("{}/{}.{}".format(folder, r * rows + c + 1, 'png')) for c in range(0, cols)
 for r in range(0, rows)]

ok(folder, cols, rows, tileSize)
