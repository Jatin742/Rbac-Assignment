import React, { Fragment, useEffect, useState } from 'react';
import "./CreateUser.css";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { NEW_USER_RESET } from '../../Constants/adminConstant';
import { clearErrors, createUser } from '../../Actions/adminAction';
import { useAlert } from 'react-alert';

const CreateUser = () => {
    const dispatch = useDispatch();

    const { loading, error, success } = useSelector((state) => state.newUser);
    const alert=useAlert();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("user");

    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
        }
        if (success) {
            alert.success("User Created");
            dispatch({ type: NEW_USER_RESET });
            navigate("/admin/all-users")
        }
    }, [dispatch, error, success, navigate]);

    const createUserSubmitHandler = (e) => {
        e.preventDefault();

        const userData = {
            name,
            email,
            role,
        };

        dispatch(createUser(userData));
    };


    return (
        <Fragment>
            <div className='dashboard'>
                <div className="newUserContainer">
                    <form
                        className='createUserForm'
                        onSubmit={createUserSubmitHandler}
                    >
                        <h1>Create User</h1>
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
                            value="Create"
                            disabled={loading ? true : false}
                        />
                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default CreateUser