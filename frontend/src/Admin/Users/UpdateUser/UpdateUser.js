import React, { Fragment, useEffect, useState } from 'react';
import "../../CreateUser/CreateUser.css";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { updateUser, clearErrors, getUserDetails } from '../../../Actions/adminAction';
import { UPDATE_USER_RESET } from '../../../Constants/adminConstant';

const UpdateUser = () => {
    const dispatch = useDispatch();

    const { loading, error, isUpdated } = useSelector((state) => state.adminUser);
    const {user} = useSelector((state) => state.userDetails);
    const alert=useAlert();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const {id} =useParams();


    useEffect(() => {
        if (user && user._id !== id) {
            dispatch(getUserDetails(id));
        }
        else {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }
        if (error) {
            dispatch(clearErrors());
        }
        if (isUpdated) {
            alert.success("User Updated");
            dispatch({ type: UPDATE_USER_RESET });
            navigate("/admin/all-users");
        }
    }, [dispatch, error, isUpdated, navigate, alert, id, user]);

    const updateUserSubmitHandler = (e) => {
        e.preventDefault();

        const userData = {
            name,
            email,
            role,
        };

        dispatch(updateUser(id, userData));
    };


    return (
        <Fragment>
            <div className='dashboard'>
                <div className="newUserContainer">
                    <form
                        className='createUserForm'
                        onSubmit={updateUserSubmitHandler}
                    >
                        <h1>Update User</h1>
                        <div>
                            <input
                                type="text"
                                placeholder='Name'
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div>
                            <input
                                type='email'
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                        <input
                            id="createUserBtn"
                            type='submit'
                            value="Update"
                            onClick={updateUserSubmitHandler}
                            disabled={loading ? true : false}
                        />
                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default UpdateUser