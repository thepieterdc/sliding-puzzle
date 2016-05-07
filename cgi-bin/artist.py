#!/usr/bin/env python3

import cgi
import json
import os.path
import urllib.request

from PIL import Image, ImageOps


def find_nth(haystack, needle, n):
    start = haystack.find(needle)
    while start >= 0 and n > 1:
        start = haystack.find(needle, start + len(needle))
        n -= 1
    return start


def lastfm(method: str, a: str) -> dict:
    return json.loads(urllib.request.urlopen(urllib.request.Request(
        "http://ws.audioscrobbler.com/2.0/?method={}&artist={}&autocorrect=1&api_key=c94f6bae579e47179e8fbde12880a85c&format=json".format(
            method, a))).read().decode("utf8"))


def respond(success: bool, parameters):
    print(json.dumps({'success': False, 'error': parameters}) if not success else json.dumps(
        {'success': True, 'content': parameters}))
    exit()


print("Access-Control-Allow-Origin: *")
print("Content-Type: application/json\n")

artist = str(cgi.FieldStorage().getvalue("artist")).lower()
info = lastfm("artist.getinfo", artist)
try:
    bio = str(info.get("artist").get("bio").get("content")).strip()
    assert len(bio) > 0
    assert bio[0:7] != "<a href"
    respond(True, {"biography": (bio if bio.count("\n") <= 4 else bio[:find_nth(bio, "\n", 3)]), "name": str(info.get("artist").get("name"))})
except Exception:
    respond(False, "No artist biography found.")
