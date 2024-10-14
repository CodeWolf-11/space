"use client";

import { Member, Message, Profile } from '@prisma/client'
import React, { Fragment } from 'react'
import { format } from "date-fns"
import ChatWelcome from './chat-welcome'
import { useChatQuery } from '@/hooks/use-chat-hooks'
import { Loader2, ServerCrash } from 'lucide-react'
import ChatItem from './chat-Item';


const DATE_FORMAT = "d MMM yyyy, HH:mm";

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

interface ChatMessagesProps {
    name: string,
    member: Member,
    chatId: string,
    apiUrl: string,
    socketUrl: string,
    socketQuery: Record<string, string>,
    paramKey: "channelId" | "conversationId",
    paramValue: string,
    type: "channel" | "conversation"
}

function ChatMessages({ name, member, chatId, apiUrl, socketQuery, socketUrl, paramKey, paramValue, type }: ChatMessagesProps) {

    const queryKey = `chat:${chatId}`;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue
    });

    if (status === "pending") {
        return (
            <div className='flex flex-col flex-1 justify-center items-center'>
                <Loader2 className='h-7 w-7 text-zinc-500 animate-spin' />
                <p className='text-xs text-zinc-500 dark:text-zinc-400'>
                    Loading messages...
                </p>
            </div>
        )
    }

    if (status === "error") {
        return (
            <div className='flex flex-col flex-1 justify-center items-center'>
                <ServerCrash className='h-10 w-10 text-zinc-500 my-4' />
                <p className='text-xs text-zinc-500 dark:text-zinc-400'>
                    Something went wrong
                </p>
            </div>
        )
    }

    return (
        <div className='flex-1 flex flex-col py-4 overflow-y-auto'>
            <div className='flex-1' />
            <ChatWelcome type={type} name={name} />

            <div className='flex flex-col-reverse mt-auto'>
                {data?.pages.map((group, i) => {
                    return <Fragment key={i}>
                        {
                            group.items.map((message: MessageWithMemberWithProfile) => {
                                return (

                                    <ChatItem
                                        currentMember={member}
                                        member={message.member}
                                        key={message.id}
                                        id={message.id}
                                        content={message.content}
                                        fileurl={message.fileUrl}
                                        deleted={message.deleted}
                                        timeStamp={format(new Date(message.created_at), DATE_FORMAT)}
                                        isUpdated={message.updated_at !== message.created_at}
                                        socketUrl={socketUrl}
                                        socketQuery={socketQuery} />

                                )
                            })
                        }
                    </Fragment>
                })}
            </div>
        </div>
    )
}

export default ChatMessages