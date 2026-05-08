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

            updatePlaylist: (id, updates) =>
                set((state) => ({
                    playlists: state.playlists.map((playlist) =>
                        playlist.id === id ? { ...playlist, ...updates } : playlist
                    ),
                })),
        }),
        {
            name: "playlist-storage",
        }
    )
);
