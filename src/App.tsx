import './App.css'

function App() {

  return (
    <section>
      <div className="top-bar border-container">
        <div className="inner">
          <p>This is the top bar of the application.</p>
        </div>
      </div>
      <div className="main">
        <div className="left-side-bar border-container">
          <div className="inner">
            {/* <h1>Welcome to the App</h1>
            <p>This is a simple layout with a top bar, left side bar, main content area, and right side bar.</p> */}
          </div>
        </div>

        <div className="main-bar border-container">
          <div className="inner">
            {/* <h2>Main Content Area</h2>
            <p>This is where the main content will be displayed.</p> */}
          </div>
        </div>

        <div className="right-side-bar border-container">
          <div className="inner">
            <h4>Rudra Rathod</h4>
            <div className="pfp"></div>

            <div>
              <h4>intern at BOT</h4>
            </div>


            <div className="info-card">
              <div className="card-img">
                <div>about my education</div>
              </div>
              <div><b>STUDENT</b><br />
                isbm college of engineering
              </div>
              <div>
                <b>BRANCH</b><br />
                artificial intelligence and machine learning
              </div>

              <div>
                <b>PREVIOUS EDUCATION</b>
                <br />
                diploma in computer engineering
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-bar border-container">
        <div className="inner">
          <p>
            <i className="fa-solid fa-envelope"></i>
            <i className="fa-brands fa-linkedin"></i>
            <i className="fa-brands fa-github"></i>
          </p>
        </div>
      </div>
    </section>
  )
}

export default App
