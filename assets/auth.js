

var parsedCode
var fourty = document.querySelector('.fourtytwo')
var google = document.querySelector('.gmail')

fourty.addEventListener('click', Authentification)

function Authentification() {
	window.location.href = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-55b1a573a7e910a285ae1ae0ca57b5c97046d82c6ecb6582439d5088f4a96597&redirect_uri=http%3A%2F%2Flocalhost%3A5500&response_type=code"
}

if (window.location.search.indexOf("=") !== -1) {
	console.log(window.location.search)
	setTimeout(()=> fetchinData(), 2000)
}

function fetchinData() {
	var Data = {
		'Content-Type': 'application/json',
		'TheCode': parseCode(window.location.search),
	}
	fetch("http://localhost:8000/backend/", {
		method: 'GET',
		headers: Data,
		mode: 'no-cors',
	})
	.catch(error => {
		print('error fetching: ', error)
	})
}

function parseCode(code) {
	var position = code.indexOf("=")
	return code.substring(position + 1, code.length)
}
