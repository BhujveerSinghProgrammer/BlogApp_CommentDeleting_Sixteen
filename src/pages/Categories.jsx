import React, { useEffect, useState } from 'react';
import Base from '../components/Base';
import { useParams } from 'react-router-dom';
import { Col, Container, Row } from "reactstrap";
import CategorySideMenu from "../components/CategorySideMenu";
import { loadAllPostsByPageNumberandPageSizeAndCategoryId,DeletePost } from '../services/post-service';
import { toast } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroll-component';
import Posts from '../components/Posts';

function Categories() {
  const { Id } = useParams(); // Get the 'Id' from the URL params

  const [postContent, setPostContent] = useState({
    Contents: [],
    LastPage: 0,
    PageNumber: 1,  // Start at page 1
    PageSize: 10,   // Default page size
    TotalElements: 0,
    TotalPages: 0
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Effect to fetch paged posts when the page or Id changes
  useEffect(() => {
    // Reset the page number to 1 when category Id changes
    setCurrentPage(1);
  }, [Id]);

  // Fetch posts when currentPage or Id changes
  useEffect(() => {
    console.log('Fetching data for Category Id:', Id, 'Page:', currentPage);
    changePage(currentPage); // Trigger page change based on currentPage
  }, [currentPage, Id]); // Add Id to the dependency array

  // Handle page change
  const changePage = (pageNumber) => {
    console.log('Requesting page:', pageNumber);

    // Skip if the page number exceeds TotalPages (unless TotalPages is 0)
    if (postContent.TotalPages > 0 && pageNumber > postContent.TotalPages) {
      console.log('No more pages available.');
      return;
    }

    loadAllPostsByPageNumberandPageSizeAndCategoryId(pageNumber, postContent.PageSize, Id)
      .then((data) => {
        console.log('Data received:', data);

        // Handle if the data is unsuccessful
        if (data.success === false) {
          setPostContent({
            Contents: [],
            LastPage: 0,
            PageNumber: 1,
            PageSize: 10,
            TotalElements: 0,
            TotalPages: 0
          });
          console.log('No posts found for this category.');
          return;
        }

        // Update the content state with fetched data
        setPostContent((prevState) => ({
          Contents: pageNumber === 1 ? data?.Contents : [...prevState?.Contents, ...data?.Contents],
          LastPage: data.LastPage,
          PageNumber: data.PageNumber,
          PageSize: data.PageSize,
          TotalElements: data.TotalElements,
          TotalPages: data.TotalPages
        }));
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        toast.error('Error in loading posts. Please try again later.');
      });
  };

  // Increment the current page to load the next page of content
  const changePageInfinite = () => {
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
    <Base>
      <Container className="mt-3">
        <Row>
          <Col md={2} className="pt-3"><CategorySideMenu /></Col>
          <Col md={10}>
            <div className="container-fluid">
              <Row>
                <Col md={{ size: 12 }}>
                  {/* <h3>Blogs Count ({postContent?.Contents?.length})</h3> */}
          <h3 style={{color:'green',fontSize:'18px'}} >Blogs Count ({postContent?.Contents?.length?postContent?.Contents?.length:0})</h3>
                  {postContent.Contents.length === 0 ? (
                    // If there are no posts in the content array
                    <p>No posts found for this category.</p>
                  ) : (
                    <InfiniteScroll
                      dataLength={postContent?.Contents.length}
                      next={changePageInfinite}
                      hasMore={postContent?.PageNumber < postContent?.TotalPages || postContent?.TotalPages === 0}
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
                  )}
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </Base>
  );
}

export default Categories;
