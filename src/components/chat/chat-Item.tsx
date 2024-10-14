"use client"

import { Member, MemberRole, Profile } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import UserAvatar from '../user-avatar'
import ActionToolTip from '../action-tooltip'
import { Edit, FileIcon, FileType, ShieldAlert, ShieldCheck, Trash } from 'lucide-react'
import Image from "next/image";
import axios from 'axios'
import { cn } from '@/lib/utils'

interface ChatItemProps {
    id: string,
    content: string,
    member: Member & {
        profile: Profile
    },
    timeStamp: string,
    fileurl: string | null,
    currentMember: Member,
    socketUrl: string,
    socketQuery: Record<string, string>,
    isUpdated: boolean,
    deleted: boolean
}

const RoleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500' />,
    "ADMIN": <ShieldAlert className='h-4 w-4 ml-2 text-green-600' />

}

function ChatItem({
    id,
    content,
    member,
    timeStamp,
    fileurl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery
}: ChatItemProps) {

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [fileType, setFileType] = useState<string>("");
    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const isOwner = currentMember.id = member.id;
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileurl;
    const isPDF = fileType === "pdf" && fileurl;
    const isImage = !isPDF && fileurl;

    useEffect(() => {
        if (fileurl) {
            axios.get(fileurl).then((res) => {
                setFileType(res.headers["content-type"].split("/")[1]);
            })
        }

    }, []);

    return (
        <div className='relative group flex items-center hover:bg-black/5 p-4 transition w-full'>

            <div className='group flex gap-x-2 items-start w-full'>
                <div className='cursor-pointer hover:drop-shadow-md transition'>
                    <UserAvatar src={member.profile.imageUrl} />
                </div>

                <div className='flex flex-col w-full '>
                    <div className="flex items-center gap-x-2">
                        <div className='flex items-center'>
                            <p className='font-semibold text-sm hover:underline cursor-pointer'>
                                {member.profile.name}
                            </p>
                            <ActionToolTip label={member.role}>
                                {
                                    RoleIconMap[member.role]
                                }
                            </ActionToolTip>
                        </div>

                        <span className='text-xs text-zinc-500 dark:text-zinc-400'>
                            {timeStamp}
                        </span>
                    </div>
                    {
                        isImage && (
                            <a href={fileurl} target='_blank' rel="noopener noreferrer" className='relative aspect-square rounded-md mt-2 overflow-hidden items-center bg-secondary h-48 w-48'>
                                <Image priority fill src={fileurl} alt={content} className='object-corner' />
                            </a>
                        )
                    }
                    {
                        isPDF && (
                            <div className='relative flex h-fit gap-1  items-center p-4 mt-2 rounded-md bg-background/10'>

                                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                                <a href={fileurl} rel="noopener noreferrer" className=' ml-2   text-indigo-500 dark:text-indigo-400 hover:underline ' target='_blank'>
                                    PDF file
                                </a>
                            </div >
                        )
                    }
                    {
                        !fileurl && !isEditing && (
                            <p className={
                                cn(
                                    "text-sm text-zinc-600 dark:text-zinc-300",
                                    deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                                )
                            }>
                                {content}
                                {
                                    isUpdated && !deleted && (
                                        <span className='text-[10px] mx-2 text-zinc-500 dark:text-zinc-400'>
                                            (edited)
                                        </span>
                                    )
                                }
                            </p>
                        )
                    }
                </div>
            </div>
            {
                canDeleteMessage && (
                    <div className='hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm'>
                        {
                            canEditMessage && (
                                <ActionToolTip label='edit'>
                                    <Edit onClick={() => setIsEditing(true)} className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition' />
                                </ActionToolTip>
                            )
                        }

                        {
                            canDeleteMessage && (
                                <ActionToolTip label='delete'>
                                    <Trash className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition' />
                                </ActionToolTip>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}

export default ChatItem