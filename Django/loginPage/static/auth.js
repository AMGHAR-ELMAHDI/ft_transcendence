var fourty = document.querySelector('.fourtytwo')
var google = document.querySelector('.gmail')

fourty.addEventListener('click', fetchinData)

function fetchinData() {
	window.location.href = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-af224575ea071bd1b0c2998f1f2971523605aaf2ed3f3f82f081745c6246897b&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fbackend%2F&response_type=code"
}