#!/usr/bin/env python3

import json
import sys
import urllib.request
import random
import re


def fetchUrlContent(command, data=None):

    url = 'http://127.0.0.1:4567/api/v1/game/moba/{0}'.format(command)

    # print('fetching url ', url, data)

    if data is not None:
        dataDump = json.dumps(data)
        byteData = bytes(dataDump, 'utf-8')
        res = urllib.request.urlopen(url, byteData)
    else:
        res = urllib.request.urlopen(url)

    return res.read().decode("utf-8")


def printReelView(data):

    if 'rounds' not in data['round']:
        return

    for roundIndex, r in enumerate(data['round']['rounds']):
        print(r)
        longest = 0
        d = []
        for i, reel in enumerate(r['reelSymbols']):
            o = 1  # r['reelStartOffsets'][i]
            length = 3  # r['reelLengths'][i]
            d.append(reel[o:o + length])
            longest = max(longest, len(reel[o:o + length]))

        s = '#{} round\n'.format(roundIndex + 1)

        print(d)
        for j in range(0, longest):
            row = ''
            for i in range(0, 5):
                if len(d[i]) > j:

                    symbolInWin = False

                    for win in r['wins']:
                        # for p in win['positions']:
                        for p in win['indices']:
                            # if p['location']['column'] == i and
                            # p['location']['row'] == j:
                            if p[0] == i and p[1] == j:
                                symbolInWin = True

                    if symbolInWin:
                        symbol = '*'
                    else:
                        symbol = ' '

                    symbol += '{0}'.format(d[i][j])
                    row += '{0:>4}'.format(symbol)
                else:
                    row += '     '

            if len(row) > 0:
                s += '{0}\n'.format(row)

        print(s)

        if 'wins' in r:
            if len(r['wins']) > 0:
                s = ''
                for i, win in enumerate(r['wins']):
                    s += 'win #{0}, winamount {1}, symbol {2}, rows: '.format(
                        i + 1,
                        win['winAmount'],
                        win['symbol'])

                    for j, p in enumerate(win['indices']):
                        if j > 0:
                            s += ', '
                        s += '{0}'.format(p[1])

                    s += '\n'

                print(s)
        else:
            print('no wins?')


def printStatus(data):
    d = json.loads(data)
    if 'round' in d:
        print('round exists, cangamble:', d['round']['canGamble'])

        printReelView(d)

        if 'gambleResult' in d['round']:
            print('gambleResult: ', json.dumps(
                d['round']['gambleResult'], indent=2))

        print('###\n' + json.dumps(json.loads(data), indent=2) + '\n###')
    else:
        print('###\n' + json.dumps(json.loads(data), indent=2) + '\n###')


def doInit():
    content = fetchUrlContent('init')

    return content


def doConfig():
    content = fetchUrlContent('config')

    return content


def doCheat(cheats):
    try:
        a = re.findall(r'([0-9]+)', ' '.join(cheats))
        intArray = list(map(lambda x: int(x), a))
        content = fetchUrlContent('cheat', {'fixedRandoms': intArray})

    except urllib.error.HTTPError as e:

        if e.code == 500:
            print(e.code, 'received. round already started?')

            content = fetchUrlContent('init')
            # print(c)
        else:
            print('other error', e.code)
            content = None

    return content


def doPick(pick, swap=False):
    try:
        content = fetchUrlContent('action', {"action": "pick", "params": {"pick":pick, "swap":swap}})

    except urllib.error.HTTPError as e:

        if e.code == 500:
            print(e.code, 'received. round already started?')

            content = fetchUrlContent('init')
            # print(c)
        else:
            print('other error', e.code)
            content = None

    return content


def doPlacebet():
    try:
        content = fetchUrlContent('placebet', {'bet': 100, 'action': 'deal'})
    except urllib.error.HTTPError as e:

        if e.code == 500:
            print(e.code, 'received. round already started?')

            content = fetchUrlContent('init')
            # print(c)
        else:
            print('other error', e.code)
            content = None

    return content


def doSettle():
    try:
        content = fetchUrlContent('settlebet', {'action': 'round'})

    except urllib.error.HTTPError as e:

        if e.code == 500:
            print(e.code, 'received. round already started?')

            content = fetchUrlContent('init')
            # print(c)
        else:
            print('other error', e.code)
            content = None

    return content

def doGamble(selection):
    possiblePicks = ['low', 'high', 'black_seven']

    pick = possiblePicks[int(selection)]

    print('sendin gamble pick', pick, selection)

    content = fetchUrlContent(
        'action', {'action': 'gamble', 'params': {'pick': pick}})

    d = json.loads(content)

    print('gambleResult: ', json.dumps(
        d['round']['gambleResult'], indent=2))


cheats = [
    {
        'description': 'fs',
        'cheat': ["3,0,3,0,3"]
    },
    {
        'description': 'fs2',
        'cheat': ["19,14,2,0,0, 2,5,4,3,0, 2,5,4,9,0, "
                  "2,5,4,9,6, 1,4,3,8,0, 0,3,2,3,3"]
    },
    {
        'description': 'fs3',
        'cheat': ["19,14,2,0,0, 2,5,4,3,0, 0,0,0,0,0, "
                  "0,0,0,0,0, 0,0,0,0,0, 0,3,2,3,3"]
    },
    {
        'description': '5x1',
        'cheat': ["0, 4, 0, 1, 31"]
    },
    {
        'description': 'g012-0',
        'cheat': ["0"]
    },
    {
        'description': 'g01-1',
        'cheat': ["24"]
    },
    {
        'description': 'g01-2',
        'cheat': ["45"]
    },
    {
        'description': 'g2-2',
        'cheat': ["90"]
    },
]

if __name__ == "__main__":

    cont = True

    while(cont):
        commands = input(
            '[I]nit, c[O]nfig, P[lacebet], S[ettle], '
            'G[amble], A[ction], S[w]ap, C[heat], Q[uit] ? ').strip().split(' ')

        if len(commands):
            command = commands[0].lower()

            if command == 'i':
                c = doInit()
                printStatus(c)

            elif command == 'o':
                c = doConfig()
                printStatus(c)

            elif command == 'c':
                if len(commands) > 1:
                    if commands[1][0] == '#':
                        c = doCheat(cheats[int(commands[1][1:])]['cheat'])
                    else:
                        c = doCheat(commands[1:])
                else:
                    cs = ['#{0} - {1}'.format(
                        cheats.index(x), x['description']) for x in cheats]
                    print('parameters needed, available:', '\n'.join(cs))

            elif command == 'a':
                c = doPick(commands[1])
            elif command == 'w':
                c = doPick(commands[1], True)

            elif command == 'p':
                c = doPlacebet()
                printStatus(c)

            elif command == 's':
                c = doSettle()
                print(c)
            elif command == 'g':
                if len(commands) > 1:
                    c = doGamble(commands[1])
                else:
                    c = doGamble(None)
                # print(c)
            elif command == 'q':
                cont = False
            elif len(command):
                print('unknown command \'{0}\''.format(command))

    sys.exit(0)
