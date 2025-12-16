import { useRealtimeKitClient } from "@cloudflare/realtimekit-react";
import { useCallback, useEffect, useState } from "react";

export const useRealtime = () => {
	const [client, initClient] = useRealtimeKitClient();
	const [isConnected, setIsConnected] = useState(false);
	const [isMicMuted, setIsMicMuted] = useState(false);

	// Mock state for development
	const [isMock, setIsMock] = useState(false);

	useEffect(() => {
		if (isMock) return;

		if (!client) {
			setIsConnected(false);
			return;
		}

		// Initial states
		setIsConnected(!!client.peerId);

		// client is typed as Client | null, but we checked !client above.
		// However, types might not show self/media if they are optional or not in the main type?
		// Let's assume the library provides a loose Client type or we need to cast for specifics.
		// If Client definition is robust, this works. If not, we might need 'as any' back or a custom interface.
		// Based on previous errors "Property 'on' does not exist on type 'Client'", the type IS 'Client'.
		// Let's try attempting access. If it fails, I'll define an interface.

		// biome-ignore lint/suspicious/noExplicitAny: Client type definition might be incomplete
		const c = client as any;
		if (c.self?.media) {
			setIsMicMuted(!c.self.media.audioEnabled);
		}

		const handleUpdate = () => {
			// biome-ignore lint/suspicious/noExplicitAny: Client type definition might be incomplete
			const cur = client as any;
			if (cur.self?.media) {
				setIsMicMuted(!cur.self.media.audioEnabled);
			}
			setIsConnected(!!client.peerId);
		};

		// RealtimeKit event handling
		// biome-ignore lint/suspicious/noExplicitAny: internal/legacy methods
		const eventSource = client as any;

		// Support both 'on' and 'addListener' (older versions/internals)
		if (typeof eventSource.on === "function") {
			eventSource.on("peer.joined", handleUpdate);
			eventSource.on("peer.left", handleUpdate);
			eventSource.on("self.updated", handleUpdate);
			eventSource.on("connected", handleUpdate);
			eventSource.on("disconnected", handleUpdate);
		} else if (typeof eventSource.addListener === "function") {
			eventSource.addListener("*", handleUpdate);
		}

		return () => {
			if (typeof eventSource.off === "function") {
				eventSource.off("peer.joined", handleUpdate);
				eventSource.off("peer.left", handleUpdate);
				eventSource.off("self.updated", handleUpdate);
				eventSource.off("connected", handleUpdate);
				eventSource.off("disconnected", handleUpdate);
			} else if (typeof eventSource.removeListener === "function") {
				eventSource.removeListener("*", handleUpdate);
			}
		};
	}, [client, isMock]);

	const join = useCallback(
		async (token: string, appId?: string) => {
			if (token === "mock-token") {
				console.log("[Mock Mode] Simulating voice connection");
				setIsMock(true);
				setIsConnected(true);
				setIsMicMuted(false);
				return;
			}

			try {
				// biome-ignore lint/suspicious/noExplicitAny: library config type
				const config: any = {
					authToken: token,
				};
				if (appId) {
					config.appId = appId;
				}
				// Explicitly request audio to ensure media tracks are initialized
				config.defaults = {
					audio: true,
					video: false,
				};
				const newClient = await initClient(config);
				if (newClient) {
					await newClient.join();
				}
			} catch (e) {
				console.error("Failed to join RealtimeKit:", e);
				// We don't re-throw here to allow UI to handle the error state if needed,
				// or we could throw. Ideally the component handles it.
				throw e;
			}
		},
		[initClient],
	);

	const leave = useCallback(async () => {
		if (isMock) {
			console.log("[Mock Mode] Leaving session");
			setIsConnected(false);
			setIsMock(false);
			return;
		}
		if (client) {
			await client.leave();
		}
	}, [client, isMock]);

	const toggleMic = useCallback(async () => {
		if (isMock) {
			setIsMicMuted((prev) => !prev);
			return;
		}
		// biome-ignore lint/suspicious/noExplicitAny: casting for potential missing types
		const c = client as any;
		console.log(
			"[useRealtime] toggleMic clicked. Client keys:",
			Object.keys(c || {}),
		);

		// If media is missing, try to set it up
		if (!c?.self?.media) {
			console.warn(
				"[useRealtime] c.self.media is missing. Attempting to setup tracks manually...",
			);
			if (c?.self?.setupTracks) {
				try {
					console.log("[useRealtime] Calling setupTracks({ audio: true })...");
					await c.self.setupTracks({ audio: true, video: false });
					console.log("[useRealtime] Track setup requested.");

					// After setup, check again or just try to enable if it appeared
					if (c.self?.media) {
						// Success
					}
				} catch (err) {
					console.error("[useRealtime] Failed to manual setup tracks:", err);
					return; // Stop if setup failed
				}
			} else {
				console.error(
					"[useRealtime] c.self.setupTracks method not found. Cannot initialize audio.",
				);
				return;
			}
		}

		// Re-check media existence after potential setup
		if (c?.self?.media) {
			console.log(
				"[useRealtime] Media object found. AudioEnabled:",
				c.self.media.audioEnabled,
			);
			try {
				if (c.self.media.audioEnabled) {
					console.log("[useRealtime] Disabling audio...");
					await c.self.media.disableAudio();
					// isMicMuted will be updated by event listener
				} else {
					console.log("[useRealtime] Enabling audio...");
					await c.self.media.enableAudio();
				}
				console.log("[useRealtime] Toggle audio completed.");
			} catch (err) {
				console.error("[useRealtime] Failed to toggle audio:", err);
			}
		} else {
			console.error("[useRealtime] Still no media object after setup attempt.");
		}
	}, [client, isMock]);

	return {
		join,
		leave,
		toggleMic,
		isMicMuted,
		isConnected,
		client,
	};
};
