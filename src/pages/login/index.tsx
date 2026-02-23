import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoginMutation, useLazyGetAuthenticateQuery } from '@/src/app/services/auth';
import { useAuth } from '@/src/context/auth-context';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ParseJwt from './ParseJwt';
import { setUserId } from '../../app/services/authSlice';
import { useDispatch } from 'react-redux';
import Logo from '@/src/assets/logo-top.png';
import { useBuyerStore } from '@/src/stores/buyer.store';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { setFirstRegister } = useBuyerStore();
  const [errorStatus, setErrorStatus] = useState(false);
  const [loginFunction, { isError }] = useLoginMutation();
  const [getMe] = useLazyGetAuthenticateQuery();
  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
    redirectTo: window.location.origin + '/user'
  });
  const dispatch = useDispatch();
  const location = useLocation();
  const [showMessage, setShowMessage] = useState(false);
  const [roleError, setRoleError] = useState(false);

  const setPageTitle = (role: string) => {
    let title = 'CTN';
    if (role === 'ROLE_USER') {
      title = 'CTN車一括査定';
    }
    document.title = title;
  };

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setPageTitle(storedRole);
    }
  }, []);

  useEffect(() => {
    if (location.state?.showMessage) {
      setShowMessage(true);
    }
  }, [location.state]);

  useEffect(() => {
    if (roleError) {
      setRoleError(true);
      setTimeout(() => {
        setRoleError(false);
      }, 3000);
    }
  }, [roleError]);

  useEffect(() => {
    if (isError) {
      setErrorStatus(true);
      setTimeout(() => {
        setErrorStatus(false);
      }, 3000);
    }
  }, [isError]);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorStatus(false);
    setLoginDetails((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value
    }));
  };

  const onSubmitHandler = (event: React.SyntheticEvent) => {
    event.preventDefault();

    loginFunction(loginDetails)
      .unwrap()
      .then((response) => {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('refreshToken', response.refresh_token);
        localStorage.setItem('authenticated', 'true');

        // Automatically call /auth/me after login
        getMe(null).unwrap()
          .then((meData) => {
            const decodedToken = ParseJwt(response.access_token);
            login();

            const role = meData.role || decodedToken.role;
            localStorage.setItem('userRole', role);
            setPageTitle(role);

            const userId = meData.userId || meData.id || decodedToken.userId || decodedToken.sub || decodedToken.id;
            console.log('Logged in User ID:', userId);

            if (userId) {
              localStorage.setItem('userId', userId);
              dispatch(setUserId(userId));
            }

            if (role === 'ROLE_USER' || role === 'USER') {
              navigate(`/user`);
            } else {
              setRoleError(true);
              localStorage.clear();
            }
            setFirstRegister(false);
          })
          .catch((meError) => {
            console.error('Failed to fetch user profile automatically:', meError);
            setErrorStatus(true);
          });
      })
      .catch(() => {
        console.log('error');
      });
  };
  // useBodyClass('white_page');



  return (
    <div className="login-page flex justify-center items-center h-screen w-screen bg-white">
      {/* Card with lighter shadow */}
      <Card className="w-[350px] shadow-lg  rounded-lg">
        {/* Branding */}
        <CardHeader className="pt-8 px-6">
          <img src={Logo} alt="CTN Logo" className="w-24 h-12" loading="lazy" />
        </CardHeader>

        <CardContent className="px-6">
          <form>
            <div className="grid w-full gap-4">
              <div className="flex flex-col space-y-1.5 place-items-start">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  name="email"
                  className={`${errorStatus ? 'border-red-500' : 'border-gray-300'
                    } border rounded-md p-2 focus:border-blue-500 focus:outline-none transition-all duration-200 ease-in-out`}
                  placeholder="メールアドレス"
                  onChange={onChangeHandler}
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col space-y-1.5 place-items-start">
                <Label htmlFor="password">パスワード</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  className="border-gray-300 border rounded-md p-2 focus:border-blue-500 focus:outline-none transition-all duration-200 ease-in-out"
                  placeholder="パスワード"
                  onChange={onChangeHandler}
                />
              </div>
              {errorStatus && (
                <div className=" text-left w-full -mt-2 text-red-500 text-xs">
                  <p>メールアドレスもしくはパスワードが間違っています。</p>
                </div>
              )}
              {roleError && (
                <div className=" text-left w-full -mt-2 text-red-500 text-xs">
                  <p>メールアドレスもしくはパスワードが間違っています。</p>
                </div>
              )}
            </div>
          </form>
        </CardContent>

        {/* Login Button */}
        <CardFooter className="flex">
          <Button
            variant="default"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-lg font-bold"
            onClick={onSubmitHandler}>
            ログイン
          </Button>
        </CardFooter>

        {showMessage && (
          <div className="mb-5 text-red-600 mx-6 p-2 rounded-lg text-xs">
            <p>パスワードの変更が完了しました。</p>
            <p>ログインをお願いします。</p>
          </div>
        )}

        {/* Password Reset Link with correct font size */}
        <div className="text-center mt-1 mb-6">
          {/* <a href="/forget-password" className="text-blue-500 text-xs hover:underline">
            パスワードを忘れた方はこちら
          </a> */}
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;
