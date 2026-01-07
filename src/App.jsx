import { useState } from 'react'
import './App.css'

const userTasksUrl = "https://bikol.vm.wmi.amu.edu.pl/tin/results"
const dataUrl = "https://bikol.vm.wmi.amu.edu.pl/tin/tasks"


function TaskComponent({name, deadline, scoreDate, score, maxScore}) {
  return (
    <div className = "task-container">
      <h3>{name}</h3>
      <p>User score: {score}/{maxScore}</p>
      <p>At {scoreDate}</p>
      <p>Deadline: {deadline}</p>
    </div>
  )
}

const getReadableDate = (dateStr) => {
  const date = new Date(dateStr);

  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };

  const formattedDate = date.toLocaleString('en-US', options);
  return formattedDate
}


function App() {
  const [tasks, setTasks] = useState([])
  const [taskMetaData, setTaskMetaData] = useState([])
  const [sumScore, setSumScore] = useState(0)
  const [inputValue, setInputValue] = useState(0)

  async function findTasks() {
    try {
      const userTasks = await fetch(`${userTasksUrl}/${inputValue}`)
      const data = await userTasks.json()

      const taskMetaDataRaw = await fetch(dataUrl)
      const taskMetaData = await taskMetaDataRaw.json()

      const taskArray = []
    
      for(const key of Object.keys(data.tasks)) {
        const currentTask = data.tasks[key]
        currentTask.key = key 
        taskArray.push(currentTask)
      }
      setTaskMetaData(taskMetaData)
      setSumScore(data.score)
      setTasks(taskArray)
    } catch (e) {
      setTaskMetaData([])
      setSumScore(0)
      setTasks([])
    }

    
    
  }
  
  const onValueChange = e => {
    setInputValue(e.target.value)
  }

  return (
    <>
      <div className = "input-area">
        <input type = "number" placeholder = "student index" onChange = {onValueChange} value = {inputValue}></input>
        <button onClick = {findTasks}>Search for tasks</button>
      </div>
      <div id = "main-tasks-area">
        <p>Sum of your points: {sumScore}</p>
        {tasks.map(task => (
          <TaskComponent
            key={task.key}
            name={task.key}
            deadline={getReadableDate(taskMetaData[task.key]["Deadline"])}
            scoreDate={getReadableDate(task.time)}
            score={task.score}
            maxScore={taskMetaData[task.key]["Score"]}
          />
        ))}
      </div>
    </>
  )

}
export default App