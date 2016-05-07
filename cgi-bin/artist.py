#!/usr/bin/env python3

import cgi
import json
import urllib.parse
import urllib.request


def find_nth(haystack, needle, n):
    start = haystack.find(needle)
    while start >= 0 and n > 1:
        start = haystack.find(needle, start + len(needle))
        n -= 1
    return start


def lastfm(method: str, a: str) -> dict:
    return json.loads(urllib.request.urlopen(urllib.request.Request(
        "http://ws.audioscrobbler.com/2.0/?method={}&artist={}&autocorrect=1&api_key=c94f6bae579e47179e8fbde12880a85c&format=json".format(
            method, urllib.parse.quote(a)))).read().decode("utf8"))


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
    wikipediaInfo = wikipedia(str(lastFmInfo.get("artist").get("name")))
    lastFmBio = str(lastFmInfo.get("artist").get("bio").get("content"))
    if lastFmBio.count("\n") > 4:
        lastFmBio = lastFmBio[:find_nth(lastFmBio, "\n", 4)]
    lastFmBio = lastFmBio.replace("\n", " ").replace("  ", " ").strip()
    wikipediaBio = str(list(wikipediaInfo.get("query").get("pages").values())[0].get("extract"))
    wikipediaBio = wikipediaBio.replace("\n", " ").replace("  ", " ").strip()
    respond(True, {"biography": lastFmBio if len(lastFmBio) > len(wikipediaBio) else wikipediaBio,
                   "name": lastFmInfo.get("artist").get("name")})
except Exception:
    respond(False, "No artist biography found.")
