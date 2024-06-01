
import React from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Todo from '../src/Todo'; 

function App() { 
return ( 
	<div> 
	<BrowserRouter> 
		<Routes> 
		<Route path='/' element={<Todo/>}></Route> 
		</Routes> 
	</BrowserRouter> 
	</div> 
); 
} 

export default App;
