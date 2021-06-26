import PouchyStore from 'pouchy-store';

class TaskList extends PouchyStore {
    get name() {
        return this._name;
    }
    get urlRemote() {
        return 'http://13.250.43.79:5984/';
    }

    get optionsRemote() {
        return {
            auth: {
                username: 'admin',
                password: 'iniadmin',
            }
        }
    }
    setName(userId) {
        this._name = `task_list_${userId}`;
      }
}

export default new TaskList();