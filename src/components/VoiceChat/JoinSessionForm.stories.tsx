import type { Meta, StoryObj } from "@storybook/react";
import { JoinSessionForm } from "./JoinSessionForm";

const meta: Meta<typeof JoinSessionForm> = {
	title: "VoiceChat/JoinSessionForm",
	component: JoinSessionForm,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		onSummonerIdChange: { action: "summoner id changed" },
		onSessionIdChange: { action: "session id changed" },
		onJoin: { action: "join clicked" },
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		summonerId: "",
		sessionId: "",
		loading: false,
		error: "",
	},
};

export const Filled: Story = {
	args: {
		summonerId: "MySummonerName",
		sessionId: "MyGameID",
		loading: false,
		error: "",
	},
};

export const Loading: Story = {
	args: {
		summonerId: "MySummonerName",
		sessionId: "MyGameID",
		loading: true,
		error: "",
	},
};

export const WithError: Story = {
	args: {
		summonerId: "MySummonerName",
		sessionId: "MyGameID",
		loading: false,
		error: "Session not found",
	},
};

export const DisabledSessionInput: Story = {
	args: {
		summonerId: "",
		sessionId: "preset-session-id",
		loading: false,
		error: "",
		disableSessionInput: true,
	},
};
