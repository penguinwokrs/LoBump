export type RiotAccount = {
	puuid: string;
	gameName: string;
	tagLine: string;
};

export type Summoner = {
	id: string;
	accountId: string;
	puuid: string;
	name: string;
	profileIconId: number;
	revisionDate: number;
	summonerLevel: number;
};

const ACCOUNT_API_URL = "https://asia.api.riotgames.com";
const SUMMONER_API_URL = "https://jp1.api.riotgames.com";

/**
 * Validates Summoner ID (Riot ID format: Name#Tag) and returns Account info.
 * Uses Account-V1 API (Asia region).
 */
export async function getAccountByRiotId(
	riotId: string,
	apiKey: string,
): Promise<RiotAccount | null> {
	if (!riotId || !riotId.includes("#")) {
		return null;
	}

	const [gameName, tagLine] = riotId.split("#");
	try {
		const res = await fetch(
			`${ACCOUNT_API_URL}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
				gameName,
			)}/${encodeURIComponent(tagLine)}`,
			{
				headers: {
					"X-Riot-Token": apiKey,
				},
			},
		);

		if (res.status === 404) {
			return null;
		}

		if (!res.ok) {
			console.error(
				`[RiotAPI] Account lookup failed for ${riotId}: ${res.status} ${res.statusText}`,
			);
			return null;
		}

		return (await res.json()) as RiotAccount;
	} catch (e) {
		console.error(`[RiotAPI] Account lookup error for ${riotId}:`, e);
		return null;
	}
}

/**
 * Fetches Summoner info by PUUID.
 * Uses Summoner-V4 API (JP1 region).
 */
export async function getSummonerByPuuid(
	puuid: string,
	apiKey: string,
): Promise<Summoner | null> {
	try {
		const res = await fetch(
			`${SUMMONER_API_URL}/lol/summoner/v4/summoners/by-puuid/${puuid}`,
			{
				headers: {
					"X-Riot-Token": apiKey,
				},
			},
		);

		if (!res.ok) {
			console.error(
				`[RiotAPI] Summoner lookup failed for puuid ${puuid}: ${res.status} ${res.statusText}`,
			);
			return null;
		}

		return (await res.json()) as Summoner;
	} catch (e) {
		console.error(`[RiotAPI] Summoner lookup error for puuid ${puuid}:`, e);
		return null;
	}
}

/**
 * Returns the CDN URL for a profile icon ID.
 * Defaults to "latest" version, might need occasional update or fetch version.
 * Using hardcoded version for simplicity as getting Data Dragon version requires another call.
 */
export function getProfileIconUrl(iconId: number): string {
	// Using a relatively recent version, 14.1.1 is safe fallback, or use "latest" if cdn supports it (it usually doesn't without specific version)
	// Ideally we fetch version from https://ddragon.leagueoflegends.com/api/versions.json
	// For now, let's hardcode a recent one "14.23.1" (from late 2024/early 2025 context) or slightly older safe bet.
	const version = "14.23.1";
	return `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${iconId}.png`;
}
