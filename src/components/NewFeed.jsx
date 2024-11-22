import React, { useState, useEffect } from 'react'; 
import { loadAllPostsByPageNumberandPageSize,DeletePost } from '../services/post-service';
import { Row, Col, Container } from 'reactstrap';
import Posts from './Posts';
import { toast } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroll-component';

function NewFeed() {
  const [postContent, setPostContent] = useState({
    Contents: [],
    LastPage: 0,
    PageNumber: 1,  // Start at page 1 (1-based)
    PageSize: 10,   // Default page size
    TotalElements: 0,
    TotalPages: 0
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Fetch paged posts when the page is first loaded or page changes
  useEffect(() => {
    changePage(currentPage);
  }, [currentPage]);

  // Handle page change
  const changePage = (pageNumber) => {
    // Skip if the page number exceeds TotalPages (unless TotalPages is 0 or undefined)
    //Note:- postContent.TotalPages is greater than 0 and "pageNumber" is greater than "postContent.TotalPages" then return the function,
    //Note:-if we want this "pageNumber > postContent.TotalPages" condition true and then return,then
    //we will use it with "postContent.TotalPages>0" condition becoz on initial load "TotalPages" will be zero.

    if (postContent.TotalPages > 0 && pageNumber > postContent.TotalPages) {
      return;
    }

    loadAllPostsByPageNumberandPageSize(pageNumber, postContent.PageSize)
      .then((data) => {
        console.log('data to ram ji', data);
        // Only append posts that are not already in Contents to avoid duplicates
        setPostContent((prevState) => ({
          Contents: pageNumber === 1 ? data.Contents : [...prevState.Contents, ...data.Contents],
          //if page ===1 then use "data.Contents" directly else use "[...prevState.Contents, ...data.Contents]" to append with existing data.  
          LastPage: data.LastPage,
          PageNumber: data.PageNumber,
          PageSize: data.PageSize,
          TotalElements: data.TotalElements,
          TotalPages: data.TotalPages
        }));
      })
      .catch((error) => {
        toast.error('Error in loading posts pagewise');
      });
  };

  const changePageInfinite = () => {
    // Increment the current page to load the next page of content

    if (currentPage < postContent.TotalPages || postContent.TotalPages === 0) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };


  //going to delete post


  //function to delete post
function DoDeletePost(post){
//going to delete post
 console.log(post);
 DeletePost(post)
      .then(data => {

         console.log('Post Deleted successfully', data);
         toast.success("Post Deleted successfully!");

         // changePage(1);
        // setCurrentPage(1);

         let newpostContent=postContent.Contents.filter(p=>p.Id!=post.Id)
         //we are passing p,coz using filter we will get one by one Id from "postContent.Contents",this will filter those Id's which are not belongs to "post.Id"
         setPostContent({...postContent,Contents:newpostContent})

         //Note:- This triggers a re-render of your component, because React re-renders when state changes.

      })
      .catch((error) => {
        toast.error("Post creation failed!");
      });
}



  return (
    <div className="container-fluid">
      <Row>
        <Col md={{ size: 12}}>
         {/* <h3>Blogs Count ({postContent?.Contents?.length})</h3> */}
             <h3 style={{color:'green',fontSize:'18px'}} >Blogs Count ({postContent?.Contents?.length?postContent?.Contents?.length:0})</h3>

          <InfiniteScroll
            dataLength={postContent?.Contents?.length}
            next={changePageInfinite}
            hasMore={postContent.PageNumber < postContent.TotalPages || postContent.TotalPages === 0}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
           >
            {postContent?.Contents?.map((post) => (
              <Posts post={post} key={post.Id} DoDeletePost={DoDeletePost} />
            ))}
          </InfiniteScroll>
        </Col>
      </Row>
    </div>
  );
}

export default NewFeed;
