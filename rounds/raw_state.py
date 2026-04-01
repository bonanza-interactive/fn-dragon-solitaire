#!/usr/bin/env python3

import json
import sys
import urllib.request

def fetchUrlContent(command, data=None):

    url = 'http://127.0.0.1:4567/api/v1/game/_/{0}'.format(command)

    #print('fetching url ', url, data)

    if data is not None:
        dataDump = json.dumps(data)
        byteData = bytes(dataDump, 'utf-8')
        res = urllib.request.urlopen(url, byteData)
    else:
        res = urllib.request.urlopen(url)

    return res.read().decode('utf-8')

def doCheat(rawState):
    try:
        content = fetchUrlContent('cheat', {'rawState': rawState})

    except urllib.error.HTTPError as e:

        if e.code == 500:
            print(e.code, 'received. round already started?')

            content = fetchUrlContent('init')
            # print(c)
        else:
            print('other error', e.code)
            content = None

    return content


if __name__ == '__main__':

    if len(sys.argv) != 2:
        print('give json state as a parameter')
        sys.exit(1)

    with open(sys.argv[1], 'r') as f:
        contents = json.load(f)
        res = doCheat(contents)
        print(json.dumps(json.loads(res), indent=2))
