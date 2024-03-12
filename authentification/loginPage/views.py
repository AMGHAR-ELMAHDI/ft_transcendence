from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from .forms import MyForm
import requests
import json

# Create your views here.
def	FetchData(request):
	if request.method == 'GET':
		code = request.headers.get('TheCode')
		url = 'https://api.intra.42.fr/oauth/token'
		body = {
			"grant_type" : "client_credentials",
			"client_id" : "u-s4t2ud-af224575ea071bd1b0c2998f1f2971523605aaf2ed3f3f82f081745c6246897b",
			"client_secret" : "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",
			"redirect_uri" : "http://localhost:8000/backend/",
			"code" : code,
		}
		resp = requests.post(url, json = body)
		authz = resp.json()['access_token']
		print(authz)
		Headers = {
			'Authorization': 'Bearer ' + authz
		}
		resp2 = requests.get('https://api.intra.42.fr/v2/users/mnassi', headers = Headers)
		if (resp.status_code == 200):
			return render(request, 'success.html', { 'status_code' : resp2.status_code, 'data_to_log': resp2.json })
		return render(request, 'error.html', { 'status_code' : resp2.status_code })
	else:
		return render(request, 'method.html')
		
	
	
	