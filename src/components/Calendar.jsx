import React, { Fragment, useReducer } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import useCalendar from '../hooks/useCalendar';


const initialForm = {
  id : "",
  titre : "",
  commentaire : "",
  date_rdv : "",
  rdv : []
}

function reducerForm(state, action) {
  switch(action.type){
    case "titre" :
      return {...state, titre : action.payload}
    case "commentaire" :
      return {...state, commentaire : action.payload}
    case "date_rdv" :
      return {...state, date_rdv : action.payload}
    case "GET_RDV" :
      return {...state, rdv : action.payload}
    case "DELETE_RDV" :
      return {...state, rdv : state.rdv.filter(rdv => rdv.id !== action.payload )}
    case "REMPLIR_FORM":
      return {...state,
              titre : action.payload.rdv.titre,
              commentaire : action.payload.rdv.commentaire,
              date_rdv : action.payload.rdv.date_rdv,
              id : action.payload.id

            }
    default :
            return state;
    
    } 
}

const Calendar = () => {
  const { calendarRows, selectedDate, todayFormatted, daysShort, monthNames, getNextMonth, getPrevMonth ,getPrevYear ,getNextYear} = useCalendar();

  
  const dateClickHandler = date => {
    console.log(date);
  
  }


  const [form, dispatch] = useReducer( reducerForm, initialForm)

  function onSubmit(e) {
    e.preventDefault();
    const data = {
      titre : form.titre,
      commentaire : form.commentaire,
      date_rdv : form.date_rdv
    }
    if(form.id === ""){
      axios.post("http://localhost:3002/rdv", data)
    }else {
      axios.put(`http://localhost:3002/rdv/${form.id}`, data)
    }
  }
  

  useEffect( ()=> {
    axios.get(`http://localhost:3002/rdv`).then(({data}) => dispatch({type:"GET_RDV", payload : data}))
  } , [])

  const onDelete = (id) => {
    axios.delete(`http://localhost:3002/rdv/${id}`).then(({data}) =>
    dispatch({type : "DELETE_RDV", payload : id})
    )
  }

  return(
    <Fragment>
      
      
      <p style={{fontSize: "28px"}}> <button className="button" style={{marginRight: "60px"}} onClick={getPrevMonth}> ⬅️ </button>{`${monthNames[selectedDate.getMonth()]}`}<button className="button" style={{marginLeft: "60px"}}  onClick={getNextMonth}>➡️</button></p>
      
      <p style={{fontSize: "28px"}}> <button className="button" style={{marginRight: "60px"}} onClick={getPrevYear}> ⬅️ </button>{`${selectedDate.getFullYear()}`}<button className="button" style={{marginLeft: "60px"}}  onClick={getNextYear}>➡️</button></p>
      
      <table className="table">
        <thead>
          <tr>
            {daysShort.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {
            Object.values(calendarRows).map(cols => {
              return <tr key={cols[0].date}>
                {cols.map(col => (
                  col.date === todayFormatted
                    ? <td key={col.date} id={col.date} className={`${col.classes} today`} onClick={() => dateClickHandler(col.date)}>
                      {col.value}
                    </td>
                    : <td key={col.date} id={col.date} className={col.classes} onClick={() => dateClickHandler(col.date)}>{col.value}</td>
                ))}
              </tr>
            })
          }
        </tbody>
      </table>

      <>
      <form onSubmit={onSubmit}>
          <input type="hidden" value={form.id}/>
          <input type="text" placeholder="le titre" className='form-control' value={form.titre} onChange={(e) => dispatch({type : "titre", payload : e.target.value})}/><br/><br/>
          <textarea type="text" placeholder="le commentaire" className='form-control' value={form.commentaire} onChange={(e) => dispatch({type : "commentaire", payload : e.target.value})}></textarea><br/><br/>
          <input type="date" id="date" placeholder="dd-mm-yyyy"  className='form-control' value={form.date_rdv} onChange={(e) => dispatch({type : "date_rdv", payload : e.target.value})}/><br/><br />
          <input type="submit" className="btn btn-outline-sucess"/>
      </form> 
      
      {form.rdv.map((rdv,index) =>{
        return <article key={index}>
          <h3>{rdv.titre} <span>{rdv.date_rdv}</span></h3>
          <p>{rdv.commentaire}</p>
          

        </article>
      })}
      </>
    </Fragment>
  );
}

export default Calendar;