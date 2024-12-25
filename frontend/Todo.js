import {useState, useEffect} from "react"
export default function Todo()
{
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");
    const [todos,setTodos]=useState([]);
    const [error,setError]=useState("");
    const [message,setMessage]=useState("");
    const [editId,setEditid]=useState(-1);//brings boxes for title and desc when edit button is pressed

    //for edit
    const [editTitle,setEditTitle]=useState("");
    const [editdescription,setEditDescription]=useState("");

    const apiurl="http://localhost:8000"
    const handleSubmit=()=>{
        setError("")
        if(title.trim()!=="" && description.trim()!==""){
            //additem to list
            fetch(apiurl+"/todos",{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({title,description})//cannot directly use js obj so stringify is used
            }).then((res)=>{  //this is a promise
                if(res.ok){//iff 'ok' status add item
                    //add items to list
                    setTodos([...todos,{title,description}])
                    setTitle("")
                    setDescription("")
                    setMessage("Item added successfully!!")
                    //the above message will always be there after inserting one element to avoid that we can use timeout function that clears that message after some time
                    setTimeout(()=>
                    {
                        setMessage("");
                    },3000);
                }
                else{
                    setError("Unable to create Todo item")
                }   
            }).catch(()=>{
                setError("Unable to create Todo item")
            })
        }
    }

//to getitem
    useEffect(()=>{
        getItems()
    },[]) //called once when page is refreshed

    //to get todo items
    const getItems=()=>{
        fetch(apiurl+"/todos")
        .then((res)=>res.json())
        .then((res)=>{
            setTodos(res)
        })
    }

    const handleUpdate=()=>{
        
        setError("")
        if(editTitle.trim()!=="" && editdescription.trim()!==""){
            //additem to list
            fetch(apiurl+"/todos/"+editId,{
                method:"PUT",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({title:editTitle,description:editdescription})//cannot directly use js obj so stringify is used
            }).then((res)=>{  //this is a promise
                if(res.ok){//iff 'ok' status add item
                    //update items to list
                   const updatedTodos= todos.map((item)=>{
                        if(item._id===editId){
                            item.title=editTitle;
                            item.description=editdescription;
                        }
                        return item;
                    }
                    )

                    setTodos(updatedTodos)
                    setEditTitle("")
                    setEditDescription("")
                    setMessage("Item updated successfully!!")
                    //the above message will always be there after inserting one element to avoid that we can use timeout function that clears that message after some time
                    setTimeout(()=>
                    {
                        setMessage("");
                    },3000)
                    setEditid(-1)
                }
                else{
                    setError("Unable to create Todo item")
                }   
            }).catch(()=>{
                setError("Unable to create Todo item")
            })
        }
    }
    const handleEditCancel=()=>{
        setEditid(-1)
    }
    const handleEdit=(item)=>{
        setEditid(item._id);
         setEditTitle(item.title);
          setEditDescription(item.description)
    }
    const handleDelete=(id)=>{
        if(window.confirm("Are u sure want to delete???")){
            fetch(apiurl+'/todos/'+id,{
                method:"DELETE"
            })
            .then(()=>{
                const updatedTodos=todos.filter((item)=>item._id!==id)
                setTodos(updatedTodos)
            })
        }
    }
    return<>
    <div className="row p-3 bg-success text-light">
        <h1>TO DO LIST WITH MERN STACK</h1>
        </div>
    <div className="row">
            <h3> Add item</h3>
            {message &&<p className="text-success">{message}</p>}
            <div className="form-group d-flex gap-2">
                <input className="form-control" onChange={(e)=>setTitle(e.target.value)} value={title} placeholder="Title" type="text"/>
                <input className="form-control"  onChange={(e)=>setDescription(e.target.value)} value={description} placeholder="Description" type="text"/> 
                <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
            </div>
        {/* if error is not empty then only next line executed */}
            {error && <p className="text-danger" >{error}</p>}     
    </div>

    <div className="row mt-3">
    <h3>Tasks</h3>
    <ul className="list-group">
        {
            todos.map((item)=> <li className="list-group-item d-flex align-items-center justify-content-between my-2">
            <div className="d-flex flex-column me-2">
                {
                    editId==-1 || editId!==item._id ? <>
                    <span className="fw-bold">{item.title}</span>
                    <span>{item.description}</span>
                    </>:<>
                    <div className="form-group d-flex gap-2">
                    <input className="form-control" onChange={(e)=>setEditTitle(e.target.value)} value={editTitle} placeholder="Title" type="text"/>
                    <input className="form-control"  onChange={(e)=>setEditDescription(e.target.value)} value={editdescription} placeholder="Description" type="text"/> 
                    </div>
                    </>

                }
            
            </div>
            <div className="d-flex gap-2">
                {/*id is stored as _id in db */}
            {editId==-1 || editId!==item._id ?<button className="btn btn-warning" onClick={()=>handleEdit(item)}>Edit</button>: <button className="btn btn-warning" onClick={handleUpdate}>Update</button>}
            {editId==-1 ?<button className="btn btn-danger" onClick={()=>handleDelete(item._id)}>Delete</button>:
            <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>}
            </div>
        </li>)
        }
       
    </ul>
    </div>
        </>
}