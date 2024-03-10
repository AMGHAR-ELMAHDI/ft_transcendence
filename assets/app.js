const inputs = document.querySelectorAll('input')
const login = document.querySelector('.create')
const login_ = document.querySelector('.log')
const register = document.querySelector('.login_btn')
const register_ = document.querySelector('.regis')
const content_ = document.querySelector('.login')
const content = document.querySelector('.register')
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

tl.fromTo(".fullname", {opacity: 0}, {opacity: 1, duration: .4})
tl.fromTo(".email", {opacity: 0}, {opacity: 1, duration: .4})
tl.fromTo(".password", {opacity: 0}, {opacity: 1, duration: .4})
tl.fromTo(".fourtytwo", {opacity: 0}, {opacity: 1, duration: .4})
tl.fromTo(".gmail", {opacity: 0}, {opacity: 1, duration: .4}, "-=.4")
tl.fromTo(".create", {opacity: 0}, {opacity: 1, duration: .4})

login.addEventListener('click', ()=> {
	content.classList.add('swipe')
	content.classList.remove('show')
	setTimeout(()=> content_.classList.remove('swipe'),
				content_.classList.add('show'), 1000)
})

login_.addEventListener('click', ()=> {
	content.classList.add('swipe')
	content.classList.remove('show')
	setTimeout(()=> content_.classList.remove('swipe'),
				content_.classList.add('show'), 1000)
})

register.addEventListener('click', ()=> {
	content_.classList.add('swipe')
	content_.classList.remove('show')
	setTimeout(()=> content.classList.remove('swipe'),
				content.classList.add('show'), 1000)
})

register_.addEventListener('click', ()=> {
	content_.classList.add('swipe')
	content_.classList.remove('show')
	setTimeout(()=> content.classList.remove('swipe'),
				content.classList.add('show'), 1000)
})