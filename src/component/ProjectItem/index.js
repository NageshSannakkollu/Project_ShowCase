import './index.css'

const ProjectItem = props => {
  const {projectDetails} = props
  const {name, imageUrl, id} = projectDetails
  return (
    <li key={id} className="project-item-container">
      <img src={imageUrl} alt={name} className="project-image" />
      <p className="project-name">{name}</p>
    </li>
  )
}

export default ProjectItem
