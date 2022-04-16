import './App.css';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IntlProvider } from 'react-intl';
import AppLocale from './lang/';
import { getDirection } from './helpers/Utils';
// @ts-ignore
import { AppDispatch, RootState } from './redux/';
import { AuthHelper } from './helpers/AuthHelper';

const ViewError = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ './theme/views/error')
);
const ViewUnauthorized = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ './theme/views/unauthorized')
);
const ViewUser = React.lazy(() =>
  import(/* webpackChunkName: "views-user" */ './theme/views/user')
);
const Login = React.lazy(() =>
  import(/* webpackChunkName: "user-login" */ './theme/views/user/login')
);
const Register = React.lazy(() =>
  import(/* webpackChunkName: "user-register" */ './theme/views/user/register')
);

type ProtectedRouteProps = {
    isAuthenticated: boolean;
    authenticationPath: string;
    outlet: JSX.Element;
};

function ProtectedRoute({
    isAuthenticated,
    authenticationPath,
    outlet,
}: ProtectedRouteProps) {
    if (isAuthenticated) {
        return outlet;
    } else {
        return <Navigate to={{ pathname: authenticationPath }} />;
    }
}

function App() {
    const auth = useSelector((root: RootState) => root.auth);
    const direction = React.useCallback(getDirection, [])();
    const settings = useSelector((root: RootState) => root.settings);
    const currentAppLocale = AppLocale[settings.locale];
    const dispatchFn = useDispatch<AppDispatch>();
    const authHelper = React.useMemo(() => new AuthHelper(dispatchFn), [dispatchFn]);

    const defaultProtectedRouteProps: Omit<ProtectedRouteProps, 'outlet'> = {
        isAuthenticated: auth.isAuthenticated || auth.loading,
        authenticationPath: '/user',
    };

    React.useEffect(() => {
        if (direction.isRtl) {
            document.body.classList.add('rtl');
            document.body.classList.remove('ltr');
        } else {
            document.body.classList.add('ltr');
            document.body.classList.remove('rtl');
        }
    }, [direction]);

    React.useEffect(() => {
        authHelper.refreshTokenRequest().then(() => {
            authHelper.getUserInfo().then().catch(err => {});
        });
    }, [authHelper]);

    return (
        <div className="h-100">
            <IntlProvider
                locale={currentAppLocale.locale}
                messages={currentAppLocale.messages}
            >
                <>
                    <React.Suspense fallback={<div className="loading" />}>
                        <BrowserRouter>
                            <Routes>
                                <Route path='/' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<div className='flex h-screen justify-center items-center text-3xl'>Home</div>} />} />
                                <Route path='error' element={<ViewError></ViewError>} />
                                <Route path='unauthorized' element={<ViewUnauthorized></ViewUnauthorized>} />
                                <Route path='user' element={<ViewUser />} >
                                    <Route index element={<Navigate to='/user/login' />} />
                                    <Route path='login' element={<Login />} />
                                    <Route path='register' element={<Register />} />
                                </Route>
                                <Route path="*" element={<Navigate to='/error' />} />
                            </Routes>
                        </BrowserRouter>
                    </React.Suspense>
                </>
            </IntlProvider>
        </div>
    );
}

export default App;
