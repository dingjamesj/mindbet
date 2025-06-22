import { createClient } from "@supabase/supabase-js"
import React, {useState} from "react";
import "./Signup.css";

const Signup = ({onLogin}) => {

    const [formData, setFormData] = useState({

        email: "", 
        password: ""

    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log(process.env);

        const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY)
        const {data, error} = await supabase.auth.signUp({
            password: formData.password
        })


        console.log("Signup data:", formData);
    }

    return (
        <div className="signup-container">
            <h1>SIGN UP NOW!</h1>
            <form onSubmit={handleSubmit}>
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
                        required
                    />
                </div>
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
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">Sign Up</button>
            </form>
        </div>
    )

}

export default Signup;