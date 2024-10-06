import { currentProfile } from "@/lib/current-profile";
import prisma from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuid4 } from "uuid";

export async function POST(req: Request) {
    try {

        const { name, imageUrl } = await req.json();
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("UnAuthorized", { status: 401 });
        }

        const server = await prisma.server.create({
            data: {
                profileId: profile.id,
                name: name,
                imageUrl: imageUrl,
                inviteCode: uuid4(),
                Channel: {
                    create: [
                        {
                            name: "general", profileId: profile.id
                        }
                    ]
                },
                Member: {
                    create: [
                        {
                            profileId: profile.id,
                            role: MemberRole.ADMIN
                        }
                    ]
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVERS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}