import { create } from "zustand";
import { IDialogStore } from "../models";

export const dialogStore = create<IDialogStore>()((set) => ({
    opened: false,
    open: () => set(() => ({ opened: true })),
    close: () => set(() => ({ opened: false })),
}))
