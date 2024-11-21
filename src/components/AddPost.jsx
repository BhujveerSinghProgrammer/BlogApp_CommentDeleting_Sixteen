import { Card, CardBody, Input, Form, Label, Container, Button } from "reactstrap";
import { loadAllCategories } from "../services/category-service";
import { useEffect, useState, useRef } from "react";
import JoditEditor from "jodit-react";
import { CurrentUser } from '../auth';
import { createPost as doCreatePost, uploadPostImage } from "../services/post-service";
import { toast } from "react-toastify";

const AddPost = () => {
  const editor = useRef(null);

  const [post, setPost] = useState({
    title: "",
    content: "",
    categoryid: ""
  });

  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(undefined);
  const [image, setImage] = useState(null);

  // Load categories and user information
  useEffect(() => {
    setUser(CurrentUser());
    loadAllCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const fieldChanged = (event) => {
    setPost({
      ...post,
      [event.target.name]: event.target.value,
    });
  };

  // Reset form data
  const resetData = () => {
    setPost({
      title: "",
      content: "",
      categoryid: ""
    });
  };

  // Handle content editor changes
  const contentFieldChanged = (newContent) => {
    setPost({ ...post, content: newContent });
  };

  // Handle file change for the image
  const handleFileChange = (event) => {
    console.log(event.target.files[0]);
    setImage(event.target.files[0]);
  };

  // Create post function
  const createPost = (event) => {
    event.preventDefault();

    // Form validation
    if (post.title.trim() === '') {
      alert('Title is required!');
      return;
    }
    if (post.content.trim() === '') {
      alert('Content is required!');
      return;
    }
    if (post.categoryid === '') {
      alert('Select a category!');
      return;
    }
    if (!image) {
      alert('Please select an image!');
      return;
    }

    // Add user ID to post object
    post['userId'] = user.Id;

    // Submit the post form
    doCreatePost(post)
      .then(data => {
        console.log('Post created successfully', data);
        
        // Upload the image after post creation
        uploadPostImage(image, data.postId)
          .then(() => {
            toast.success("Image uploaded successfully!");
          })
          .catch((error) => {
            toast.error("Image upload failed!");
          });

        toast.success(data.mgs); // Show success message for post creation

        // Reset the form
        setPost({
          title: "",
          content: "",
          categoryid: ""
        });
      })
      .catch((error) => {
        toast.error("Post creation failed!");
      });
  };

  return (
    <div className="wrapper my-3">
      <Card className="shadow mt-3">
        <CardBody>
          <h3>What's going on in your mind?</h3>
          <Form onSubmit={createPost}>
            <div className="my-3">
              <Label for="title">Post Title</Label>
              <Input
                type="text"
                id="title"
                placeholder="Enter Here"
                className="rounded-0"
                name="title"
                onChange={fieldChanged}
                value={post.title}
              />
            </div>

            <div className="my-3">
              <Label for="content">Post Content</Label>
              <JoditEditor
                ref={editor}
                value={post.content}
                tabIndex={1}
                onChange={contentFieldChanged}
              />
            </div>

            {/* File upload field */}
            <div className="mt-3">
              <Label for="image">Select Post Banner</Label>
              <Input
                id="image"
                type="file"
                onChange={handleFileChange}
              />
            </div>

            <div className="my-3">
              <Label for="category">Post Category</Label>
              <Input
                type="select"
                id="category"
                className="rounded-0"
                name="categoryid"
                onChange={fieldChanged}
                value={post.categoryid}
              >
                <option value="">Select a category</option> {/* Placeholder option */}
                {categories.map((category) => (
                  <option value={category.Id} key={category.Id}>
                    {category.CategoryName}
                  </option>
                ))}
              </Input>
            </div>

            <Container className="text-center">
              <Button type="submit" className="rounded-0" color="primary">
                Create Post
              </Button>
              <Button type="button" onClick={resetData} className="rounded-0 ms-2" color="danger">
                Reset
              </Button>
            </Container>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddPost;
