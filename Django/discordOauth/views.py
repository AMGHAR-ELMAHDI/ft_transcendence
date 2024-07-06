from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import redirect
import requests

def home(HttpRequest):
    return(JsonResponse({'msg' : 'hi there'}))

uri='https://discord.com/oauth2/authorize?client_id=1259091120730669106&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A2500%2Fdiscord%2Flogin%2Fredirect&scope=identify'
def discord_login(HttpRequest):
	return redirect(uri)

def discord_redirect(request : HttpRequest):
    code = request.GET.get('code')
    
    getData(code=code)
    
    return JsonResponse({'msg' : code})

def getData(code : str):
    data = {
		"client_id": "1259091120730669106",
		"client_secret" : "oKkTjjaDLetyGb-H1Lukn7tq-GPeroj0",
		"grant_type" : "authorization_code",
		"code" : code,
		"redirect_uri" : "http://localhost:2500/discord/login/redirect",
		"scope" : "identify",
	}
    headers = {
		'Content-type': 'application/x-www-form-urlencoded'
	}
    response = requests.post("https://discord.com/api/oauth2/token", data=data, headers=headers)
    print(response)
    credentials = response.json()
    print(credentials)