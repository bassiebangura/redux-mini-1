//what Library Code will look like

// function CreateStore(reducer) {
// 	let state; //initial state is undefined

// 	let listeners = []; //stores listeners that listen for change in state and called when state changes;

// 	const getState = () => state; //returns current state in store

// 	const subscribe = (listener) => {
// 		//add listeners and also returns a function,
// 		//that can be used to unsubscribe that listener
// 		listeners.push(listener);
// 		return () => {
// 			listeners = listeners.filter((l) => l !== listener);
// 		};
// 	};

// 	const dispatch = (action) => {
// 		//dispatch an action by making the required update
// 		//to state using the reducer passed when store was created.
// 		state = reducer(state, action);
// 		listeners.forEach((listener) => listener());
// 	};

// 	return {
// 		getState,
// 		subscribe,
// 		dispatch
// 	};
// }

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

// function app(state = {}, action) {
// 	return {
// 		todos: todos(state.todos, action),
// 		goals: goals(state.goals, action)
// 	};
// }

let checker = (store) => (next) => (action) => {
	if (
		action.type === ADD_TODO && 
		action.todo.name.toLowerCase().includes("bitcoin")
		)  return alert("Nope! Bad Idea");
			
	if (
		action.type === ADD_GOAL && 
		action.goal.name.toLowerCase().includes("bitcoin")
		)  return alert("Nope! Bad Idea");

		return next(action)
}
const logger = (store) => (next) => (action) => {
	console.group(action.type)
		console.log("The action:", action)
		const result = next(action)
	console.log("The new state:", store.getState())
	console.groupEnd()
	return result
}
// function checker (store) {
// 	return function(next) {
// 		return function (action){
			
// 				}
// 			}
// 	}
const store = Redux.createStore(Redux.combineReducers({
	todos,
	goals,
}), Redux.applyMiddleware(checker, logger));

store.subscribe(() => {
	// console.log('The new state is: ', store.getState());
	const { todos, goals } = store.getState();

	//resets part of UI that can change when an event occurs
	document.getElementById('todos').innerHTML = '';
	document.getElementById('goals').innerHTML = '';

	todos.forEach(addTodoToDOM);
	goals.forEach(addGoalToDOM);
});
let addTodo = () => {
	let input = document.getElementById('todo');
	let name = input.value;
	input.value = '';

	store.dispatch(
		addTodoAction({
			id: generateId(),
			name
		})
	);
};

let createRemoveBtn = (onClick) => {
	//creates and return btn with event listener attached to it
	//and the callback is passed when fxn is called
	let removeBtn = document.createElement('button');
	removeBtn.innerHTML = 'x';
	removeBtn.addEventListener('click', onClick);
	return removeBtn;
};
let addTodoToDOM = (todo) => {
	//subscribe this fxn to store as listener, is called when state changes

	let removeBtn = createRemoveBtn(() => {
		store.dispatch(removeTodoAction(todo.id));
	});

	const node = document.createElement('li');
	const text = document.createTextNode(todo.name);
	node.appendChild(text);
	node.appendChild(removeBtn);
	node.style.textDecoration = todo.complete ? 'line-through' : 'none';

	node.addEventListener('click', () => {
		document.getElementById('goals').innerHTML = '';
		document.getElementById('todos').innerHTML = '';
		store.dispatch(toggleTodoAction(todo.id));
	});

	document.getElementById('todos').appendChild(node);
};
let addGoal = () => {
	let input = document.getElementById('goal');
	let name = input.value;
	input.value = '';

	store.dispatch(
		addGoalAction({
			id: generateId(),
			name
		})
	);
};
let addGoalToDOM = (goal) => {
	//subscribe this fxn to store as listener, is called when state changes
	let removeBtn = createRemoveBtn(() => {
		store.dispatch(removeGoalAction(goal.id));
	});
	const node = document.createElement('li');
	const text = document.createTextNode(goal.name);
	node.appendChild(text);
	node.appendChild(removeBtn);

	document.getElementById('goals').appendChild(node);
};

document.getElementById('todoBtn').addEventListener('click', addTodo);
document.getElementById('goalBtn').addEventListener('click', addGoal);
