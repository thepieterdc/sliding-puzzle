#!/usr/bin/env python3

import cgi
import json
import urllib.parse
import urllib.request


def lastfm(method: str, a: str) -> dict:
    return json.loads(urllib.request.urlopen(urllib.request.Request(
        "http://ws.audioscrobbler.com/2.0/?method={}&artist={}&autocorrect=1&api_key=c94f6bae579e47179e8fbde12880a85c&format=json".format(
            method, urllib.parse.quote(a)))).read().decode("utf8"))


def longest(a: str, b: str) -> str:
    return a if len(a) > len(b) else b


def respond(success: bool, parameters):
    print(json.dumps({'success': False, 'error': parameters}) if not success else json.dumps(
        {'success': True, 'content': parameters}))
    exit()


def wikipedia(query: str) -> dict:
    return json.loads(urllib.request.urlopen(urllib.request.Request(
        "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles={}".format(
            urllib.parse.quote(query)))).read().decode("utf8"))


print("Access-Control-Allow-Origin: *")
print("Content-Type: application/json\n")

artist = str(cgi.FieldStorage().getvalue("artist")).lower()
lastFmInfo = lastfm("artist.getinfo", artist)
try:
    assert "error" not in lastFmInfo
    wikipediaInfo = wikipedia(str(lastFmInfo["artist"]["name"]))

    lastFmBio = str(lastFmInfo["artist"]["bio"]["content"]).replace("\n", " ").replace("  ", " ").strip()
    wikipediaBio = str(list(wikipediaInfo["query"]["pages"].values())[0]["extract"]).replace("\n", " ").replace("  ",
                                                                                                                " ").strip()
    bio = longest(lastFmBio, wikipediaBio)

    try:
        respond(True, {"biography": bio[:(bio.find(".", 100) + 1 if bio.find(".", 100) != -1 else "")], "name": lastFmInfo["artist"]["name"]})
    except Exception:
        respond(True, {"biography": bio, "name": lastFmInfo["artist"]["name"]})
except Exception:
    respond(False, "No artist biography found.")
