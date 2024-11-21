import { myAxious, privateAxious } from "./helper";

export const createPost=(postData)=>{
  console.log('the posted data' + postData);
  return privateAxious.post('/api/ReactJsApis/PostContentDetails',postData).then((response)=>response.data);
}
 
//get all posts
//All get posts apis are public so use "myaxios" instead of privateAxious

export const loadAllPosts=()=>{
  return myAxious.get('/api/ReactJsApis/getAllposts').then(response=>response.data); 
}

//get posts by pagenumber and pazesize


export const loadAllPostsByPageNumberandPageSize=(PageNumberInput,PageSizeInput)=>{
  return myAxious.get(`/api/ReactJsApis/getpostsByPageNumberAndPageSize?PageNumberInput=${PageNumberInput}&PageSizeInput=${PageSizeInput}`).then(response=>response.data); 
}

//Note :- if we use parameters given below:-
//  (`/api/ReactJsApis/getpostsByPageNumberAndPageSize?PageNumberInput=${PageNumberInput}&PageSizeInput=${PageSizeInput}`).
//then we will use `` but if we are using simple api then you can also use ''


//
//get posts by Id 

export const loadPostsById=(Id)=>{
  return myAxious.get(`/api/ReactJsApis/getpostById?Id=${Id}`).then(response=>response.data); 
}

//Insert Comments

export const createCommentPost=(postData)=>{
  console.log('the comment posted data' + postData);
  return privateAxious.post('/api/ReactJsApis/PostComments',postData).then((response)=>response.data);
}


////get Comments by Content Id 

export const loadCommentsByContentId=(Id)=>{
  return myAxious.get(`/api/ReactJsApis/getComments?Id=${Id}`).then(response=>response.data); 
}


//upload post banner images

export const uploadPostImage = (image, postId) => {
  let formData = new FormData();
  formData.append("image", image); // Ensure the parameter name matches what your API expects
  console.log('formData',formData);
  return privateAxious.post(`/api/ReactJsApis/UploadImage?Id=${postId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((response) => response.data);
};


//get posts by pagenumber and pazesize and CategoryId

export const loadAllPostsByPageNumberandPageSizeAndCategoryId=(PageNumberInput,PageSizeInput,Id)=>{
  return myAxious.get(`/api/ReactJsApis/getpostsByPageNumberAndPageSizeAndCategorywise?PageNumberInput=${PageNumberInput}&PageSizeInput=${PageSizeInput}&Id=${Id}`).then(response=>response.data); 
}

//get posts by pagenumber and pazesize and userId

export const loadAllPostsByuserId=(PageNumberInput,PageSizeInput,userId)=>{
  return myAxious.get(`/api/ReactJsApis/getPostsByUserId?PageNumberInput=${PageNumberInput}&PageSizeInput=${PageSizeInput}&userId=${userId}`).then(response=>response.data); 
}

//