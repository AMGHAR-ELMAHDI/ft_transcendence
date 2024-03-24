import React from 'react'

interface ProfileProps {
	profileList: string;
}

function Profile({profileList}: ProfileProps) {
  return (
	<div id="Profile">

		<div className="profile-left">
			<div id="profile-usr"> 
				<img id='profile-img' src="/bacharG.svg" alt="profilePic"/>
				<h1 id="user-name">Othman Chekairi</h1>
			</div>
			<div className="line1">
				<div className="line2"></div>
			</div>
		</div>

		<div className="profile-right">
			<div className="profile-level">
				<div></div>
				<div id="profile-level-container">
					<div id="profile-level-text">
						<h2>Level 10</h2>
						<h2>700/1000</h2>
					</div>
					<div id="profile-level-bar">
						<progress id="progress-bar" value={75} max={100}/>
					</div>
				</div>
				<div id="profile-tabs">
					<h1>History</h1>
					<h1>Trophies</h1>
					<h1>Items</h1>
				</div>
			</div>

			<div id="circles">
				<div className="progress-circle" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}></div>
				<div className="progress-circle" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}></div>
			</div>
		</div>
	</div>
  )
}

export default Profile