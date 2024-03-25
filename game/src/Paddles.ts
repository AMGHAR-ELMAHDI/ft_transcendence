export default class Paddles {
	UserP: HTMLElement;

	constructor(paddleR: HTMLElement) {
		this.UserP = paddleR
	}

    get GetPaddleY() {
        return parseFloat(getComputedStyle(this.UserP).getPropertyValue('--PaddleY'));
    }
    
    set SetPaddleY(y: number) {
		this.UserP.style.setProperty('--PaddleY', y.toString() + 'px')
    }

    onMove() {
		let MouseY: number = 30
		window.addEventListener('mousemove', function(e) {
			MouseY = e.clientY
		})
		console.log(MouseY)
		this.SetPaddleY = MouseY
    }

}