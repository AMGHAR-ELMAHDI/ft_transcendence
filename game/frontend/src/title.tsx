import './title.css'

interface Title {
	title: string;
}

function Title({title}: Title) {
	return (
		<h1 className='text'>{title}</h1>
	)
}

export default Title