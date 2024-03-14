from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from dotenv import dotenv_values
import requests
import json


def	readJsonFile(code):
	env_var = dotenv_values()
	with open('/mnt/c/Users/ULTRAPC/Downloads/etc (1)/trans/ft_transcendence/backend/authentification/loginPage/data.json') as file:
		body = json.load(file)
	body['code'] = code
	for key, value in env_var.items():
		body[key] = value
	return body

# Create your views here.
def	FetchData(request):
	if request.method == 'GET':
		code = request.GET.get('code')
		url = 'https://api.intra.42.fr/oauth/token'
		body = readJsonFile(code)
		resp = requests.post(url, data = body)
		authz = resp.json()['access_token']
		print(authz)
		Headers = {
			'Authorization': 'Bearer ' + authz
		}
		resp2 = requests.get('https://api.intra.42.fr/v2/me/', headers = Headers)
		if (resp2.status_code == 200):
			return HttpResponse(resp2)
		return render(request, 'error.html', { 'status_code' : resp2.status_code })
	else:
		return render(request, 'method.html')
