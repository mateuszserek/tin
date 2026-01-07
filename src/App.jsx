import { useState } from 'react'
import './App.css'

const userTasksUrl = "https://bikol.vm.wmi.amu.edu.pl/tin/results/"

function getMetaData() {
  return {
    "tasks": {
      "Z1.1": {
        "deadline": "123:456:123",
        "maxScore": 10
      },
      "Z1.2": {
        "deadline": "123:456:123",
        "maxScore": 10
      }
    }
  }
}

function getTasks(index) {
  return {
    "score": 5,
    "tasks": {
      "Z1.1": {
        "time": "2025-10-10T23:12:15+01:00",
        "score": 2,
        "info": ""
      },
      "Z1.2": {
        "time": "2025-10-10T23:12:15+01:00",
        "score": 3,
        "info": ""
      }
    }
  }
}

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


function App() {
  const [tasks, setTasks] = useState([])
  const [sumScore, setSumScore] = useState(0)
  const [inputValue, setInputValue] = useState(0)
  const taskMetaData = getMetaData().tasks

  const findTasks = e => {
    const taskArray = []
    const rawTasks = getTasks(inputValue)
    for(const key of Object.keys(rawTasks.tasks)) {
      const currentTask = rawTasks.tasks[key]
      currentTask.key = key 
      taskArray.push(currentTask)
    }
    setSumScore(rawTasks.score)
    setTasks(taskArray)
    fetch(`${userTasksUrl}/498815`)
      .then(res => console.log(res.json()))
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
        <p>{sumScore}</p>
        {tasks.map(task => (
          <TaskComponent
            key={task.key}
            name={task.key}
            deadline={taskMetaData[task.key]["deadline"]}
            scoreDate={task.time}
            score={task.score}
            maxScore={taskMetaData[task.key]["maxScore"]}
          />
        ))}
      </div>
    </>
  )

}
export default App