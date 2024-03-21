import React from 'react'

function Profile() {
  return (
	<>
		<div id="profile-usr">
			<div id="profile-img"><img id="profile-img" src="/bacharG.svg" alt="profilePic"/></div>
			<h1 id="user-name">Othman Chekairi</h1>
		</div>
		<div className="line1">
			<div className="line2">line2</div>
		</div>

		<div className="profile-level">
			<div id="profile-level-text">
				<h2>Level 10</h2>
				<h2>700/1000</h2>
			</div>
			<div id="profile-level-bar">
				<progress id="progress-bar" value={75} max={100}/>
			</div>
		</div>
		<div id="circles">
			<div className="progress-circle" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}></div>
			<div className="progress-circle" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}></div>
		</div>
	</>
  )
}

export default Profile