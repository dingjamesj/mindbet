import React, {useState} from "react";
import "./Signup.css";

const Signup = ({onLogin}) => {

    const [formData, setFormData] = useState({

        email: "", 
        password: ""

    })

    return (
        <div className="signup-container">
            <h1>Sign Up</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="email">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>
            </form>
            <form>
                <div className="form-group">
                    <label htmlFor="password">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                </div>
            </form>
        </div>
    )

}

export default Signup;