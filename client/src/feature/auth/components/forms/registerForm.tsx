import React, { useState } from 'react'
import userService from '../../../../core/services/user.Service'

const inititalForm = {
    firstName: '',
    lastName: '',
    middleInitial: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender : '',
    role: 'staff'
}
const registerForm = () => {
    const [form, setForm] = useState(inititalForm)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setForm({...form, [name]: value})
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Password match validation
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        // Map "other" to "rather not say"
        const gender =
            form.gender === "other" ? "rather not say" : form.gender;

        try {
            await userService.register({
                firstName: form.firstName,
                lastName: form.lastName,
                middleInitial: form.middleInitial,
                email: form.email,
                password: form.password,
                age: Number(form.age),
                gender: gender as 'male' | 'female' | 'rather not say',
                role: form.role as 'staff' | 'admin',
            });

            
        } catch (error: any) {
            setError(error.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" required />
            <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" required />
            <input type="text" name="middleInitial" value={form.middleInitial} onChange={handleChange} placeholder="Middle Initial" />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required />
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
            <input type="number" name="age" value={form.age} onChange={handleChange} placeholder="Age" required />
            <select name="gender" value={form.gender} onChange={handleChange} required >
                <option value="" disabled>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
            <select name="role" value={form.role} onChange={handleChange} required >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
            </select>
            <button type="submit" disabled={loading}>Register</button>
            {error && <div>{error}</div>}
        </form>
        <div>
            <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
    </div>
    
    
  )
}

export default registerForm;