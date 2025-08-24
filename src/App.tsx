import './App.css'
import Home from './pages/home'
import Info from './pages/info'
function App() {

  return (
    <section>
      <div className="top-bar border-container" >
        <div className="inner">
          <p>
            <div className="navigation">
              <i className="fa-solid fa-angle-left "></i>
              <i className="fa-solid fa-angle-right "></i>
            </div>

            <div className="page-title">
              <h1>home</h1>
            </div>
          </p>
        </div>
      </div>
      <div className="main">
        <div className="left-side-bar border-container" style={{ display: 'none' }}>
          <div className="inner">
          </div>
        </div>

        <div className="main-bar border-container">
          <div className="inner">
            <Home></Home>
          </div>
        </div>

        <div className="right-side-bar border-container" style={{ display: 'none' }}>
          <div className="inner">
            <Info></Info>
          </div>
        </div>
      </div>

      <div className="bottom-bar border-container">
        <div className="inner">
          <div>© 2025 Rudra Rathod · Built with ❤️ using React.</div>
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
