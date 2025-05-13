import axios from 'axios';
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import IsLoadingHOC from "./utils/isLoading";

interface User {
  email: string;
  name: string;
  lname: string;
  password: string;
}

interface RegisterResponse {
  status: number;
  token?: string;
  message?: string;
}

function SignUp({setLoading}: any) {
  const [user, setUser] = useState<User>({
    email: '',
    name: '',
    lname: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: user.name,
      lname: user.lname,
      email: user.email,
      password: user.password,
    };

    try {
      const response = await axios.post<RegisterResponse>(
        `${process.env.REACT_APP_BASE_URL}/api/auth/register`,
        payload
      );

      const data = response.data;

      if (data.status === 1 ) {
        setLoading(false);
        toast.success(data?.message)
        navigate('/');
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex space-x-4">
            <input
              type="text"
              name="name"
              placeholder="First name"
              value={user.name}
              onChange={handleChange}
              required
              className="w-1/2 rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="lname"
              value={user.lname}
              onChange={handleChange}
              placeholder="Last name"
              required
              className="w-1/2 rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email address"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Sign up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <span
            className="text-indigo-600 font-medium hover:underline cursor-pointer"
            onClick={() => navigate('/')}
          >
            SignIn
          </span>
        </p>

      </div>
    </div>
  );
}

export default IsLoadingHOC(SignUp);
