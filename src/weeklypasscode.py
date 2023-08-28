# https://makemeapassword.ligos.net/api/v1/passphrase/plain?pc=1&wc=5&sp=y&maxCh=64


import requests

def get_passcode():
    url = "https://makemeapassword.ligos.net/api/v1/passphrase/plain?pc=1&wc=5"
    response = requests.get(url)
    passcode = response.text
    passcode = passcode.replace(" ", "_")
    return passcode

def gen_user_cookie(passcode):
    # passcode = get_passcode()
    user_cookie = passcode.replace(" ", "")
    for each in user_cookie:
        user_cookie = user_cookie.replace(each, str(ord(each)))
    return user_cookie

if __name__ == "__main__":
    print(gen_user_cookie(get_passcode()))