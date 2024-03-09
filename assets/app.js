const inputs = document.querySelectorAll('input')
const login = document.querySelector('.create')
const login_ = document.querySelector('.log')
const content_ = document.querySelector('.content_')
const content = document.querySelector('.content')
const email = document.querySelector('.email')
const fullname = document.querySelector('.fullname')
const password = document.querySelector('.password')
const buttons = document.querySelector('.buttons')
const top_ = document.querySelector('.top_')
const member = document.querySelector('.member')
const tl = gsap.timeline({default : {ease : 'power2.out'}});
const tl1 = gsap.timeline({default : {ease : 'power2.out'}});
const tl2 = gsap.timeline({default : {ease : 'power2.out'}});
const tl3 = gsap.timeline({default : {ease : 'power2.out'}});

tl.fromTo(".fullname", {opacity: 0, x: "-300%"}, {opacity: 1, x: "0%", duration: .6})
tl.fromTo(".email", {opacity: 0, x: "-300%"}, {opacity: 1, x: "0%", duration: .6})
tl.fromTo(".password", {opacity: 0, x: "-300%"}, {opacity: 1, x: "0%", duration: .6})
tl.fromTo(".fourtytwo", {opacity: 0}, {opacity: 1, duration: .6})
tl.fromTo(".gmail", {opacity: 0}, {opacity: 1, duration: .6}, "-=.6")
tl.fromTo(".create", {opacity: 0}, {opacity: 1, duration: .6})

login.addEventListener('click', ()=> {
	content.classList.add('swipe')
	setTimeout(()=> 
		content_.classList.add('show'),
		password.classList.add('hide'),
		email.classList.add('hide'),
		buttons.classList.add('hide'),
		fullname.classList.add('hide'),
		top_.classList.add('hide'),
		member.classList.add('hide')
	, 1500)
})
login_.addEventListener('click', ()=> {
	password.classList.add('swipe')
	setTimeout(()=> 
		password.classList.add('hide'),
		email.classList.add('hide'),
		buttons.classList.add('hide'),
		fullname.classList.add('hide'),
		top_.classList.add('hide'),
		member.classList.add('hide'),
		content_.classList.add('show')
	, 1500)
})