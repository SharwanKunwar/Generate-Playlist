import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePlaylistStore = create(
    persist(
        (set) => ({
            playlists: [],

            addPlaylist: (playlist) =>
                set((state) => ({
                    playlists: [...state.playlists, playlist],
                })),

            removePlaylist: (id) =>
                set((state) => ({
                    playlists: state.playlists.filter((p) => p.id !== id),
                })),
        }),
        {
            name: "playlist-storage",
        }
    )
);