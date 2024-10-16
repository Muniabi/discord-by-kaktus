"use client";

import { useUser } from "@clerk/nextjs";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import "@livekit/components-styles";

type MediaRoomProps = {
    chatId: string;
    video: boolean;
    audio: boolean;
};

export const MediaRoom = ({ chatId, audio, video }: MediaRoomProps) => {
    const { user } = useUser();
    const { resolvedTheme } = useTheme();

    const [token, setToken] = useState("");

    useEffect(() => {
        if (!user?.firstName || !user?.lastName) return;

        const name = `${user.firstName} ${user.lastName}`;

        (async () => {
            try {
                console.log("Запрашиваем токен...");
                const res = await fetch(
                    `/api/livekit?room=${chatId}&username=${name}`
                );
                console.log("Получен ответ:", res);
                const data = await res.json();
                console.log("Получен токен:", data.token);
                setToken(data.token);
            } catch (error: unknown) {
                console.error("Ошибка при получении токена:", error);
            }
        })();
    }, [user?.firstName, user?.lastName, chatId]);

    if (token === "")
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Загрузка...
                </p>
            </div>
        );

    return (
        <LiveKitRoom
            data-lk-theme={resolvedTheme === "dark" ? "default" : "light"}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            connect={true}
            video={video}
            audio={audio}
        >
            <VideoConference />
        </LiveKitRoom>
    );
};
