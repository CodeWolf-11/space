import { currentProfilePages } from "@/lib/current-profile-pages";
import prisma from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {

        const profile = await currentProfilePages(req);
        const { content, fileUrl } = req.body;
        const { serverId, channelId } = req.query;

        if (!profile) {
            return res.status(401).json({ "error": "Unauthorized" });
        }

        if (!serverId) {
            return res.status(400).json({ "error": "Server Id missing" });
        }

        if (!channelId) {
            return res.status(400).json({ "error": "Channel Id Missisng" });
        }

        if (!content) {
            return res.status(400).json({ "error": "Content is Missing" });
        }

        const server = await prisma.server.findFirst({
            where: {
                id: serverId as string,
                Member: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                Member: true
            }
        });

        if (!server) {
            return res.status(404).json({ "message": "Server not found" });
        }

        const channel = await prisma.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            }
        });

        if (!channel) {
            return res.status(404).json({ "message": "Channel not found" });
        }

        const member = server.Member.find((member) => member.profileId === profile.id);

        if (!member) {
            return res.status(404).json({ "message": "Member not found" });
        }

        const message = await prisma.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId as string,
                memberId: member.id
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        const channelKey = `chat:${channelId}:messages`;

        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json("Message sent successfully");

    } catch (error) {
        console.log("[MESSAGES_POST_PAGES]", error);
        return res.status(500).json({ "message": "Internal Error" });
    }
}