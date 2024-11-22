import React, { useEffect, useState,useContext } from 'react'
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardText } from 'reactstrap'
import { isLoggedIn,CurrentUser } from '../auth';

import userContext from "../context/userContext";

function Posts( { post = { Title: "This is Default Post Title", Content: "This is Default Content" } ,DoDeletePost}) {

    const useContextData=useContext(userContext);
    
  const[login,setLogin]=useState(false);
  const[user,setUser]=useState(undefined);

useEffect(()=>
  {
    setLogin(isLoggedIn())
    setUser(CurrentUser())
    console.log('a user',user);
    console.log('b login',login);
  },[login]
  );


  return (
    <Card className='border-0 shadow-sm mb-3'>
      <CardBody>
          <Link to="/">Home</Link> /(<Link to=""> {post.CategoryName}</Link>)
 <CardText>
  Posted By <b style={{color:'Green'}}>{post.name}</b> on <b style={{color:'Orange'}} >{new Date(post?.Doe)?.toLocaleDateString()}</b>
</CardText>
        <h4>{post.Title}</h4>
      
        {/* <CardText>{post.Content}</CardText> */}
  <CardText dangerouslySetInnerHTML={{ __html:post?.Content?.substring(0,60)+'..'}}>
    {/* {post.Content.substring(0,30)}... */}
    </CardText>
        <div>
          <Link style={{ height: '19px ',width: '76px ',padding: '0px ', fontSize:'11px',color:'Yellow'}} className='btn btn-secondary border -0' to={'/Post/'+post.Id} >Read More..</Link>

{/* we will show delete button when user is loggedIn else will not show */}
{/* {login && user.Id==post.userId?
<Button onClick={()=>DoDeletePost(post)} color='danger'  className='ms-2' style={{ height: '19px ',width: '76px ',padding: '0px ', fontSize:'11px',color:'Yellow'}}>Delete</Button> :''
} */}


{useContextData.user.login && user.Id==post.userId?
<Button onClick={()=>DoDeletePost(post)} color='danger'  className='ms-2' style={{ height: '19px ',width: '76px ',padding: '0px ', fontSize:'11px',color:'Yellow'}}>Delete</Button> :''
}


        </div>



      </CardBody>
    </Card>
  );
}

export default Posts;
