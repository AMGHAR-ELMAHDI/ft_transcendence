import React from 'react'
import Profile from './Profile'
import ProfileHistory from './ProfileHistory'

function Dashboard() {
  return (
	<>
		<div className="DashboardGameModes">
			<div id="Dashboard-Main-GameModeContainer">
				main
				{/* <img className='big' src="/DashboardGameModes/table1.jpg" alt="MainGameMode" /> */}
			</div>
			<div id="Dashboard-Secondary-GameModeContainer">
				second
				{/* <img className='extraModes' src="/DashboardGameModes/table1.jpg" alt="ExtraGameMode1" />
				<img className='extraModes' src="/DashboardGameModes/table1.jpg" alt="ExtraGameMode2" />
				<img className='extraModes' src="/DashboardGameModes/table1.jpg" alt="ExtraGameMode3" /> */}
			</div>
			<div id="ProfileHistory"><ProfileHistory /></div>
		</div>
	</>
  )
}

export default Dashboard