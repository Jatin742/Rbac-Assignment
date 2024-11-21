import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../../Components/Loader/Loader';
import "../../../Components/CreateEvent/CreateEvent.css";
import { clearErrors, getEventDetails, updateEvent } from '../../../Actions/eventAction';
import { UPDATE_EVENT_RESET } from '../../../Constants/eventConstant';
import { app } from '../../../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable, deleteObject } from "firebase/storage";

const UpdateEvent = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const { loading, error: updateError, isUpdated } = useSelector((state) => state.event);
    const { error, event } = useSelector((state) => state.eventDetails);

    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [oldImage, setOldImage] = useState();

    const [image, setImage] = useState();
    const [imagePreview, setImagePreview] = useState();

    const { id } = useParams();

    useEffect(() => {
        if (event && event._id !== id) {
            dispatch(getEventDetails(id));
        }
        else {
            setTitle(event.title);
            setDescription(event.description);
            setOldImage(event.image);
        }
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors());
        }
        if (isUpdated) {
            alert.success("Event Updated Successfully")
            navigate("/admin/all-events")
            dispatch({ type: UPDATE_EVENT_RESET });
        }
    }, [dispatch, alert, error, isUpdated, navigate, event, id, updateError])

    const updateEventSubmitHandler = (e) => {
        e.preventDefault();
        const storage = getStorage(app);
        if (image) {
            
            const oldImagePath = oldImage.split('/o/')[1].split('?')[0];
            const decodedPath = decodeURIComponent(oldImagePath);
            const oldImageRef = ref(storage, decodedPath);

            deleteObject(oldImageRef)
                .then(() => {
                    console.log("Old image deleted successfully");
                })
                .catch((error) => {
                    alert.error("Failed to delete old image");
                });
        }

        if (image) {
            const fileName = new Date().getTime() + "-" + image.name;
            const storageRef = ref(storage, `events/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, image);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (error) => {
                    alert.error("Image upload failed");
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    const myForm = new FormData();
                    myForm.set('title', title);
                    myForm.set('description', description);
                    myForm.set('image', downloadURL);

                    dispatch(updateEvent(id, myForm));
                }
            );
        } else {
            const myForm = new FormData();
            myForm.set('title', title);
            myForm.set('description', description);

            dispatch(updateEvent(myForm));
        }
    };

    const updateEventImagesChange = (e) => {
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
    }
    return (
        <Fragment>{loading ? <Loader /> :
            <Fragment>
                <div className='dashboard'>
                    <div className="newEventContainer">
                        <form
                            className='createEventForm'
                            encType='multipart/form-data'
                            onSubmit={updateEventSubmitHandler}
                        >
                            <h1>Update Event</h1>
                            <div>
                                <input
                                    type="text"
                                    placeholder='Event Name'
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
                                    onChange={updateEventImagesChange}
                                />
                            </div>
                            <div id="createEventFormImage">
                                <img src={oldImage} alt="Old Event Preview" />
                            </div>
                            <div id="createEventFormImage">
                                {imagePreview && <div id="createEventFormImage">
                                    <img src={imagePreview} alt="Avatar Preview" />
                                </div>}
                            </div>
                            <button
                                id="createEventBtn"
                                type='submit'
                                disabled={loading ? true : false}
                            >
                                Update
                            </button>
                        </form>
                    </div>
                </div>

            </Fragment>
        }
        </Fragment>
    )
}

export default UpdateEvent