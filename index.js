//what Library Code will look like
function CreateStore(reducer) {
	let state;

	let listeners = [];

	const getState = () => state;

	const subscribe = listener => {
		listeners.push(listener);
		return () => {
			listeners = listeners.filter(l => l !== listener);
		};
	};

	const dispatch = action => {
		state = reducer(state, action);
		listeners.forEach(listener => listener());
	};

	return {
		getState,
		subscribe,
		dispatch
	};
}

const store = createStore();

const unscribe = store.subscribe(() => {
	console.log("Hello Everybody");
});

//What actual developer code will look like
function appReducer(state = [], action) {
	if (action.type === "ADD_TODO") {
		return [...state, action.payload];
	} else {
		return state;
	}
}

//Actual developer code creating store and passing reducer needed by library code.
const store = CreateStore(appReducer);
