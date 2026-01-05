import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginUSER, login as salesLogin } from '../salesauth';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login = () => {
  const [credentials, setCredentials] = useState({
    LoginName: '',
    Password: '',
    Url: 'www.kit19.com',
    DeviceId: '10-60-4B-7A-92-E5',
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // call salesauth.login with the credentials object and console the response
    try {
      const resp = await loginUSER(credentials);
      const authResponse = resp?.Details?.AuthenticationResponse;
      console.log('salesauth.login response:', resp);
      if(resp?.Status === 1 && authResponse?.Id === 1){
      localStorage.setItem('Token', resp.Details.Token);
      localStorage.setItem('userId', resp.Details.User_ID);
      localStorage.setItem('TpUserID', resp.Details.TpUserID);
      localStorage.setItem('email', resp.Details.EMail);
      localStorage.setItem('FName', resp.Details.FName);
      localStorage.setItem('LName', resp.Details.LName);
      localStorage.setItem('Mobile', resp.Details.Mobile);
      localStorage.setItem('ProfilePicturePath', resp.Details.ProfilePicturePath);
      localStorage.setItem('ParentID', resp.Details.ParentID);
      localStorage.setItem('DeviceID', resp.Details.DeviceID);
      localStorage.setItem('ColorCode', resp.Details.ColorCode);
      localStorage.setItem('kit_domain', resp.Details.Domain);
      localStorage.setItem('DisplayName', resp.Details.DisplayName);
      localStorage.setItem('Logo', resp.Details.Logo);
      localStorage.setItem('PolicyUrl', resp.Details.PolicyUrl);
      localStorage.setItem('TermUrl', resp.Details.TermUrl);
      localStorage.setItem('Timezone', resp.Details.Timezone);
      localStorage.setItem('URL', resp.Details.URL);
      navigate('/');
      }
      else{
        toast.error(authResponse?.Text || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Something went wrong. Please try again.');
    }

    

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
       <ToastContainer position="top-right" autoClose={3000} />
      {/* Left hero */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-[#2a9629] text-white p-12">
        <div className="max-w-md">
          <h2 className="text-4xl font-bold mb-4">Welcome to Kit19 CRM</h2>
          <p className="mb-6 opacity-90">Streamline your sales pipeline, manage leads, and close deals faster.</p>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-white mr-3" />
              <span className="font-medium">Enquiries & Leads</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-white mr-3" />
              <span className="font-medium">Follow-ups & Activities</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-white mr-3" />
              <span className="font-medium">Quotations & Invoicing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in to Kit19</h1>
            <p className="text-gray-600">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
              <Input
                label="User Name"
                type="text"
                value={credentials.LoginName}
                onChange={(e) => setCredentials({ ...credentials, LoginName: e.target.value })}
                required
                placeholder="e.g. admin"
              />
            <Input
              label="Password"
              type="password"
              value={credentials.Password}
              onChange={(e) => setCredentials({ ...credentials, Password: e.target.value })}
              required
              placeholder="••••••••"
            />

            <Button
              type="submit"
              variant="outline-primary"
              className="w-full"
              loading={loading}
            >
              Log In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
