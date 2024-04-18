import React from 'react'

function ProfileHistory() {
  return (
		<div id="history">
			{/* <div className="history-top-text">
				<h2>GAMES HISTORY</h2>
				<h6>View All Matches</h6>
			</div> */}
			<div className="history-container">
				{/* <div className="line3">
					<div className="line4"></div>
				</div> */}
				<div id="tabs-container">
					<div className="history-tabs history-tab-first history-tab-won">
						<div className="history-tabs-left-container">
							<div id="dashboard-history-pic"></div>
							<div id="dashboard-history-opponent"><h3>Zmoumni</h3><h3>13 : 13</h3></div>
							<div id="dashboard-history-mode"><h3>Mode</h3><h3>Tournament</h3></div>
							<div id="dashboard-history-date"><h3>Date</h3><h3>24/03/2024</h3></div>
						</div>
						<div className="dashboard-history-right-rect rect-won"></div>
					</div>
					<div className="history-tabs history-tab-lost">
						<div className="history-tabs-left-container">
							<div id="dashboard-history-pic"></div>
							<div id="dashboard-history-opponent"><h3>Zmoumni</h3><h3>13 : 13</h3></div>
							<div id="dashboard-history-mode"><h3>Mode</h3><h3>Tournament</h3></div>
							<div id="dashboard-history-date"><h3>Date</h3><h3>24/03/2024</h3></div>
						</div>
						<div className="dashboard-history-right-rect rect-lost"></div>
					</div>
					<div className="history-tabs history-tab-won">
						<div className="history-tabs-left-container">
							<div id="dashboard-history-pic"></div>
							<div id="dashboard-history-opponent"><h3>Zmoumni</h3><h3>13 : 13</h3></div>
							<div id="dashboard-history-mode"><h3>Mode</h3><h3>Tournament</h3></div>
							<div id="dashboard-history-date"><h3>Date</h3><h3>24/03/2024</h3></div>
						</div>
						<div className="dashboard-history-right-rect rect-won"></div>
					</div>
					<div className="history-tabs history-tab-lost">
						<div className="history-tabs-left-container">
							<div id="dashboard-history-pic"></div>
							<div id="dashboard-history-opponent"><h3>Zmoumni</h3><h3>13 : 13</h3></div>
							<div id="dashboard-history-mode"><h3>Mode</h3><h3>Tournament</h3></div>
							<div id="dashboard-history-date"><h3>Date</h3><h3>24/03/2024</h3></div>
						</div>
						<div className="dashboard-history-right-rect rect-lost"></div>
					</div>
					<div className="history-tabs history-tab-won">
						<div className="history-tabs-left-container">
							<div id="dashboard-history-pic"></div>
							<div id="dashboard-history-opponent"><h3>Zmoumni</h3><h3>13 : 13</h3></div>
							<div id="dashboard-history-mode"><h3>Mode</h3><h3>Tournament</h3></div>
							<div id="dashboard-history-date"><h3>Date</h3><h3>24/03/2024</h3></div>
						</div>
						<div className="dashboard-history-right-rect rect-lost"></div>
					</div>
					<div className="history-tabs history-tab-lost">
						<div className="history-tabs-left-container">
							<div id="dashboard-history-pic"></div>
							<div id="dashboard-history-opponent"><h3>Zmoumni</h3><h3>13 : 13</h3></div>
							<div id="dashboard-history-mode"><h3>Mode</h3><h3>Tournament</h3></div>
							<div id="dashboard-history-date"><h3>Date</h3><h3>24/03/2024</h3></div>
						</div>
						<div className="dashboard-history-right-rect rect-lost"></div>
					</div>
				</div>
			</div>
		</div>
  )
}

export default ProfileHistory