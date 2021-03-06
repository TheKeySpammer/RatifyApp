import { Center, Loader, PasswordInput, Stack } from '@mantine/core';
import React from 'react';
import AuthLayout from './auth-layout';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';
import { passwordValidation } from '../../helpers/Utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AuthHelper } from '../../helpers/AuthHelper';
import { Alert, Button } from 'reactstrap';

const ResetPassword:React.FC = () => {
    
    const intl = useIntl();
    const navigate = useNavigate();
    const dispatchFn = useDispatch();
    const authHelper = React.useMemo(
        () => new AuthHelper(dispatchFn),
        [dispatchFn],
    );
    const [searchParams] = useSearchParams();
    const [token, setToken] = React.useState('');
    const [completed, setCompleted] = React.useState(false);
    const [sending, setSending] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [timeoutValue, setTimeoutValue] = React.useState<NodeJS.Timeout | null>(null);
    
    const schema = Yup.object().shape({
        password: Yup.string()
            .min(8, intl.formatMessage({ id: 'auth.password.min' }))
            .required(intl.formatMessage({ id: 'auth.password.required' }))
            .test(
                'password-validation',
                intl.formatMessage({ id: 'auth.password.invalid' }),
                passwordValidation,
            ),
        confirm_password: Yup.string()
            .oneOf(
                [Yup.ref('password')],
                intl.formatMessage({ id: 'auth.password.mismatch' }),
            )
            .required(intl.formatMessage({ id: 'auth.password.confirm' })),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{password: string, confirm_password: string}>({
        resolver: yupResolver(schema),
        defaultValues: {
            password: '',
            confirm_password: '',
        },
    });

    const onSubmit = (data: {password: string, confirm_password: string}) => {
        setSending(true);
        setErrorMessage('');
        authHelper.resetPassword({token, password: data.password, confirm_password: data.confirm_password}).then(({ email }) => {
            setSending(false);
            setCompleted(true);
            authHelper.loginRequest({email, password: data.password, rememberMe: false}).then(() => {
                setTimeoutValue(setTimeout(() => {
                    navigate('/');
                }, 4000));
            }).catch(err => {
                
            });
        }).catch(err => {
            setSending(false);
            if (err.response && err.response.status === 400) {
                console.log(err.response.data);
                const status = err.response.data.status;
                if (status === 'invalid') {
                    setErrorMessage('You are not authorized to reset the password. Please generate a new password reset link.');
                } else if (status === 'expired') {
                    setErrorMessage('The password reset link has expired. Please generate a new password reset link.');
                } else if (status === 'password') {
                    setErrorMessage('The password you entered is invalid. Please try again.');
                } else if (status === 'confirm_password') {
                    setErrorMessage('The passwords you entered do not match. Please try again.');
                } else {
                    setErrorMessage('Something went wrong. Try again later!');
                }
            } else {
                setErrorMessage('Something went wrong. Try again later!');
            }
        })
    }

    React.useEffect(() => {
        const tokenStr = searchParams.get('token');
        if (tokenStr === null || tokenStr.length === 0) {
            navigate('/');
            return;
        }
        setToken(tokenStr);
    
    }, [searchParams, navigate]);

    React.useEffect(() => {
        return () => {
            if (timeoutValue !== null) {
                clearTimeout(timeoutValue);
            }
        }
    }, [timeoutValue]);

    return <AuthLayout>
        {!completed && <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
            <Stack className='w-full'>
                <h1 className='font-bold text-3xl'>Reset Your Password</h1>
                {sending && (
                    <Center>
                        <Loader variant="dots" />
                    </Center>
                )}
                {!sending && errorMessage.length > 0 && (
                    <Alert color='danger'>
                        <p className='text-lg'>{errorMessage}</p>
                    </Alert>
                )}
                
                <PasswordInput
                    {...register('password')}
                    error={errors.password ? errors.password.message : ''}
                    size='md'
                    icon={<i className="simple-icon-lock" />}
                    label='Password'
                    placeholder='*********'
                    description={<p className='text-muted text-xs'>Password must include at least one number, one uppercase, one lowercase and at least 8 characters</p>}
                />
                <PasswordInput
                    {...register('confirm_password')}
                    error={errors.confirm_password ? errors.confirm_password.message : ''}
                    size='md'
                    icon={<i className="simple-icon-lock" />}
                    label='Confirm Password'
                    placeholder='*********'
                />
                <span className="w-full mt-4">
                    <Button
                        size="lg"
                        className="w-full"
                        color="primary">
                        Submit
                    </Button>
                </span>
                
            </Stack>
        </form>}
        {completed && <Stack>
            <h1 className='font-bold text-3xl'>Password Reset</h1>
            <Alert>
                <p className='text-lg'>New password saved successfully!</p>
                <p className='text-xs'>You will be redirected to your dashboard in a moment.</p>
            </Alert>
            <p className='text-sm text-muted'>If you are not automatically redirected in 5 seconds, please click the link below.</p>
            <span className='text-blue-500 underline cursor-pointer' onClick={() => {
                navigate('/');
            }}>
                Dashboard
            </span>
        </Stack>}
    </AuthLayout>
}

export default ResetPassword;