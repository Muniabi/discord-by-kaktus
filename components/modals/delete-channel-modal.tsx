"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";

export const DeleteChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const isModalOpen = isOpen && type === "deleteChannel";

    const { server, channel } = data;

    const onClick = async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id,
                },
            });

            await axios.delete(url);

            onClose();
            router.refresh();
            router.push(`/servers/${server?.id}`);
        } catch (error: unknown) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="dark:bg-zinc-800 dark:text-white p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Удалить канал
                    </DialogTitle>

                    <DialogDescription className="text-center">
                        Ты уверен, что хочешь этого? <br />
                        <span className="text-cyan-500 font-semibold">
                            #{channel?.name}
                        </span>{" "}
                        будет удален безвозвратно.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="bg-gray-100/90 dark:bg-gray-100/10 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            aria-disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                        >
                            Отменить
                        </Button>
                        <Button
                            disabled={isLoading}
                            aria-disabled={isLoading}
                            onClick={onClick}
                            variant="destructive"
                        >
                            Удалить
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
