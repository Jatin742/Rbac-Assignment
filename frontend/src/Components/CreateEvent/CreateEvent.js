import React, { Fragment, useEffect, useState } from 'react';
import "./CreateEvent.css";
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, createEvent } from '../../Actions/eventAction';
import { NEW_EVENT_RESET } from '../../Constants/eventConstant';
import { useNavigate } from 'react-router-dom';
import {app} from '../../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useAlert } from 'react-alert';

const CreateEvent = () => {
    const dispatch = useDispatch();

    const { loading, error, success } = useSelector((state) => state.newEvent);

    const navigate = useNavigate();
    const alert = useAlert();
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState();
    const [imagePreview, setImagePreview] = useState();

    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
        }
        if (success) {
            alert.success("Event Created");
            navigate("/admin/all-events");
            dispatch({ type: NEW_EVENT_RESET });
        }
    }, [dispatch, error, success, navigate])
    const createEventSubmitHandler = (e) => {
        e.preventDefault();
        
        const fileName = new Date().getTime()+"-"+image.name;
        
        const storage = getStorage(app);
        const storageRef = ref(storage, `events/${fileName}`);
        
        const uploadTask = uploadBytesResumable(storageRef, image);
        
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                console.error("Image upload failed: ", error);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                
                const myForm = new FormData();
                myForm.set('title', title);
                myForm.set('description', description);
                myForm.set('image', downloadURL); 
    
                console.log("Form data to be sent:", myForm);
                
                dispatch(createEvent(myForm));
            }
        );
    };
    

    const createEventImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagePreview(reader.result);
                }
            };
    
            reader.readAsDataURL(file);
        }
    };
    
    
    return (
        <Fragment>
            <div className='dashboard'>
                <div className="newEventContainer">
                    <form
                        className='createEventForm'
                        encType='multipart/form-data'
                        onSubmit={createEventSubmitHandler}
                    >
                        <h1>Create Event</h1>
                        <div>
                            <input
                                type="text"
                                placeholder='Event Title'
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)} />
                        </div>

                        <div>
                            <textarea
                                placeholder='Event Description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                cols="30"
                                rows="1"></textarea>
                        </div>
                        <div id="createEventFormFile">
                            <input
                                type="file"
                                name='avatar'
                                accept='image/*'
                                onChange={createEventImageChange}
                            />
                        </div>
                        {imagePreview && <div id="createEventFormImage">
                            <img src={imagePreview} alt="Avatar Preview" />
                        </div>}
                        <input
                            id="createEventBtn"
                            type='submit'
                            value="Create"
                            onClick={createEventSubmitHandler}
                            disabled={loading ? true : false}
                        />
                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default CreateEvent