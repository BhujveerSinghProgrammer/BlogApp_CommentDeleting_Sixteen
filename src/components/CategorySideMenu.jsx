import React from 'react'
import { loadAllCategories } from "../services/category-service";
import { useEffect, useState, useRef } from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import { Link } from 'react-router-dom';

function CategorySideMenu() {

  const [categories, setCategories] = useState([]);
    // Load categories and user information
  useEffect(() => {
    loadAllCategories()
      .then((data) => {
        setCategories([...data]);
        console.log('These are the categorioes',categories);
      })
      .catch((error) => {
        console.log(error);
        
      });
  }, []);

  return (
    <div>
       <ListGroup style={{marginBottom:'5px'}}>
        {/* action="true" means clickable */}
          <ListGroupItem tag={Link} to="/" action={true} className='border-0'>
                  All Blogs
          </ListGroupItem>


         {categories && categories.map((category)=>{
            return(
       <ListGroupItem className='border-0 shadow-0 mt-2' style={{marginTop:'2px',}}  action={true}  value={category.Id} key={category.Id} tag={Link}  to={'/categories/'+category.Id} >
                     {category.CategoryName}
       </ListGroupItem>
            )

        
          })} 

       </ListGroup>
       
    </div>
  )
}

export default CategorySideMenu
