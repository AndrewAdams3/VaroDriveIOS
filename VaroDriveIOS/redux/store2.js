import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

//
// Initial State...
//

const initialState = {
  email: "",
  password: "",
  fName: "",
  lName: "",
  city: "",
  state: "",
  address: "",
  profilePic: "",
  isLoggedIn: false,
  userId: '',
  returner: false,
  onClock: false,
  location: '',
  isVerified: false
};

//
// Reducer...
//

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOG_OUT":
      return initialState;
    case "setFName":
      return { ...state, fName: action.value };  
    case "setLName":
      return { ...state, lName: action.value };  
    case "setCity":
      return { ...state, city: action.value };  
    case "setState":
      return { ...state, state: action.value };  
    case "setAddress":
      return { ...state, address: action.value };  
    case "setPic":
      return { ...state, profilePic: action.value };
    case "setEmail":
      return { ...state, email: action.value };
    case "setPassword":
      return { ...state, password: action.value };
    case "isLoggedIn":
      return {...state, isLoggedIn: action.value};
    case "setID":
      return {...state, userId: action.value};
    case "setOnClock":
      return { ...state, onClock: action.value };
    case "setLocation":
      return { ...state, location: action.value };
    case "setVerified":
      return { ...state, isVerified: action.value };
    default:
      return state;
  }
};

//
// Store...
//

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export { store };

//
// Action Creators...
//
const setVerified = (verified) => {
  return {
    type: 'setVerified',
    value: verified
  }
}
const LOG_OUT = () => {
    return {
      type: 'LOG_OUT',
    }
}
const setFName = (name) => {
  return {
    type: 'setFName',
    value: name
  }
}
const setLName = (name) => {
  return {
    type: "setLName",
    value: name,
  };
}
const setCity = (city) => {
  return {
    type: 'setCity',
    value: city
  }
}
const setState = (state) => {
  return {
    type: 'setState',
    value: state
  }
}
const setAddress = (address) => {
  return {
    type: 'setAddress',
    value: address
  }
}
const setPic = (pic) => {
  return {
    type: "setPic",
    value: pic,
  };
}
const setLocation = (loc) => {
  return {
    type: "setLocation",
    value: loc,
  };
}
const setOnClock = (onclock) => {
  return {
    type: "setOnClock",
    value: onclock,
  };
}
const setEmail = (email) => {
  return {
    type: "setEmail",
    value: email,
  };
}
const setPassword = (password) => {
  return {
    type: "setPassword",
    value: password
  };
}
const isLoggedIn = (val) => {
  return {
    type: "isLoggedIn",
    value: val
  };
}
const setID = (id) => {
  return {
    type: "setID",
    value: id
  };
}

export { 
  setVerified, LOG_OUT, 
  setPassword, setFName, 
  setLName, setEmail, 
  isLoggedIn, setID, 
  setOnClock, setLocation,
  setPic, setCity, setState,
  setAddress 
};