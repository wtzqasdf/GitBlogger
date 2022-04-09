import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
// Views
import Install from './views/Install';
import Home from './views/Home';
import Login from './views/Login';
import View from './views/View';
import M_Articles from './views/M_Articles';
import M_New from './views/M_New';
import M_Edit from './views/M_Edit';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path='/' element={<Home></Home>}></Route>
      <Route path='/view' element={<View></View>}></Route>
      <Route path='/login' element={<Login></Login>}></Route>
      <Route path='/install' element={<Install></Install>}></Route>
      <Route path='/m_articles' element={<M_Articles></M_Articles>}></Route>
      <Route path='/m_edit' element={<M_Edit></M_Edit>}></Route>
      <Route path='/m_new' element={<M_New></M_New>}></Route>
    </Routes>
  </Router>,
  document.getElementById('root')
);