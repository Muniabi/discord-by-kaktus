"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
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

export const DeleteServerModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const isModalOpen = isOpen && type === "deleteServer";

    const { server } = data;

    const onClick = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/servers/${server?.id}`);

            onClose();
            router.refresh();
            router.push("/");
        } catch (error: unknown) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-zinc-800 text-black dark:text-white p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Удалить сервер
                    </DialogTitle>

                    <DialogDescription className="text-center ">
                        Ты уверен, что хочешь этого? <br />
                        <span className="text-cyan-500 font-semibold mx-1">
                            {server?.name}
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
