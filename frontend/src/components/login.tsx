import axios from "axios";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import IsLoadingHOC from "./utils/isLoading";

interface User {
  email: string;
  password: string;
}

interface LoginResponse {
  status: number;
  token?: string;
  message?: string;
}

function Login({setLoading}: any) {
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      email: user.email,
      password: user.password,
    };

    try {
      const response = await axios.post<LoginResponse>(
        `${process.env.REACT_APP_BASE_URL}/api/auth/login`,
        payload
      );

      const data = response.data;

      if (data.status === 1 && data.token) {
        setLoading(false);
        toast.success(data?.message);
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      }
    } catch (err : any) {
      setLoading(false);
      // console.error(err);
            toast.error(err.response?.data?.message);
      

    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email address"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Sign in
          </button>
        </form>

        <p
          className="mt-6 text-center text-sm text-gray-600 cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Not a member? <span className="font-medium text-indigo-600 hover:underline  ">Register here</span>
        </p>
      </div>
    </div>
  );
}

export default IsLoadingHOC(Login);
