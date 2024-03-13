from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from dotenv import dotenv_values
import requests
import json

# Create your views here.
def	FetchData(request):
	if request.method == 'GET':
		env_var = dotenv_values()
		code = request.GET.get('code')
		url = 'https://api.intra.42.fr/oauth/token'
		with open('/mnt/c/Users/ULTRAPC/Downloads/etc (1)/trans/ft_transcendence/backend/authentification/loginPage/data.json') as file:
			body = json.load(file)
		body['code'] = code
		for key, value in env_var.items():
			body[key] = value
		resp = requests.post(url, data = body)
		authz = resp.json()['access_token']
		Headers = {
			'Authorization': 'Bearer ' + authz
		}
		resp2 = requests.get('https://api.intra.42.fr/v2/me/', headers = Headers)
		if (resp2.status_code == 200):
			return JsonResponse(resp2)
		return render(request, 'error.html', { 'status_code' : resp2.status_code })
	else:
		return render(request, 'method.html')
