import React from "react";
import './Notification.css'

const Notification = (props) => {
    const successfull = props.message[0]
    const error = props.message[1]
    if (successfull !== null) { 
        return (
            <div className="successfulMessage">
                {successfull}
            </div>
        )
    } else if (error !== null) { 
        return (
            <div className="errorMessage">
                {error}
            </div>
        )
    } else {
        return null
    }
}

export default Notification