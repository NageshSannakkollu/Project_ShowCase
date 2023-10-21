import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from './component/Header'
import ProjectItem from './component/ProjectItem'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
// Replace your code here
class App extends Component {
  state = {
    projectsList: [],
    activeCategoryId: categoriesList[0].id,
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.getProjectsList()
  }

  onClickRetryButton = () => {
    this.getProjectsList()
  }

  onChangeCategory = event => {
    this.setState({activeCategoryId: event.target.value}, this.getProjectsList)
  }

  getFormattedData = eachData => ({
    id: eachData.id,
    imageUrl: eachData.image_url,
    name: eachData.name,
  })

  getProjectsList = async () => {
    const {activeCategoryId} = this.state
    this.setState({apiStatus: apiConstants.inProgress})
    const url = `https://apis.ccbp.in/ps/projects?category=${activeCategoryId}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = data.projects.map(eachData =>
        this.getFormattedData(eachData),
      )
      this.setState({
        projectsList: updatedData,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderProjectsListView = () => {
    const {projectsList, activeCategoryId} = this.state
    console.log(projectsList)

    return (
      <div>
        <Header />
        <div className="category-projects-container">
          <select
            className="select-container form-container"
            value={activeCategoryId}
            onChange={this.onChangeCategory}
          >
            {categoriesList.map(eachCategory => (
              <option key={eachCategory.id} value={eachCategory.id}>
                {eachCategory.displayText}
              </option>
            ))}
          </select>
          <ul className="projects-container">
            {projectsList.map(eachProject => (
              <ProjectItem projectDetails={eachProject} key={eachProject.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader" data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" height={20} width={20} />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={this.onClickRetryButton}
      >
        Retry
      </button>
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderProjectsListView()
      case apiConstants.inProgress:
        return this.renderLoadingView()
      case apiConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }
}
export default App
