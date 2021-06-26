import React from 'react';

import taskList from './TaskList';
import user from './User';


window.user = user;
window.taskList = taskList;
class BaseComponent extends React.PureComponent {
  rerender = () => {
    this.setState({
      _rerender: new Date(),
    });
  }
}

class App extends BaseComponent {

  state = {
    isInitialized: false,
  }

  render() {
    if (!this.state.isInitialized) {
      return null;
    }
    return (
      user.data.email ? (
        <Home />
      ) : (
        <Login />
      )
    );
  }

  async componentDidMount() {
    await user.initialize();
    this.setState({
      isInitialized: true,
    });
    this.unsubUser = user.subscribe(this.rerender);
  }

  async componentDidUpdate() {
    if (user.data.email && !taskList.isInitialized) {
      await taskList.initialize();

    }
  }
  componentWillUnmount() {
    this.unsubUser();
  }
}

class Login extends BaseComponent {
  state = {
    username: '',
  }

  render() {
    return (
      <form onSubmit={this.submit}>
        <h1>login</h1>
        <p>
          Username <input type='text' name="username" value={this.state.username} onChange={this.setInput_email} />
        </p>
        <p>
          <button>submit</button>
        </p>
      </form>
    );
  }

  setInput_email = (event) => {
    this.setState({
      username: event.target.value,
    });
  }

  submit = async (event) => {
    event.preventDefault();
    let id = this.state.username;
    await user.editSingle({
      id,
      email: this.state.username,
    });
  }
}
class Home extends BaseComponent {
  state = {
    id: '',
    task: '',
    status: 'finished',
    tag: '',
  }

  render() {
    return (
      <div>
        <h2>Form new todo</h2>
        <form onSubmit={this.submitFormTaskList}>
          <input type="hidden" name="id" value={this.state.id} onChange={this.taskFormField} />
          Task : <input name="task" type='text' value={this.state.task} onChange={this.taskFormField} /> <br></br>
          Tag : <input name="tag" type='text' value={this.state.tag} onChange={this.taskFormField} /> <br></br>
          Status:
          <select name="status" value={this.state.status} onChange={this.taskFormField}>
            <option value="finished">Finished</option>
            <option value="unfinished">Unfinished</option>
          </select>
          <br />
          <button>submit</button>
        </form>
        <h1>
          Task List
        </h1>

        <h2>
          <button onClick={this.upload}>
            {`Sychronize (${taskList.countUnuploadeds()})`}
          </button>
        </h2>
        <pre>
          last upload: {taskList.dataMeta.tsUpload}
        </pre>
        <ul>
          {
            taskList.data.map((task) => (
              <li key={task._id}>
                <h3>Task: {task.task}</h3>
                <p>Tag: {task.tag} </p>
                <p>Status: {task.status}</p>
                {
                  !taskList.checkIsUploaded(task) && (
                    ` (Unsync)`
                  )
                }
                {`     `}
                <button onClick={() => this.deleteTaskList(task._id)}>
                  X
                </button>
                <button onClick={() => this.editTaskList(task._id, task.task, task.tag)}>Edit</button>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }



  componentDidMount() {
    this.unsubTodos = taskList.subscribe(this.rerender);
  }

  componentWillUnmount() {
    this.unsubTodos();
  }

  taskFormField = (event) => {
    let name = event.target.name;
    let val = event.target.value;
    this.setState({ [name]: val });
  }

  logout = async () => {
    await taskList.deinitialize();
    await user.deleteSingle();
  }

  submitFormTaskList = async (event) => {
    event.preventDefault();
    console.log(this.state.id);
    if (this.state.id === '') {
      console.log('add');
      await taskList.addItem({
        task: this.state.task,
        tag: this.state.tag,
        status: this.state.status,
      }, user.data);
      this.setState({ task: '', tag: '', status: '' });
    } else {
      console.log('edit');
      await taskList.editItem(this.state.id,
        { task: this.state.task, tag: this.state.tag, status: this.state.status });
    }

  }

  editTaskList = (id, task, tag) => {
    console.log('Edit ', task, tag);
    this.setState({ task: task, tag: tag, id: id })
  }

  deleteTaskList = async (id) => {
    taskList.deleteItem(id, user.data);
  }

  upload = async () => {
    console.log('uploading...');
    try {
      await taskList.upload();
      console.log('upload done');
    } catch (err) {
      alert(err.message);
      console.log('upload failed');
    }
  }
}



export default App;