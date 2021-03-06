import React from 'react';
import {
    Card,
    Center,
    Group,
    SimpleGrid,
    Stack,
    Image,
    Modal
} from '@mantine/core';
import { Button } from 'reactstrap';
import {  useNavigate, useSearchParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useViewportSize } from '@mantine/hooks';
import SignupForm from '../../../user/signup-form';
import { useDispatch } from 'react-redux';
import { ContractHelper } from '../../../../helpers/ContractHelper';

const typeToMessage = (type: string) => {
    if (type === 'many') {
        return 'Your request has been received. You will be notified when the document is ready.';
    }
    if (type === 'agreement' || type === 'email' || type === 'error') {
        return 'Looks like something went wrong. We cannot get the final copy of the document at the moment. Please contact the sender.'
    }
    if (type === 'sent') {
        return 'The final document has been emailed to you. Please check your inbox.';
    }
    if (type === 'request') {
        return 'The document is not ready yet. We will email you the final copy of the document once it is ready.';
    }
    return 'Your request has been received. You will be notified when the document is ready.';
};

const AgreementSuccess: React.FC = () => {
    const navigate = useNavigate();
    const dispatchFn = useDispatch();
    const contractHelper = React.useMemo(
        () => new ContractHelper(dispatchFn),
        [dispatchFn],
    );
    const { height, width } = useViewportSize();
    const [showConfetti, setShowConfetti] = React.useState(false);
    const [searchParams] = useSearchParams();
    const [token, setToken] = React.useState('');
    const [signerType, setSignerType] = React.useState('');
    const [senderName, setSenderName] = React.useState('');
    const [organizationName, setOrganizationName] = React.useState('');
    const [showDocumentCopy, setShowDocumentCopy] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [respType, setRespType] = React.useState('');

    React.useEffect(() => {
        const confetti = searchParams.get('confetti');
        const tokenStr = searchParams.get('token');
        let timeout: NodeJS.Timeout | null = null; 
        if (confetti) {
            setShowConfetti(true);
            timeout = setTimeout(() => {
                setShowConfetti(false);
            }, 1400);
        }
        if (tokenStr) {
            setToken(tokenStr);
        }
        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        }
    }, [searchParams]);

    React.useEffect(() => {
        if (token) {
            contractHelper.getSignerSuccessInfo(token).then(data => {
                setSenderName(data.data.senderName);
                setSignerType(data.data.signerType);
                setOrganizationName(data.data.organizationName);
            }).catch(err => {
                console.log(err);
            });
        }
    }, [token, contractHelper]);

    const requestDocumentCopy = React.useCallback(() => {
        if (token) {
            setError(false);
            contractHelper.requestFinalDocument(token).then(resp => {
                setRespType(resp.type);
                setShowDocumentCopy(true);
            }).catch(err => {
                setError(true);
                console.log(err.response);
                if (err && err.response && err.response.data) {
                    setRespType(err.response.data.type);
                } else {
                    setRespType('error');
                }
                setShowDocumentCopy(true);
            });
        }
    }, [contractHelper, token]);

    return (
        <>
        <div style={{ backgroundColor: '#F8F8F8' }}>
            <SimpleGrid className='h-screen' cols={2} breakpoints={[{ maxWidth: 600, cols: 1 }]}>
                <Center className="px-10 mb-36 h-100 mt-10 sm:mt-0">
                    <Stack spacing='xl'>
                        <Center>
                            <Image className='mb-4 w-[120px] sm:w-[150px] relative' style={{ right: 15 }} src='/static/logos/black.svg' alt='Ratify' />
                        </Center>
                        <div>
                            <h4 className="text-2xl font-bold">
                                {signerType.length > 0 ? `You have successfully ${signerType === 'signer' ? 'signed and sent' : 'approved'} the document.` : 'You have completed the document.'}
                            </h4>
                            <p className="text-center text-muted">
                                Sender {senderName === '' ? '' : ', '+senderName}{organizationName === '' ? '' : ', '+organizationName} will be notified and will receive the
                                {signerType === 'approver' ? ' approved' : ' signed'} document
                            </p>
                        </div>
                        <Group className='mt-3' position="center">
                            <span onClick={() => requestDocumentCopy()}>
                                <Button color="light">
                                    Get a Copy of Document
                                </Button>
                            </span>
                            <span onClick={() => {
                                navigate(`/`);
                            }}>
                                <Button color="primary">Try Ratify</Button>
                            </span>
                        </Group>
                    </Stack>
                </Center>
                <Center className="w-full h-full p-3">
                    <Card className="shadow-md w-full sm:w-[500px] p-6 md:p-12">
                        <SignupForm title='Try Ratify for free' buttonTitle='Register' />
                    </Card>
                </Center>
            </SimpleGrid>
        </div>
        <Confetti gravity={0.1} width={width} numberOfPieces={showConfetti ? 200 : 0} height={height} />
        <Modal
            opened={showDocumentCopy}
            onClose={() => setShowDocumentCopy(false)}
            title={<p className='font-bold'>Document Copy</p>}
            centered
        >
            <Center>
                <div>
                    {error && <Center>
                        <i className='simple-icon-exclamation text-5xl mb-4 text-danger'></i>
                    </Center>}
                    {!error && <Center>
                        <i className='simple-icon-check text-5xl mb-4 text-success'></i>
                    </Center>}
                    <p className='text-lg'>
                        {typeToMessage(respType)}
                    </p>
                    <Group position='right'>
                        <span onClick={() => setShowDocumentCopy(false)}>
                            <Button>
                                Ok
                            </Button>
                        </span>
                    </Group>
                </div>
            </Center>
        </Modal>
        </>
    );
};
 
export default AgreementSuccess;
