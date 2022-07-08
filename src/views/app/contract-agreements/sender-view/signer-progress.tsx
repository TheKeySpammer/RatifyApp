import { Center, Collapse, Group, Loader, Modal, Progress, Stack, TextInput, Tooltip } from '@mantine/core';
import classNames from 'classnames';
import React from 'react';
import { getFormatDateFromIso } from '../../../../helpers/Utils';
import { Signer } from '../../../../types/ContractTypes';
import { getBgColorLight } from '../types';
import { Button } from 'reactstrap';
import { useDisclosure } from '@mantine/hooks';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ContractHelper } from '../../../../helpers/ContractHelper';
import { toast } from 'react-toastify';
import SignerPopover from '../signer-popover';
import { MdCheck, MdClear, MdError, MdSearch } from 'react-icons/md';

type Props = {
    signer: Signer;
    contractHelper: ContractHelper;
    onDocumentSent: (id: number) => void;
    signerProgress: {total: number, completed: number} | null;
    label: string;
};

const getSignerStatus = (status: string, completed: boolean, type: string) => {
    if (status === 'error') {
        return 'Error Sending';
    }
    if (type === 'viewer') {
        if (status === 'completed') {
            return 'Viewed';
        } else {
            return 'Not Viewed';
        }
    } else if (type === 'approver') {
        if (status === 'completed') {
            return 'Approved';
        } else {
            return 'In progress';
        }
    }  else {
        if (status === 'completed') {
            return 'Completed';
        }   
        if (status === 'sent' && !completed) {
            return 'In Progress';
        }
        if (status === 'sent' && completed) {
            return 'Not submitted';
        }
    }
}


const getSignerStatusAndIcon = (signer: Signer) => {
    if (signer.status === 'error') {
        return {
            status: 'Document could not be sent',
            icon: <MdError className='text-danger text-2xl' /> ,
        } 
    }
    if (signer.type === 'viewer') {
        if (signer.last_seen) {
            return {
                status: signer.name + ' viewed the document',
                icon: <div className='text-white rounded-full bg-blue-500' style={{padding: 2}}><MdSearch className='text-lg' /></div>,
            }
        }
    }
    if (signer.declined) {
        const action = signer.type === 'approver' ? 'approver' : 'sign';
        return {
            status: signer.name + ' declined to ' + action + ' the document' ,
            icon: <div className='text-white rounded-full bg-red-500' style={{padding: 2}}><MdClear className='text-lg' /></div>,
        }
    }

    if (signer.type === 'approver') {
        if (signer.approved) {
            return {
                icon: <div className='text-white rounded-full bg-success' style={{padding: 2}}><MdCheck className='text-lg' /></div>,
                status: signer.name + ' approved the document',
            }
        }
    }

    if (signer.type === 'signer') {
        if (signer.status === 'completed') {
            return {
                icon: <div className='text-white rounded-full bg-success' style={{padding: 2}}><MdCheck className='text-lg' /></div>,
                status: signer.name + ' signed the document',
            }
        }
    }
    
    return {
        status: '',
        icon: null,
    }
}

const SignerProgress: React.FC<Props> = ({ signer, contractHelper, onDocumentSent, signerProgress, label }) => {
    const [sendAgainModal, sendAgainHandlers] = useDisclosure(false);
    const [sending, setSending] = React.useState(false);

    const [{status: signerStatus, icon: signerIcon }] = React.useState(getSignerStatusAndIcon(signer));

    const sendAgainSchema = Yup.object().shape({
        name: Yup.string().required('Please provide the name of the recipient'),
        email: Yup.string().email('Please enter a correct email address.').required('Please provide the email of the recipient'),
    });

    const [collapsed, setCollapsed] = React.useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(sendAgainSchema),
        defaultValues: {
            name: signer.name,
            email: signer.email,
        }
    });

    const onSendAgain = (data: {name: string, email: string}) => {
        setSending(true);
        contractHelper.sendDocumentAgain(signer.id, data.name, data.email).then(() => {
            setSending(false);
            sendAgainHandlers.close();
            onDocumentSent(signer.id);
            toast.success('Document send successfully!');
        }).catch(err => {
            toast.error('Cannot send the document. Please contact support');
        });
    }

    return (
        <>
            <SignerPopover
                color={signer.color}
                target={(<div
                    style={{ width: 145 }}
                    className={classNames(
                        'px-3 py-3',
                        getBgColorLight(signer.color),
                    )}>
                        {signerStatus.length > 0 && <div className='absolute' style={{ top: 5, right: 5 }}>
                            <Tooltip label={signerStatus}>
                                {signerIcon}
                            </Tooltip>
                        </div>}
                        {!collapsed && (
                            <Stack spacing={'md'}>
                                <div className='text-center text-lg'>
                                    <span>{signer.name}</span>
                                </div>
                                <Center className='cursor-pointer' onClick={() => {
                                    setCollapsed(true)
                                    }}>
                                    <i className='simple-icon-arrow-down' />
                                </Center>
                            </Stack>
                        )}
                        <Collapse in={collapsed}>
                            <Stack spacing='md'>
                                <div className='text-center text-lg'>
                                    <span>{signer.name}</span>
                                </div>
                                {signer.status === 'error' && <p className='text-danger text-xs'>
                                    Document could not be sent. Please check the email address entered and try again.
                                </p>}
                                <div>
                                    <Group position='apart'>
                                        <p className='text-muted'>Email</p>
                                        {signer.status === 'error' && <p className='text-primary underline'>Edit</p>}
                                    </Group>
                                    <p>{signer.email}</p>
                                </div>
                                {signer.last_seen && <div>
                                    <p className='text-muted'>Last seen</p>
                                    <p>{getFormatDateFromIso(signer.last_seen)}</p>
                                </div>}
                                <div>
                                    <p className='text-muted'>Status</p>
                                    <p>{getSignerStatus(signer.status, !!signerProgress && signerProgress.total === signerProgress.completed, signer.type)}</p>
                                </div>
                                {signerProgress && <div className='w-full'>
                                    <Progress className='w-full h-2' value={signerProgress.total === 0 ? 100 : signerProgress.completed * 100 / signerProgress.total} />
                                    <Group position='apart' className='text-gray-600'>
                                        <p className='text-xs'>Completed</p>
                                        <p className='text-xs'> {signerProgress.completed}/{signerProgress.total} </p>
                                    </Group>
                                </div>}
                                {signer.every_unit === '0' && (
                                    <p>No Reminder</p>
                                )}
                                {signer.every_unit !== '0' && (
                                    <div>
                                        <p className='text-muted'>Remind every</p>
                                        <p>{signer.every} {signer.every_unit}</p>
                                    </div>
                                )}
                                <div>
                                    <p className='text-muted'>Last Reminder</p>
                                    <p>not sent</p>
                                </div>
                                {signer.status === 'sent' &&<span><Button size='xs' color='primary'>
                                    Send Reminder    
                                </Button></span>}
                                {signer.status === 'error' && <span onClick={() => {
                                    sendAgainHandlers.open();
                                }}>
                                    <Button disabled={sending}>Send Again</Button>    
                                </span>}
                                <Center className='cursor-pointer' onClick={() => {
                                    setCollapsed(false)
                                    }}>
                                    <i className='simple-icon-arrow-up' />
                                </Center>
                            </Stack>
                        </Collapse>
                    </div>)}
            >
                {label}
            </SignerPopover>
            
            <Modal centered title='Send the document again' opened={sendAgainModal} onClose={sendAgainHandlers.close}>
                <form onSubmit={handleSubmit(onSendAgain)}>
                    <Stack>
                        <TextInput {...register('name')} error={errors.name ? errors.name.message : ''} required label='Name' placeholder='Name' defaultValue={signer.name} />
                        <TextInput {...register('email')} error={errors.email ? errors.email.message : ''} required label='Email' placeholder='Email' defaultValue={signer.email} />
                        <Group position='right'>
                            <span><Button type='button' onClick={sendAgainHandlers.close} color='light'>Cancel</Button></span>
                            <span><Button disabled={sending} color='success'>{sending ? <Loader variant='bars' size='xs' color='white' /> : 'Send'}</Button></span>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </>
    );
};

export default SignerProgress;
