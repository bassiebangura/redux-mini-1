//what Library Code will look like

function CreateStore(reducer) {
	let state; //initial state is undefined

	let listeners = []; //stores listeners that listen for change in state

	const getState = () => state; //returns current state in store

	const subscribe = (listener) => {
		//add listeners and also returns a function,
		//that can be used to unsubscribe that listener
		listeners.push(listener);
		return () => {
			listeners = listeners.filter((l) => l !== listener);
		};
	};

	const dispatch = (action) => {
		//dispatch an action by making the required update
		//to state using the reducer passed when store was created.
		state = reducer(state, action);
		listeners.forEach((listener) => listener());
	};

	return {
		getState,
		subscribe,
		dispatch
	};
}

// App Code
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';

function generateId() {
	//Helper function to generate unique id
	return Math.random().toString(36).substring(2) + new Date().getTime().toString(36);
}
function addTodoAction(todo) {
	return {
		type: ADD_TODO,
		todo
	};
}

function removeTodoAction(id) {
	return {
		type: REMOVE_TODO,
		id
	};
}

function toggleTodoAction(id) {
	return {
		type: TOGGLE_TODO,
		id
	};
}

function addGoalAction(goal) {
	return {
		type: ADD_GOAL,
		goal
	};
}

function removeGoalAction(id) {
	return {
		type: REMOVE_GOAL,
		id
	};
}

function todos(state = [], action) {
	switch (action.type) {
		case ADD_TODO:
			return state.concat([ action.todo ]);
		case REMOVE_TODO:
			return state.filter((todo) => todo.id !== action.id);
		case TOGGLE_TODO:
			return state.map(
				(todo) => (todo.id !== action.id ? todo : Object.assign({}, todo, { complete: !todo.complete }))
			);
		default:
			return state;
	}
}

function goals(state = [], action) {
	switch (action.type) {
		case ADD_GOAL:
			return state.concat([ action.goal ]);
		case REMOVE_GOAL:
			return state.filter((goal) => goal.id !== action.id);
		default:
			return state;
	}
}

function app(state = {}, action) {
	return {
		todos: todos(state.todos, action),
		goals: goals(state.goals, action)
	};
}

const store = CreateStore(app);

store.subscribe(() => {
	console.log('The new state is: ', store.getState());
});

let createEl = (el) => {
	return document.createElement(el);
};

let addTodo = () => {
	const input = document.getElementById('todo');
	const todosListUl = document.getElementById('todos');
	const name = input.value;
	input.value = '';
	let newTodoLiElement = createEl('li');
	newTodoLiElement.innerHTML = name;
	newTodoLiElement.className = 'addedTodoItem';
	let itemID = generateId();
	newTodoLiElement.id = itemID;
	if (name) {
		todosListUl.appendChild(newTodoLiElement);
		store.dispatch(
			addTodoAction({
				id: itemID,
				name,
				complete: false
			})
		);
	}
};

let addGoal = () => {
	const input = document.getElementById('goal');
	const goalsListUl = document.getElementById('goals');
	const name = input.value;
	input.value = '';
	let newGoalLiElement = createEl('li');
	newGoalLiElement.className = 'addedGoalItem';
	newGoalLiElement.innerHTML = name;
	if (name) {
		goalsListUl.appendChild(newGoalLiElement);
		store.dispatch(
			addGoalAction({
				id: generateId(),
				name
			})
		);
	}
};

let toggleTodo = (e) => {
	if (e.target.className === 'addedTodoItem') {
		let id = e.target.id;
		store.dispatch(toggleTodoAction(id)); //this dispatch toggle completion state of todo item
		let itemToToggle = store.getState().todos.filter((todo) => todo.id === id);
		let completionTest = itemToToggle[0].complete;

		if (completionTest) {
			e.target.style.textDecoration = 'line-through';
		} else {
			e.target.style.textDecoration = 'none';
		}
	}
};

let toggleGoal = (e) => {
	if (e.target.className === 'addedGoalItem') {
		console.log('you clicked');
		e.target.style.textDecoration = 'line-through';
	}
};
document.getElementById('todoBtn').addEventListener('click', addTodo);

document.getElementById('goalBtn').addEventListener('click', addGoal);

document.getElementById('todos').addEventListener('click', toggleTodo);

// store.dispatch(addTodoAction({
// 	id: 0,
// 	name: 'Walk the dog',
// 	complete: false,
// }))

// store.dispatch(addTodoAction({
// 	id: 1,
// 	name: 'Wash the car',
// 	complete: false,
// }))

// store.dispatch(addTodoAction({
// 	id: 2,
// 	name: 'Go to the gym',
// 	complete: true,
// }))

// store.dispatch(removeTodoAction(1))

// store.dispatch(toggleTodoAction(0))

// store.dispatch(addGoalAction({
// 	id: 0,
// 	name: 'Learn Redux'
// }))

// store.dispatch(addGoalAction({
// 	id: 1,
// 	name: 'Lose 20 pounds'
// }))

// store.dispatch(removeGoalAction(0))
