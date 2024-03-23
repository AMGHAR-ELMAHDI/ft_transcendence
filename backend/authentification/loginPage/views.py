from django.views.generic import View
from django.http import HttpResponse, JsonResponse
from django.core.serializers import serialize
from django.shortcuts import render, redirect
from dotenv import dotenv_values
from .models import User
import requests
import json
import os

def	readJsonFile(code):
	env_var = dotenv_values()
	with open('/Users/mnassi/Desktop/1337/ft_transcendence/backend/authentification/loginPage/data.json') as file:
		body = json.load(file)
	body['code'] = code
	for key, value in env_var.items():
		body[key] = value
	return body

def isUserExist(email):
	user_filter = User.objects.filter(email__iexact=email)
	return user_filter.exists()

# Create your views here.
def	FetchData(request):
	if request.method == 'GET':
		code = request.GET.get('code')
		url = 'https://api.intra.42.fr/oauth/token'
		body = readJsonFile(code)
		resp = requests.post(url, data = body)
		if (resp.status_code != 200):
			return redirect('http://localhost:5173/?status=access_denied', status_code=403)
		authz = resp.json()['access_token']
		Headers = {
			'Authorization': 'Bearer ' + authz
		}
		resp2 = requests.get('https://api.intra.42.fr/v2/me/', headers = Headers)
		if (resp2.status_code == 200):
			FirstName = resp2.json()['first_name']
			LastName = resp2.json()['last_name']
			username = resp2.json()['login']
			email = resp2.json()['email']
			data = {
				'email' : email
			}
			if (isUserExist(email)):
				request.session['response'] = json.dumps(data)
				return redirect('http://localhost:5173')
			item = User(firstname=FirstName, lastname=LastName, username=username, email=email)
			item.save()
			request.session['response'] = json.dumps(data)
			return redirect('http://localhost:5173')
		return redirect('http://localhost:5173/?status=auth_failed', status_code=401)
	else:
		return redirect('http://localhost:5173/?status=method_not_allowed', status_code=405)


def Users(request):
	users = User.objects.all()
	return render(request, 'users.html', {
		'users' : users,
	})

def cookies(request):
	return HttpResponse(request.session.get('response'))

def checkme(request):
	data = request.session.get('response')
	if data == None:
		return JsonResponse({'error': 'Unauthorized'}, status=401)
	else:
		json_data = json.loads(data)
		email = json_data['email']
		try:
			user_ = User.objects.get(email=email)
			return JsonResponse({'data': {'firstname': user_.firstname, 'lastname': user_.lastname, 'email': user_.email, 'coins': user_.coins, 'level': user_.level}})
		except User.DoesNotExist:
			return JsonResponse({'error': 'Unauthorized'}, status=401)

def	SaveManual(request):
	if request.method == 'GET':
		email = request.GET.get('email')
		LastName = request.GET.get('lastname')
		FirstName = request.GET.get('firstname')
		passwd = request.GET.get('password')
		if (isUserExist(email)):
			return redirect('http://localhost:5173/?status=already_exist', status_code=409)
		else:
			inst_ = User(firstname=FirstName, lastname=LastName, email=email, password=passwd)
			inst_.save()
			data = {
				'email' : email
			}
			request.session['response'] = json.dumps(data)
			return redirect('http://localhost:5173/?status=done') #change this to succes and add a success element to html
	else:
		return redirect('http://localhost:5173/?status=method_not_allowed', status_code=405)

def	login(request):
	if request.method == 'GET':
		try:
			email = request.GET.get('email')
			passwd = request.GET.get('password')
			userInfo = User.objects.get(email=email)
			if not userInfo.password:
				return redirect('http://localhost:5173/?status=user_loggedIn_as_42', status_code=405)
			if passwd != userInfo.password:
				return redirect('http://localhost:5173/?status=incorrect_password', status_code=400)
			else:
				data = {
					'email' : email
				}
				request.session['response'] = json.dumps(data)
				return redirect('http://localhost:5173/?status=loggedin')
		except User.DoesNotExist:
			return redirect('http://localhost:5173/?status=email_not_found', status_code=400)
	else:
		return redirect('http://localhost:5173/?status=method_not_allowed', status_code=405)