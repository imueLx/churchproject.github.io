import { initializeApp } from "firebase/app"
import {
  getFirestore, collection, onSnapshot,
  addDoc, deleteDoc, doc,
  query, where,
  orderBy, serverTimestamp,
  getDoc,
  updateDoc
} from 'firebase/firestore'

import { 
  getStorage, ref , 
  uploadBytes, getDownloadURL, 
  uploadBytesResumable } 
from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyAsfmSSfnWzwq-aLjdnXO8IDmYA6fUShoU",
    authDomain: "npm-test-6e462.firebaseapp.com",
    projectId: "npm-test-6e462",
    storageBucket: "npm-test-6e462.appspot.com",
    messagingSenderId: "457267373010",
    appId: "1:457267373010:web:bc80805b6e218a3439de0b"
  };

  initializeApp(firebaseConfig)
  

  const db = getFirestore()
  
  //collection reference
  const colRef = collection(db, 'posts')

  //query
  //const q = query(colRef, orderBy('createdAt','asc'))

  // Real time get data
  

// upload click
const addPostForm = document.querySelector('.add')
addPostForm.addEventListener('submit', (e) => {
  e.preventDefault()

    var file = document.getElementById('input').files[0]
    var filename =  file.name
    var text = document.getElementById('comment').value 

    var metadata = {
      contentType: file.type
  }
  const storage = getStorage();
  const storageRef = ref(storage, filename);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    
                    switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    }
                }, 
                (error) => {
                    // Handle unsuccessful uploads
                    console.log('Error uploading')
                }, 
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {  
                    console.log('File available at', downloadURL);
                    addDoc(colRef, {
                      comment: text,
                      imgLink: text,
                      createdAt: serverTimestamp()
                    })
                    .then(() => {
                      addPostForm.reset()
                      
                    })
                    alert("Upload Successful")
                    document.getElementById('display').src = downloadURL;
                    
                    });
                }
            );
            
        });//end of upload function


// adding docs func
  
  

// deleting docs
const deletePostForm = document.querySelector('.delete')
deletePostForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'posts', deletePostForm.id.value)

  deleteDoc(docRef)
    .then(() => {
      deletePostForm.reset()
    })
})

// updating a document
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
  e.preventDefault()

  let docRef = doc(db, 'posts', updateForm.id.value)

  var text = document.getElementById("comment").value

  updateDoc(docRef, {
    comment: text
  })
  .then(() => {
    updateForm.reset()
  })
})