import PouchyStore from 'pouchy-store';

class TaskList extends PouchyStore {
    get name() {
        return 'task_list';
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
}

export default new TaskList();