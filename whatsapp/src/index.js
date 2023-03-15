//#region imports

//#region hooks
import { createRoot } from 'react-dom/client';
//#endregion

//#region components
import App from './App';
//#endregion

import './index.css';
//#endregion

const root = createRoot(document.getElementById('root'));

root.render(
  <App />
);

//?#region how to order

/*
*each element
!<element key id ref className styling-attributs style events />


*conditional rendering
! {statement operator (
!   return element
! )}


*code and region it
&  jsx element

!    #variabels:
!      #hooks- what the hook name: useState
!      #regular:
!        let
!        const
!        var

!    #functions:
!      #regular functions
!      #arrow functions

!    #hooks- what the hook name: useEffect

&  end jsx element
*/

//#endregion