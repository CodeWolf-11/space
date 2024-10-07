import { currentProfile } from '@/lib/current-profile'
import prisma from '@/lib/db';
import { ChannelType } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react'
import ServerHeader from '@/components/server/server-header';

interface ServerSideBarProps {
    serverId: string
}

async function ServerSideBar({ serverId }: ServerSideBarProps) {

    const profile = await currentProfile();

    if (!profile) {
        return redirect("/")
    }

    const server = await prisma.server.findUnique({
        where: {
            id: serverId,

        },
        include: {
            Channel: {
                orderBy: {
                    created_at: "asc"
                }
            },
            Member: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: "asc"
                }
            }
        }
    });

    const textChannels = server?.Channel.filter((channel) => {
        return channel.type === ChannelType.TEXT
    });
    const audioChannels = server?.Channel.filter((channel) => {
        return channel.type === ChannelType.AUDIO
    });

    const videoChannels = server?.Channel.filter((channel) => {
        return channel.type === ChannelType.VIDEO
    });

    const members = server?.Member.filter((member) => {
        return member.profileId !== profile.id
    });

    if (!server) {
        return redirect("/");
    }

    const role = server.Member.find((member) => {
        return member.profileId === profile.id
    })?.role;

    return (
        <div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'>
            <ServerHeader server={server} role={role} />
        </div>
    )
}

export default ServerSideBar